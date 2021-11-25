const { campgroundSchema, reviewSchema } = require("../joiSchemas");
const ExpressError = require("../helpers/ExpressError");

// Middleware that validate if mongoose schema is correct with joi;
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, msg)
    } else {
        next();
    }
}

module.exports = {
    validateCampground,
    validateReview
};