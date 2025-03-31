const express = require('express');
const router = express.Router();
const { isAuthenticated, isAuthenticatedV2 } = require('../middleware/auth');

const {
    create, 
    getAllReviews,
    getReviewsByProduct,
    updateReviewByProduct,
    deleteReviewByUser,
} = require("../controllers/review")

router.post('/create', isAuthenticated, create);

router.get('/allList', isAuthenticated, getAllReviews);

router.get('/byProduct/:productId', isAuthenticated, getReviewsByProduct);

router.put('/update/:productId/:reviewId', isAuthenticated, updateReviewByProduct);

router.delete("/delete/:productId/:reviewId", isAuthenticated, deleteReviewByUser);


module.exports = router;