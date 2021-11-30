const express= require("express");
const Router = express.Router();
const passport = require("passport");
const UserController = require("../controllers/userController");

Router.route("/register")
    .get(UserController.get_register)
    .post(UserController.post_register)

Router.route("/login")
    .get(UserController.get_login)
    .post(passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), UserController.post_login)

Router.get("/logout", UserController.get_logout);

module.exports = Router;