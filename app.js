const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const methodOverride = require('method-override')
const path = require("path");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");

const User = require("./models/user")
const CampgroundRoutes = require("./routes/campgroundRoutes");
const ReviewRoutes = require("./routes/reviewRoutes");
const UserRoutes = require("./routes/userRoutes");
const ExpressError = require("./helpers/ExpressError");
const app = express();

// Connect to db and lunch server
const dbURI = "mongodb+srv://bibi:1HATUs89zu8GN8mw@clustertuto.dwp4i.mongodb.net/yelpCamp?retryWrites=true&w=majority"
mongoose.connect(dbURI)
    .then(() => app.listen("3000", () => console.log("Server and DB connected.")))
    .catch((err) => console.log(err));

// Set view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

// Session express middleware
const sessionConfig = {
    secret: "kekleo",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Setup of express flash and use of middleware for it
app.use(flash());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Set root route
app.get("/", (req, res) => {
    res.render("home");
})

// Set routes for campgrounds
app.use("/campgrounds", CampgroundRoutes);

// Set routes for reviews
app.use("/campgrounds/:campId/reviews", ReviewRoutes)

// Set routes for users
app.use("/", UserRoutes);

// 404
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "404 Page not found."));
})

//Error handler
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if(!err.message) err.message = "Oh No, Something Went Wrong!";
    res.status(status).render("error", { err });
})
