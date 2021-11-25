const isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        // Remember where user comes from for redirect when logged-in
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You must be signed in!");
        return res.redirect("/login");
    }
    next();
}

module.exports = isLoggedIn;