const express = require("express");
const router = express.Router({mergeParams: true});
const reviewController = require("../controllers/reviewController");
const { validateReview } = require("../middleware/validateSchema");
const isLoggedIn = require("../middleware/isLogged");
const isAuthorReview = require("../middleware/isAuthorReview");

router.post("/", isLoggedIn, validateReview, reviewController.review_create_post);
router.delete("/:reviewId", isLoggedIn, isAuthorReview, reviewController.review_delete_post)

module.exports = router;