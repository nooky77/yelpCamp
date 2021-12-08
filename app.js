// Check if project is not in production
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");
const path = require("path");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");

const User = require("./models/user");
const CampgroundRoutes = require("./routes/campgroundRoutes");
const ReviewRoutes = require("./routes/reviewRoutes");
const UserRoutes = require("./routes/userRoutes");
const ExpressError = require("./helpers/ExpressError");
const app = express();

// Connect to db and lunch server
const port = process.env.PORT || 3000;

mongoose
    .connect(process.env.MONGO_DB_URI)
    .then(() => app.listen(port, () => console.log("Server and DB connected.")))
    .catch((err) => console.log(err));

// Set view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

// Session express middleware
const secret = process.env.SECRET;

const store = MongoStore.create({
    mongoUrl: process.env.MONGO_DB_URI,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret,
    },
});

const sessionConfig = {
    store,
    name: "session",
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};
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
});

// Prevents nosql injection
app.use(mongoSanitize());

// Allow sources
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];

const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];

const fontSrcUrls = [];

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/zaz1701/",
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// Set root route
app.get("/", (req, res) => {
    res.render("home");
});

// Set routes for campgrounds
app.use("/campgrounds", CampgroundRoutes);

// Set routes for reviews
app.use("/campgrounds/:campId/reviews", ReviewRoutes);

// Set routes for users
app.use("/", UserRoutes);

// 404
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "404 Page not found."));
});

//Error handler
app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = "Oh No, Something Went Wrong!";
    res.status(status).render("error", { err });
});
