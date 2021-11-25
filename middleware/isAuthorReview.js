const Review = require("../models/review");

const isAuthorReview = async (req, res, next) => {
    const { campId, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/campgrounds/${campId}`);
    }
    next();
}

module.exports = isAuthorReview;