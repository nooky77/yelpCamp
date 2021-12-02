const Joi = require("joi");

const campgroundSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().min(1).required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
    deleteImages: Joi.array()
    // image: Joi.string().required()
}).required();

const reviewSchema = Joi.object({
    rating: Joi.number().min(0).max(5).required(),
    body: Joi.string().required()
}).required();

module.exports = {
    campgroundSchema,
    reviewSchema,
}