const express = require("express");
const router = express.Router();
const campgroundController = require("../controllers/campgroundController");
const isLoggedIn = require("../middleware/isLogged");
const isAuthor = require("../middleware/isAuthor");
const { validateCampground } = require("../middleware/validateSchema")

router.get("/", campgroundController.campground_index);
router.post("/", isLoggedIn, validateCampground, campgroundController.campground_create_post);
router.get("/new", isLoggedIn, campgroundController.campground_create_get);
router.get("/:id/edit", isLoggedIn, isAuthor, campgroundController.campground_update_get);
router.get("/:id", campgroundController.campground_details);
router.put("/:id", isLoggedIn, isAuthor, validateCampground, campgroundController.campground_update_post);
router.delete("/:id", isLoggedIn, isAuthor, campgroundController.campground_delete);

module.exports = router;