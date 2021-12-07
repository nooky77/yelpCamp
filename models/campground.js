const { string } = require("joi");
const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./review");

const imageSchema = new Schema({
    url: String,
    filename: String,
});

imageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_200");
});

const opts = { toJSON: { virtuals: true } };

const campgroundSchema = new Schema(
    {
        title: {
            type: String,
        },
        images: [imageSchema],
        price: {
            type: Number,
        },
        description: {
            type: String,
        },
        location: {
            type: String,
        },
        geometry: {
            type: {
                type: String,
                enum: ["Point"],
                required: true,
            },
            coordinates: {
                type: [Number],
                required: true,
            },
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        reviews: [
            {
                type: Schema.Types.ObjectId,
                ref: "Review",
            },
        ],
    },
    opts
);

campgroundSchema.virtual("properties.popUpMarkup").get(function () {
    return `<a href="campgrounds/${this._id}"><strong>${this.title}</strong></a>
        <p>${this.location} 
            <br>
            <i>${this.description.substring(0, 25)}</i>
        </p>
        
    `;
});

campgroundSchema.post("findOneAndDelete", async (camp) => {
    if (camp.reviews.length) {
        await Review.deleteMany({ _id: { $in: camp.reviews } });
    }
});

const Campground = mongoose.model("campground", campgroundSchema);

module.exports = Campground;
