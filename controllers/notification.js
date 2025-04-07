const mongoose = require('mongoose');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { Expo } = require('expo-server-sdk');

// Initialize Expo SDK
let expo = new Expo();

// Register push token
exports.registerToken = async (req, res, next) => {
    try {
        const { pushToken } = req.body;

        if (!pushToken) {
            return res.status(400).json({
                success: false,
                message: 'Push token is required'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { pushToken },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Push token registered successfully'
        });

    } catch (error) {
        console.error('Error registering push token:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
}

// Create a new notification
exports.createNotification = async (req, res, next) => {
    try {
        const { userId, title, message, type } = req.body;

        // Validation
        if (!userId || !title || !message) {
            return res.status(400).json({
                success: false,
                message: 'userId, title and message are required fields'
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Create notification in database
        const newNotification = new Notification({
            user: userId,
            title,
            message,
            type: type || 'general',
            read: false
        });

        await newNotification.save();

        // Send push notification if user has a registered token
        if (user.pushToken) {
            // Validate token
            if (!Expo.isExpoPushToken(user.pushToken)) {
                console.error(`Push token ${user.pushToken} is not a valid Expo push token`);
            } else {
                // Create message
                const pushMessage = {
                    to: user.pushToken,
                    sound: 'default',
                    title: title,
                    body: message,
                    data: {
                        type: type || 'general',
                        notificationId: newNotification._id.toString()
                    }
                };

                try {
                    // Send notification
                    let chunks = expo.chunkPushNotifications([pushMessage]);
                    for (let chunk of chunks) {
                        await expo.sendPushNotificationsAsync(chunk);
                    }
                } catch (pushError) {
                    console.error('Error sending push notification:', pushError);
                }
            }
        }

        return res.status(201).json({
            success: true,
            message: 'Notification created successfully',
            notification: newNotification
        });

    } catch (error) {
        console.error('Error creating notification:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
}

// Get all notifications for a user
exports.getUserNotifications = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Get all notifications for this user, sorted by date (newest first)
        const notifications = await Notification.find({ user: userId })
            .sort({ createdAt: -1 })
            .limit(50);  // Limit to recent 50 notifications

        return res.status(200).json(notifications);

    } catch (error) {
        console.error('Error fetching user notifications:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
}

// Mark a notification as read
exports.markAsRead = async (req, res, next) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user._id;

        // Find and update the notification
        const notification = await Notification.findOneAndUpdate(
            { _id: notificationId, user: userId },
            { read: true },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found or does not belong to user'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Notification marked as read',
            notification
        });

    } catch (error) {
        console.error('Error marking notification as read:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
}

// Mark all notifications as read
exports.markAllAsRead = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Update all unread notifications for this user
        const result = await Notification.updateMany(
            { user: userId, read: false },
            { read: true }
        );

        return res.status(200).json({
            success: true,
            message: 'All notifications marked as read',
            count: result.modifiedCount
        });

    } catch (error) {
        console.error('Error marking all notifications as read:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
}

// Delete a notification
exports.deleteNotification = async (req, res, next) => {
    try {
        const notificationId = req.params.id;
        const userId = req.user._id;

        // Find and delete the notification
        const notification = await Notification.findOneAndDelete({
            _id: notificationId,
            user: userId
        });

        if (!notification) {
            return res.status(404).json({
                success: false,
                message: 'Notification not found or does not belong to user'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Notification deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting notification:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
}

// Get unread notification count
exports.getUnreadCount = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const count = await Notification.countDocuments({
            user: userId,
            read: false
        });

        return res.status(200).json({
            success: true,
            unreadCount: count
        });

    } catch (error) {
        console.error('Error getting unread notification count:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
}