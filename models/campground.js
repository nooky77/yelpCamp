const mongoose = require("mongoose");
const { Schema } = mongoose;
const Review = require("./review")

const campgroundSchema = new Schema({
    title: {
        type: String,
    },
    image: {    
        type: String,
    },
    price: {
        type: Number,
    },
    description: {
        type: String,
    },
    location: {
        type: String,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ]
});

campgroundSchema.post("findOneAndDelete", async(camp) => {
    if(camp.reviews.length){
        await Review.deleteMany({_id: { $in: camp.reviews }})
    }
})

const Campground = mongoose.model("campground", campgroundSchema);

module.exports = Campground;