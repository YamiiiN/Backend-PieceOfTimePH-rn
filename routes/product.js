const express = require('express');
const router = express.Router();
const upload = require('../utils/multer')


const { create, getAllProducts, getSingleProduct, updateProduct, deleteProduct, getProductsByCategory, getOneProductPerCategory } = require('../controllers/product')



router.post('/create', upload.array('images'), create)

router.get('/get/all', getAllProducts)

router.put('/update/:id', upload.array('images'), updateProduct)

router.delete('/delete/:id', deleteProduct)

router.get('/get/productsByCategory/:category', getProductsByCategory)

router.get('/getOneProductPerCategory', getOneProductPerCategory)

router.get('/:id', getSingleProduct)

module.exports = router;