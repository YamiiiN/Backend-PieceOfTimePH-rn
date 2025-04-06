const User = require('../models/User');
const cloudinary = require('cloudinary');
const { sendToken } = require('../utils/jwtToken');
const admin = require('../utils/firebase');
const bcrypt = require('bcryptjs');

exports.saveToken = async (req, res, next) => {

    try {

        const user = await User.findById(req.user._id);

        user.notificationToken = req.body.token;

        user.save();

        res.json({
            message: "Notification token save",
        })

    } catch (error) {
        console.log(error)
        res.json({
            message: "System error occured.",
            success: false
        })
    }

}

exports.register = async (req, res, next) => {

    try {

        // EMPTY ARRAY PARA SA IMAGES
        req.body.images = [];

        const images = req.files;

        for (let i = 0; i < images.length; i++) {

            const data = await cloudinary.v2.uploader.upload(images[i].path);

            // console.log(data);

            req.body.images.push({

                public_id: data.public_id,
                url: data.url,

            })
        }

        // // Create user in Firebase Authentication
        // const firebaseUser = await admin.auth().createUser({
        //     email: req.body.email,
        //     password: req.body.password, // Firebase requires a password
        //     displayName: req.body.name
        // });

        // // Store Firebase UID in MongoDB
        // req.body.firebaseUID = firebaseUser.uid;

        const user = await User.create(req.body);

        res.json({
            message: "Account created successfully",
            user,
        })

    } catch (error) {
        console.log(error)
        res.json({
            message: "System error occured.",
            success: false
        })
    }

}

exports.login = async (req, res, next) => {

    try {

        const { password, email } = req.body;

        const user = await User.findOne({ email: email });


        // Kapag hindi pa register ang user
        if (!user) {
            res.json({
                message: "This email is not registered yet."
            })
        }


        // kapag hindi same ng password na na input ni user
        if (!await user.comparePassword(password)) {
            return res.json({
                message: "Incorrect credentials."
            })
        }

        // return res.json({
        //     message: "Register ka na",
        //     user: user,
        // })


        sendToken(user, res);


    } catch (error) {
        console.log(error)
        res.json({
            message: "System error occured.",
            // success: false
        })
    }

}

exports.getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        res.json({
            message: "User profile retrieved successfully.",
            user,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while retrieving the profile." });
    }
};


exports.updateProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        const { first_name, last_name, email, password } = req.body;

        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;
        if (email) user.email = email;

        if (password) {
            user.password = await bcrypt.hash(password, 10);
        }

        if (req.file) {
            if (user.images.length > 0) {
                await cloudinary.v2.uploader.destroy(user.images[0].public_id);
            }

            const uploadedImage = await cloudinary.v2.uploader.upload(req.file.path);

            user.images = [{
                public_id: uploadedImage.public_id,
                url: uploadedImage.url,
            }];
        }

        await user.save();

        res.json({
            message: "Profile updated successfully.",
            user,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "An error occurred while updating the profile." });
    }
};

exports.updatePushToken = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id; 
        const { pushToken } = req.body;

        console.log('Update Push Token Request:', {
            userId,
            pushToken,
            user: req.user
        });

        if (!pushToken) {
            return res.status(400).json({
                success: false,
                message: 'Push token is required'
            });
        }

        // First, check if the user exists
        const userExists = await User.findById(userId);
        if (!userExists) {
            console.error(`User not found with ID: ${userId}`);
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        console.log('User found:', {
            id: userExists._id,
            hasPushTokenField: 'pushToken' in userExists._doc,
            currentPushToken: userExists.pushToken
        });

        // Try direct update approach
        const result = await User.updateOne(
            { _id: userId },
            { $set: { pushToken: pushToken } }
        );

        console.log('Update result:', result);

        if (result.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found during update'
            });
        }

        if (result.modifiedCount === 0) {
            console.log('No changes made - token might be the same');
        }

        // Verify the update worked
        const updatedUser = await User.findById(userId);
        
        return res.status(200).json({
            success: true,
            message: 'Push token update attempt completed',
            updateResult: result,
            tokenVerification: {
                tokenMatches: updatedUser.pushToken === pushToken,
                currentToken: updatedUser.pushToken
            }
        });
    } catch (error) {
        console.error('Error in updatePushToken:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update push token',
            error: error.message,
            stack: error.stack
        });
    }
};
