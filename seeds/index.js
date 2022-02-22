const mongoose = require("mongoose");
const cities = require("./cities");
const Campground = require("../models/campground");
const { descriptors, places } = require("./seedHelpers");

// Connect to db and lunch server
const dbURI = process.env.MONGO_DB_URI
mongoose
    .connect(dbURI)
    .then(() => console.log("DB connected."))
    .catch((err) => console.log(err));

const sample = (arr) => Math.floor(Math.random() * arr.length);

const deleteCampground = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 500; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            title: `${descriptors[sample(descriptors)]}, ${
                places[sample(places)]
            }`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            description:
                "Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit aperiam, eligendi porro nam odio laborum distinctio molestiae voluptate eveniet architecto officia cupiditate, amet vitae iste nisi. Ipsa reprehenderit eius commodi!",
            price,
            author: "619fa8fa8ef13f9ef55ab9c1",
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ],
            },
            images: [
                {
                    url: "https://res.cloudinary.com/zaz1701/image/upload/v1638534694/YelpCamp/q4rnzavzbalimjzptzhz.jpg",
                    filename: "YelpCamp/q4rnzavzbalimjzptzhz",
                },
                {
                    url: "https://res.cloudinary.com/zaz1701/image/upload/v1638534694/YelpCamp/ffy3xklveumbhtl5nfpy.jpg",
                    filename: "YelpCamp/ffy3xklveumbhtl5nfpy",
                },
            ],
        });
        await camp.save();
    }
};

deleteCampground().then(() => mongoose.connection.close());
