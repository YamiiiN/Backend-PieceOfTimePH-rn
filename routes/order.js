const express = require('express');
const router = express.Router();
const { isAuthenticated, isAuthenticatedV2 } = require('../middleware/auth');

const {
    getUserOrders, 
    create, 
    all,
} = require("../controllers/order")


router.post('/create', isAuthenticated, create);

router.get('/all', isAuthenticated, all);

router.get('/user/orders', isAuthenticated, getUserOrders);

module.exports = router;