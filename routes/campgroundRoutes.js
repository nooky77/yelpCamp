const express = require("express");
const router = express.Router();
const multer  = require('multer')
const { storage } = require("../cloudinary")
const upload = multer({ storage });
const campgroundController = require("../controllers/campgroundController");
const isLoggedIn = require("../middleware/isLogged");
const isAuthor = require("../middleware/isAuthor");
const { validateCampground } = require("../middleware/validateSchema")


router.route("/")
    .get(campgroundController.campground_index)
    .post(isLoggedIn, upload.array("image"), validateCampground, campgroundController.campground_create_post);

router.get("/new", isLoggedIn, campgroundController.campground_create_get);

router.get("/:id/edit", isLoggedIn, isAuthor, campgroundController.campground_update_get);

router.route("/:id")
    .get(campgroundController.campground_details)
    .put(isLoggedIn, isAuthor, validateCampground, campgroundController.campground_update_post)
    .delete(isLoggedIn, isAuthor, campgroundController.campground_delete);

module.exports = router;