// campground_index, campground_details, campground_create_get, campground_create_post, campground_update, campground_delete;
const Campground = require("../models/campground");
const catchAsync = require("../helpers/catchAsync");
const ObjectID = require('mongoose').Types.ObjectId;


// Get route of all campgrounds
const campground_index = catchAsync(async(req, res) => {
    const camps = await Campground.find();
    res.render("./campgrounds/index", { camps });
})

// Get route of campground detail
const campground_details = catchAsync(async(req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)){
        req.flash("error", "Campground not found!");
        return res.redirect("/campgrounds")
    }
    const camp = await Campground.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
        }).populate("author");
    res.render("./campgrounds/details", { camp })
})

// Get route of create campground
const campground_create_get = (req, res) => {
    res.render("./campgrounds/create")
}

// Post route of create campground
const campground_create_post = catchAsync(async(req, res) => {
    const camp = new Campground(req.body);
    camp.author = req.user._id;
    await camp.save();
    req.flash("success", "You successfully created a campground!");
    res.redirect("/campgrounds"); 
})

// Get route of update campgrounds
const campground_update_get = catchAsync(async(req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)){
        req.flash("error", "Campground not found!");
        return res.redirect("/campgrounds")
    }
    const camp = await Campground.findById(id);
    res.render("./campgrounds/edit", {camp})
})

// Post route of update campground
const campground_update_post = catchAsync(async(req, res) => {
    const id = req.params.id;
    const camp = await Campground.findByIdAndUpdate(id, req.body);
    req.flash("success", "You successfully updated the campground!")
    res.redirect(`/campgrounds/${camp.id}`);
})

// Delete route of campground
const campground_delete = catchAsync(async(req, res) => {
    const id = req.params.id;
    await Campground.findByIdAndDelete(id);
    req.flash("success", "Successfully deleted campground!");
    res.redirect("/campgrounds")
})

module.exports = {
    campground_index,
    campground_create_get,
    campground_create_post,
    campground_details,
    campground_update_get,
    campground_update_post,
    campground_delete
}