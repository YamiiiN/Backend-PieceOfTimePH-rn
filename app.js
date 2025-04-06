const express = require("express");
const app = express();
const cors = require('cors');

//CONFIGS
app.use(express.json());
app.use(cors()); 


// IMPORT ROUTES
const productRoutes = require('./routes/product');
const userRoutes = require('./routes/user');
const orderRoutes = require('./routes/order');
const reviewRoutes = require('./routes/review');
const notificationRoutes = require('./routes/notification');
const promotionRoutes = require('./routes/promotion');

require('dotenv').config();

// USE ROUTES
app.use('/product', productRoutes)
app.use('/user', userRoutes);
app.use('/order', orderRoutes);
app.use('/review', reviewRoutes);
app.use('/notification', notificationRoutes);
app.use('/promotions', promotionRoutes);


module.exports = app;