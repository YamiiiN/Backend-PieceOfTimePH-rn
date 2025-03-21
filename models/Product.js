const mongoose = require('mongoose');

const productModel = new mongoose.Schema({

    name: {
        type: String,
        required: [true, "Product Name is required."],
        trim: true,
    },

    description: {
        type: String,
        required: true,
        trim: true,
    },

    category: { 
        type: String,
        required: [true, 'Please select category for this product'],
        enum: {
            values: [
                "Classic",
                'Dive',
                'Pilot',
                'Field',
                'Dress',
                'Chronograph',
                'Moon Phase',
                'Vintage'
            ],
            message: 'Please select correct category for product'
        }
    },

    movement: {
        type: String,
        required: [true, 'Please select movement for this product'],
        enum: {
            values: [
                "Mechanical",
                'Automatic',
                'Quartz',
                'Solar',
                'Kinetic'
            ],
            message: 'Please select movement type for product'
        }
    },

    brand: {
        type: String,
        required: [true, 'Please select brand for this product'],
        enum: {
            values: [
                "Seiko",
                'Citizen',
                'Rolex',
                'Omega',
                'Cartier',
                'Breitling',
                'Tudor',
                'Grand Seiko',
            ],
            message: 'Please select brand type for product'
        }
    },

 
    images: [
        {
            public_id: {
                type: String,
                required: true,
            },

            url: {
                type: String,
                required: true,
            }
        }
    ],

    sell_price: {
        type: Number,
        required: true,
    },

    cost_price: {
        type: Number,
        required: true,
    },

    stock_quantity: {
        type: Number,
        required: true,
        default: 0,
    }

}, { timestamps: true });



module.exports = mongoose.model('Product', productModel)