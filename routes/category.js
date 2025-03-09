const express = require("express");
const router = express.Router();


const { create, getCategory, getAllCategory, update, deleteCategory } = require('../controllers/category')



router.post('/create', create)

router.get('/:id', getCategory)

router.get('/get/all', getAllCategory)

router.put('/update/:id', update)

router.delete('/delete/:id', deleteCategory)



module.exports = router;