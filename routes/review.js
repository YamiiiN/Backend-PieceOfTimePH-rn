const express = require('express');
const router = express.Router();
const { isAuthenticated, isAuthenticatedV2, authorizeRoles } = require('../middleware/auth');

const {
    create, 
    getAllReviews,
    getReviewsByProduct,
    updateReviewByProduct,
    deleteReviewByUser,
    checkUserReview,
    checkCanReview,
} = require("../controllers/review")

router.post('/create', isAuthenticated, authorizeRoles('user'), create);
router.get('/allList', getAllReviews);
router.get('/byProduct/:productId', getReviewsByProduct);
router.put('/update/:productId/:reviewId', isAuthenticated, updateReviewByProduct);
router.delete("/delete/:productId/:reviewId", isAuthenticated, deleteReviewByUser);

router.get('/check-review/:productId', checkUserReview);
router.get('/can-review/:productId', isAuthenticated, checkCanReview);

module.exports = router;