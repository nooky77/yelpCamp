const Review = require("../models/review");
const Campground = require("../models/campground");
const catchAsync = require("../helpers/catchAsync");
const ObjectID = require('mongoose').Types.ObjectId;

const review_create_post = catchAsync(async(req, res) => {
    const { campId } = req.params;
    const camp = await Campground.findById(campId);
    const review = new Review(req.body);
    review.author = req.user._id;
    await review.save();
    camp.reviews.push(review);
    await camp.save();
    req.flash("success", "Successfully created review!");
    res.redirect(`/campgrounds/${camp.id}`); 
})

const review_delete_post = catchAsync(async(req, res) => {
    const { campId, reviewId } = req.params;
    await Campground.findByIdAndUpdate(campId, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted review!");
    res.redirect(`/campgrounds/${campId}`)
})

module.exports = {
    review_create_post,
    review_delete_post
}