const mongoose = require("mongoose");

const notificationModel = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    read: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        enum: ['general', 'order', 'payment', 'promo', 'feedback'],
        default: 'general'
    },
    data: {
        type: Object,
        default: {}
    }
}, { timestamps: true })


module.exports = mongoose.model("Notification", notificationModel)