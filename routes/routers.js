require("dotenv").config();
const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const { body } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../models/user");

router.get("/", function(req, res, next) {
  res.render("index", { user: req.user });
});

router.get("/signup", function(req, res, next) {
  res.render("signup");
});

router.post(
  "/signup",
  [
    body("*").trim(),
    check("username")
      .isLength({ min: 6 })
      .withMessage("Username must be at least 6 characters"),
    check("firstname")
      .isLength({ min: 1 })
      .withMessage("Please input your first name"),
    check("lastname")
      .isLength({ min: 1 })
      .withMessage("Please input your first name"),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Your password must be at least 6 characters"),
    check("confirmpassword").custom(
      (value, { req }) => value === req.body.password
    ),
    body("*").escape()
  ],
  function(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("signup", {
        errors: errors.array(),
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname
      });
      return;
    } else {
      User.findOne({ username: req.body.username }, function(err, result) {
        if (err) return next(err);
        if (result) {
          let error = new Error("Username already exist");
          res.render("signup", { error: error });
        } else {
          storeUser(req, res, next);
        }
      });
    }
  }
);

router.get("/signin", function(req, res, next) {
  res.render("signin");
});

router.get("/join", function(req, res, next) {
  if (req.user) res.render("join");
  else res.redirect("/");
});

router.post(
  "/join",
  [
    check("passcode")
      .trim()
      .escape()
      .custom(value => value === process.env.MB_KEY)
      .withMessage("Incorrect passcode")
  ],
  function(req, res, next) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.render("join", { errors: errors.array() });
    } else {
      User.findByIdAndUpdate(req.user._id, { membership: "Member" }, err => {
        if (err) return next(err);
        res.redirect("/");
      });
    }
  }
);

function storeUser(req, res, next) {
  bcrypt.hash(req.body.password, 10, function(err, hashed) {
    if (err) return next(err);

    let newUser = new User({
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      password: hashed
    }).save(err => {
      if (err) return next(err);
      res.redirect("/signin");
    });
  });
}

module.exports = router;
