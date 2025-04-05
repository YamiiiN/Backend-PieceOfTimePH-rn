const express = require('express');
const router = express.Router();
const { isAuthenticated, isAuthenticatedV2, authorizeRoles } = require('../middleware/auth');

const {
    registerToken,
    createNotification, 
    getUserNotifications,
    markAllAsRead,
    markAsRead,
    deleteNotification,
    getUnreadCount

} = require('../controllers/notification')


router.post('/register-push-token', isAuthenticated, registerToken);

router.post('/create', isAuthenticated, createNotification);

router.get('/user-notifications', isAuthenticated, getUserNotifications);

router.put('/mark-read/:id', isAuthenticated, markAsRead);

router.put('/mark-all-read', isAuthenticated, markAllAsRead);

router.delete('/:id', isAuthenticated, deleteNotification);

router.get('/unread-count', isAuthenticated, getUnreadCount);




module.exports = router;