const express= require("express");
const Router = express.Router();
const passport = require("passport");
const UserController = require("../controllers/userController");

Router.get("/register", UserController.get_register);
Router.post("/register", UserController.post_register);
Router.get("/login", UserController.get_login);
Router.post("/login", passport.authenticate("local", {failureFlash: true, failureRedirect: "/login"}), UserController.post_login);
Router.get("/logout", UserController.get_logout);

module.exports = Router;