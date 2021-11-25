const express = require("express");
const router = express.Router({mergeParams: true});
const reviewController = require("../controllers/reviewController");
const { validateReview } = require("../middleware/validateSchema");

router.post("/", validateReview, reviewController.review_create_post);
router.delete("/:reviewId", reviewController.review_delete_post)

module.exports = router;