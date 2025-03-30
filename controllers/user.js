const User = require('../models/User');
const cloudinary = require('cloudinary');
const { sendToken } = require('../utils/jwtToken');
const admin = require('../utils/firebase');
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