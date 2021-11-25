const User = require("../models/user");
const catchAsync = require("../helpers/catchAsync");

const get_register = (req, res) => {
    res.render("./users/register");
}

const post_register = catchAsync(async(req, res) => {
    try {
        const { username, password, email } = req.body;
        const user = await new User({username, email});
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if(err) next(err);
            req.flash("success", "Welcome to YelpCamp!");
            res.redirect("/campgrounds");
        })
    } catch(e) {
        req.flash("error", e.message);
        res.redirect("/register");
    }
})

const get_login = (req, res) => {
    res.render("./users/login")
}

const post_login = async(req, res) => {
    req.flash("success", "Welcome back to YelpCamp!");
    //Check where the user comes from and redirect to it if need be
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

const get_logout = (req, res) => {
    req.logout();
    req.flash("success", "You successfully logged out!")
    res.redirect("/campgrounds");
}

module.exports= {
    get_register,
    post_register,
    get_login,
    post_login,
    get_logout
}