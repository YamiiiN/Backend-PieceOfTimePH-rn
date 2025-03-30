const mongoose = require("mongoose");

const orderModel = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
    },

    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },

    shipping_address : {
        type: String, 
        required: [true, "Shipping Address is required."],
    },

    shipping_method : {
        type: String, 
        required: [true, "Shipping Method is required."],
    }, 

    payment_method : {
        type: String, 
        required: [true, "Payment Method is required."],
    },

    contact_number : {
        type: String, 
        required: [true, "Contact Number is required."],
    },

    order_items: [{
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
        }, 

        quantity: {
            type: Number,
            required: true,
        }
    }],

    status: {
        type: String, 
        required: true,
        default: 'Pending', 
    },

}, { timestamps: true })


module.exports = mongoose.model("Order", orderModel)