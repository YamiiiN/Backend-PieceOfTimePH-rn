const express = require('express');
const router = express.Router();
const upload = require('../utils/multer');
const { isAuthenticatedV2, isAuthenticated,  authorizeRoles} = require('../middleware/auth');

const {
    saveToken,
    register,
    login,
} = require('../controllers/user');

router.post('/register', upload.array('images'), register)

router.post('/login', login)

router.post('/save/token', isAuthenticatedV2, saveToken)



module.exports = router;