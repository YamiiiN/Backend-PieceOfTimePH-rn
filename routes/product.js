const express = require('express');
const router = express.Router();
const upload = require('../utils/multer')


const { create, update, getSingle, deleteProduct, all } = require('../controllers/product')



router.post('/create', upload.array('images'), create)

router.get('/:id', getSingle)

router.get('/get/all', all)

router.put('/update/:id', upload.array('images'), update)

router.delete('/delete/:id', deleteProduct)



module.exports = router;