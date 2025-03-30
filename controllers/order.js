const Order = require('../models/Order');
const Product = require('../models/Product');
const mongoose = require('mongoose');

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
        const userId = req.user._id; // Assuming req.user is set after authentication
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