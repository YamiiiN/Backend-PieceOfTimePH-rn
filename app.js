const express = require("express");
const app = express();
const cors = require('cors');

//CONFIGS
app.use(express.json());
app.use(cors()); 


// IMPORT ROUTES
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product')


require('dotenv').config();


// USE ROUTES
app.use('/category', categoryRoutes);
app.use('/product', productRoutes)


module.exports = app;