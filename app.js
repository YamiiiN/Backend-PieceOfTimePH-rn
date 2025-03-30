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

require('dotenv').config();

// USE ROUTES
app.use('/product', productRoutes)
app.use('/user', userRoutes);
app.use('/order', orderRoutes);


module.exports = app;