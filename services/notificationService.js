const { Expo } = require('expo-server-sdk');

class NotificationService {
  constructor() {
    this.expo = new Expo({
      accessToken: process.env.EXPO_ACCESS_TOKEN
    });
  }

  async sendNotification(pushTokens, title, body, data = {}) {

    if (!Array.isArray(pushTokens) || pushTokens.length === 0) {
      return { success: false, message: 'No push tokens provided' };
    }

    let messages = [];

    for (let pushToken of pushTokens) {
      if (!Expo.isExpoPushToken(pushToken)) {
        console.error(`Push token ${pushToken} is not a valid Expo push token`);
        continue;
      }

      
      messages.push({
        to: pushToken,
        sound: 'default',
        title,
        body,
        data,
      });
    }


    let chunks = this.expo.chunkPushNotifications(messages);
    let tickets = [];

    try {
      for (let chunk of chunks) {
        try {
          let ticketChunk = await this.expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          console.error('Error sending push notification chunk:', error);
        }
      }
      
      this._processReceipts(tickets);
      
      return { 
        success: true, 
        ticketsCount: tickets.length,
        tickets
      };
    } catch (error) {
      console.error('Error in sendNotification:', error);
      return { success: false, error: error.message };
    }
  }

  async _processReceipts(tickets) {
    let receiptIds = [];
    
    // Extract receipt IDs from successful tickets
    for (let ticket of tickets) {
      if (ticket.status === 'ok') {
        receiptIds.push(ticket.id);
      }
    }
    
    if (receiptIds.length === 0) return;

    let receiptIdChunks = this.expo.chunkPushNotificationReceiptIds(receiptIds);
    
    setTimeout(async () => {
      for (let chunk of receiptIdChunks) {
        try {
          let receipts = await this.expo.getPushNotificationReceiptsAsync(chunk);
          
          for (let receiptId in receipts) {
            let { status, message, details } = receipts[receiptId];
            
            if (status === 'ok') {
              continue;
            } else if (status === 'error') {
              console.error(`Push notification receipt error: ${message}`);
              
              if (details && details.error) {
                console.error(`Error code: ${details.error}`);
                
                if (details.error === 'DeviceNotRegistered') {
                  console.log(`Token should be removed from database: related to receipt ${receiptId}`);
                }
              }
            }
          }
        } catch (error) {
          console.error('Error checking push notification receipts:', error);
        }
      }
    }, 5000); 
  }
}

module.exports = new NotificationService();