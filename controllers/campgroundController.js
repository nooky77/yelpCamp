// campground_index, campground_details, campground_create_get, campground_create_post, campground_update, campground_delete;
const Campground = require("../models/campground");
const catchAsync = require("../helpers/catchAsync");
const ObjectID = require("mongoose").Types.ObjectId;
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

// Get route of all campgrounds
const campground_index = catchAsync(async (req, res) => {
    const camps = await Campground.find();
    res.render("./campgrounds/index", { camps });
});

// Get route of campground detail
const campground_details = catchAsync(async (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        req.flash("error", "Campground not found!");
        return res.redirect("/campgrounds");
    }
    const camp = await Campground.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("author");
    res.render("./campgrounds/details", { camp });
});

// Get route of create campground
const campground_create_get = (req, res) => {
    res.render("./campgrounds/create");
};

// Post route of create campground
const campground_create_post = catchAsync(async (req, res) => {
    const geoData = await geocoder
        .forwardGeocode({
            query: req.body.location,
            limit: 1,
        })
        .send();
    if (!geoData.body.features.length) {
        req.flash("error", "Location not found !");
        return res.redirect("/campgrounds/new");
    }
    const camp = new Campground(req.body);
    camp.geometry = geoData.body.features[0].geometry;
    camp.images = req.files.map((file) => ({
        url: file.path,
        filename: file.filename,
    }));
    camp.author = req.user._id;
    await camp.save();
    req.flash("success", "You successfully created a campground!");
    res.redirect("/campgrounds");
});

// Get route of update campgrounds
const campground_update_get = catchAsync(async (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        req.flash("error", "Campground not found!");
        return res.redirect("/campgrounds");
    }
    const camp = await Campground.findById(id);
    res.render("./campgrounds/edit", { camp });
});

// Post route of update campground
const campground_update_post = catchAsync(async (req, res) => {
    const id = req.params.id;
    const camp = await Campground.findByIdAndUpdate(id, req.body);
    const pictures = req.files.map((pic) => ({
        url: pic.path,
        filename: pic.filename,
    }));
    camp.images.push(...pictures);
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({
            $pull: { images: { filename: { $in: req.body.deleteImages } } },
        });
    }
    await camp.save();
    req.flash("success", "You successfully updated the campground!");
    res.redirect(`/campgrounds/${camp.id}`);
});

// Delete route of campground
const campground_delete = catchAsync(async (req, res) => {
    const id = req.params.id;
    const camp = await Campground.findByIdAndDelete(id);
    if (camp.images.length) {
        for (let file of camp.images) {
            await cloudinary.uploader.destroy(file.filename);
        }
    }
    req.flash("success", "Successfully deleted campground!");
    res.redirect("/campgrounds");
});

module.exports = {
    campground_index,
    campground_create_get,
    campground_create_post,
    campground_details,
    campground_update_get,
    campground_update_post,
    campground_delete,
};
