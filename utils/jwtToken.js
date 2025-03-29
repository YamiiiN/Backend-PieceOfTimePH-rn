// const sendToken = (user, res) => {

//     // console.log(user);

//     const token = user.getJwtToken();
//     // console.log(token);

//     const options = {
//         expires: new Date(
//             Date.now() + 7 * 24 * 60 * 60 * 1000
//         ),
//         httpOnly: true,
//     }

//     res.cookie('token', token, options).json({
//         user,
//         success: true,
//     })

// }


// module.exports = {
//     sendToken,
// }

const sendToken = (user, res) => {
    const token = user.getJwtToken();
    
    // const expiryTime = new Date(
    //     Date.now() + 7 * 24 * 60 * 60 * 1000
    // );

    const expiresIn = parseInt(process.env.JWT_EXPIRES_TIME) || 86400000;
    const expiryTime = new Date(Date.now() + expiresIn);
    
    // Include the token directly in the response
    res.json({
        success: true,
        message: "Login successful",
        user: {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role,
            token: token,
            expiresAt: expiryTime.getTime()
        }
    });
}

module.exports = {
    sendToken,
}