const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
        "string.escapeHTML": "{{#label}} must not include HTML!",
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value)
                    return helpers.error("string.escapeHTML", { value });
                return clean;
            },
        },
    },
});

const Joi = BaseJoi.extend(extension);

const campgroundSchema = Joi.object({
    title: Joi.string().required().escapeHTML(),
    price: Joi.number().min(1).required(),
    location: Joi.string().required().escapeHTML(),
    description: Joi.string().required().escapeHTML(),
    deleteImages: Joi.array(),
    // image: Joi.string().required()
}).required();

const reviewSchema = Joi.object({
    rating: Joi.number().min(0).max(5).required(),
    body: Joi.string().required().escapeHTML(),
}).required();

module.exports = {
    campgroundSchema,
    reviewSchema,
};
