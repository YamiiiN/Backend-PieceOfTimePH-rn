const express = require('express');
const router = express.Router();
const upload = require('../utils/multer')
const { 
    create, getAllProducts, getSingleProduct, 
    updateProduct, deleteProduct, getProductsByCategory, 
    getOneProductPerCategory 
} = require('../controllers/product');
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');

router.post('/create', isAuthenticated, authorizeRoles('admin'), upload.array('images'), create);
router.put('/update/:id', isAuthenticated, authorizeRoles('admin'), upload.array('images'), updateProduct);
router.delete('/delete/:id', isAuthenticated, authorizeRoles('admin'), deleteProduct);

router.get('/get/all', getAllProducts);
router.get('/get/productsByCategory/:category', getProductsByCategory);
router.get('/getOneProductPerCategory', getOneProductPerCategory);
router.get('/:id', getSingleProduct);

module.exports = router;