const express = require('express');
const router = express.Router();
const { isAuthenticated, isAuthenticatedV2, authorizeRoles } = require('../middleware/auth');

const {
    getUserOrders, 
    create, 
    all,
    updateOrder
} = require("../controllers/order")


router.post('/create', isAuthenticated, create);
router.get('/all', isAuthenticated, authorizeRoles('admin'), all);
router.get('/user/orders', isAuthenticated, authorizeRoles('user'), getUserOrders);
router.put('/:id', isAuthenticated, authorizeRoles('admin'), updateOrder);

module.exports = router;