const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const notificationService = require('../services/notificationService');
const mongoose = require('mongoose');
const Notification = require('../models/Notification');

exports.create = async (req, res, next) => {
    try {
        req.body.user = req.user._id;

        const order = await Order.create(req.body);
        const orderItems = order.order_items;

        for (i in orderItems) {
            const product = await Product.findById(orderItems[i].product);
            const updateStock = product.stock_quantity - orderItems[i].quantity;
            product.stock_quantity = updateStock;

            product.save();
        }

        res.json({
            message: "Order success."
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while creating the order.' });
    }
};
exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({ user: userId }).populate({
            path: 'order_items.product',
            select: 'name sell_price images',
        });

        res.status(200).json({
            success: true,
            orders,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders.',
        });
    }
};

exports.all = async (req, res, next) => {

    try {

        const orders = await Order.find()
            .populate({
                path: 'order_items.product',
                select: 'name images quantity sell_price'
            })
            .populate({
                path: 'user',
                select: 'first_name last_name email images',
            })
        // console.log(orders)
        res.json({
            message: "Order Lists.",
            orders: orders
        })

    } catch (error) {

        console.log(error)

    }
}

// exports.updateOrder = async (req, res) => {
//   try {
//       const { id } = req.params;
//       const { status } = req.body;

//       // Find the order by ID
//       const order = await Order.findById(id);

//       if (!order) {
//           return res.status(404).json({
//               success: false,
//               message: 'Order not found'
//           });
//       }

//       // Update the status of the order
//       order.status = status;
//       await order.save();

//       // Populate order details for the response
//       const updatedOrder = await Order.findById(id)
//           .populate({
//               path: 'order_items.product',
//               select: 'name images quantity sell_price'
//           })
//           .populate({
//               path: 'user',
//               select: 'first_name last_name email images pushToken'
//           });

//       // Check if the user has a push token and send notification
//       if (updatedOrder.user && updatedOrder.user.pushToken) {
//           const notificationResult = await notificationService.sendNotification(
//               [updatedOrder.user.pushToken],
//               'Order Status Update',
//               `Your order #${updatedOrder.orderNumber || id} status has been updated to: ${status}`,
//               {
//                   orderId: updatedOrder._id.toString(),
//                   status,
//                   updatedAt: new Date().toISOString()
//               }
//           );

//           console.log('Notification sent:', notificationResult);
//       }

//       // Return the updated order
//       res.status(200).json({
//           success: true,
//           message: 'Order status updated successfully',
//           order: updatedOrder
//       });

//   } catch (error) {
//       console.error(error);
//       res.status(500).json({
//           success: false,
//           message: 'Failed to update order status',
//           error: error.message
//       });
//   }
// };

exports.updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        order.status = status;
        await order.save();

        const updatedOrder = await Order.findById(id)
            .populate({
                path: 'order_items.product',
                select: 'name images quantity sell_price'
            })
            .populate({
                path: 'user',
                select: 'first_name last_name email images pushToken'
            });

        const notification = new Notification({
            user: updatedOrder.user._id,
            title: 'Order Status Update',
            message: `Your order #${updatedOrder.orderNumber || id} status has been updated to: ${status}`,
            type: 'order',
            read: false,
            data: {
                orderId: updatedOrder._id.toString(),
                status,
                updatedAt: new Date().toISOString()
            }
        });

        await notification.save();

        if (updatedOrder.user && updatedOrder.user.pushToken) {
            const notificationResult = await notificationService.sendNotification(
                [updatedOrder.user.pushToken],
                'Order Status Update',
                `Your order #${updatedOrder.orderNumber || id} status has been updated to: ${status}`,
                {
                    orderId: updatedOrder._id.toString(),
                    status,
                    updatedAt: new Date().toISOString()
                }
            );

            console.log('Push notification sent:', notificationResult);
        }

        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
            order: updatedOrder
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order status',
            error: error.message
        });
    }
};