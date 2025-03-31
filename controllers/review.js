const Review = require('../models/Review');
exports.create = async (req, res, next) => {
    try {
        req.body.user = req.user._id;

        const review = await Review.create(req.body);

        res.json({
            message: "Product created successfully.",
            review: review,
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while creating feedback.' });
    }
};

exports.getAllReviews = async (req, res, next) => {

    try {

        const reviews = await Review.find();

        res.json({
            message: "Reviews retrieved.",
            reviews: reviews,
        })

    } catch (error) {

        console.log(error);

        return res.json({
            message: 'System error occured.',
            success: false,
        })


    }

}

exports.getReviewsByProduct = async (req, res, next) => {
    try {
        const { productId } = req.params; 

        const reviews = await Review.find({ product: productId }).populate("user", "first_name last_name email");
        // console.log(reviews)
        res.json({  
            message: "Reviews retrieved successfully.",
            reviews: reviews,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while fetching reviews." });
    }
};

exports.updateReviewByProduct = async (req, res, next) => {
    try {
        const { productId, reviewId } = req.params; 
        const userId = req.user._id; 
        const { rating, comment } = req.body; 

        const review = await Review.findOne({ _id: reviewId, product: productId, user: userId });

        if (!review) {
            return res.status(404).json({ error: "Review not found or you are not authorized to update this review." });
        }

        review.rating = rating || review.rating;
        review.comment = comment || review.comment;
        await review.save();

        res.json({
            message: "Review updated successfully.",
            review: review,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while updating the review." });
    }
};

exports.deleteReviewByUser = async (req, res, next) => {
    try {
        const { productId, reviewId } = req.params; 
        const userId = req.user._id; 

        const review = await Review.findOne({ _id: reviewId, product: productId, user: userId });

        if (!review) {
            return res.status(404).json({ error: "Review not found or you are not authorized to delete this review." });
        }

        await review.deleteOne();

        res.json({
            message: "Review deleted successfully.",
            success: true
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred while deleting the review." });
    }
};
