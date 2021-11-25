const mongoose = require("mongoose");
const cities = require("./cities");
const Campground = require("../models/campground");
const { descriptors, places } = require("./seedHelpers");

// Connect to db and lunch server
const dbURI = "mongodb+srv://bibi:1HATUs89zu8GN8mw@clustertuto.dwp4i.mongodb.net/yelpCamp?retryWrites=true&w=majority"
mongoose.connect(dbURI)
    .then(() => console.log("DB connected."))
    .catch((err) => console.log(err));

const sample = (arr) => Math.floor(Math.random() * arr.length);



const deleteCampground = async() => {
    await Campground.deleteMany({});
    for(let i = 0; i < 50; i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            title: `${descriptors[sample(descriptors)]}, ${places[sample(places)]}`,     
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            image: "https://source.unsplash.com/collection/483251",
            description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit aperiam, eligendi porro nam odio laborum distinctio molestiae voluptate eveniet architecto officia cupiditate, amet vitae iste nisi. Ipsa reprehenderit eius commodi!",
            price,
            author: "619fa8fa8ef13f9ef55ab9c1"
        })
        await camp.save();
    }
}

// deleteCampground().then(() => mongoose.connection.close());


