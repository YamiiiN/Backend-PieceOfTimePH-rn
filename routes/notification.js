const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Adjust path as needed
const { isAuthenticated, isAuthenticatedV2, authorizeRoles } = require('../middleware/auth');

// Choose which auth middleware to use based on your needs
const auth = isAuthenticated;

// Route to register/update push token
router.post('/register-push-token', auth, async (req, res) => {
    try {
        const { pushToken } = req.body;

        if (!pushToken) {
            return res.status(400).json({
                success: false,
                message: 'Push token is required'
            });
        }

        // Update user's push token
        const user = await User.findByIdAndUpdate(
            req.user._id, // Make sure this matches how your user ID is stored
            { pushToken },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Push token registered successfully'
        });

    } catch (error) {
        console.error('Error registering push token:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});



module.exports = router;