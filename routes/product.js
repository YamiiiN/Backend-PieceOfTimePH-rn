const express = require('express');
const router = express.Router();
const upload = require('../utils/multer')


const { create, getAllProducts, getSingleProduct, updateProduct, deleteProduct } = require('../controllers/product')



router.post('/create', upload.array('images'), create)

router.get('/:id', getSingleProduct)

router.get('/get/all', getAllProducts)

router.put('/update/:id', upload.array('images'), updateProduct)

router.delete('/delete/:id', deleteProduct)



module.exports = router;