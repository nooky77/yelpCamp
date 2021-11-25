const Joi = require("joi");

const campgroundSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().min(1).required(),
    location: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required()
}).required();

const reviewSchema = Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    body: Joi.string().required()
}).required();

module.exports = {
    campgroundSchema,
    reviewSchema,
}