const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");

// User Registration
module.exports.registerUser = (req, res) => {

  if (typeof req.body.firstName !== "string" ||
      typeof req.body.lastName !== "string") {
    return res.status(400).send({ error: "Invalid name input" });
  }

  if (!req.body.mobileNo || req.body.mobileNo.length !== 11) {
    return res.status(400).send({ error: "Mobile number invalid" });
  }

  if (!req.body.email.includes("@")) {
    return res.status(400).send({ error: "Email invalid" });
  }

  if (!req.body.password || req.body.password.length < 8) {
    return res.status(400).send({ error: "Password must be at least 8 characters" });
  }

  let newUser = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    mobileNo: req.body.mobileNo,
    password: bcrypt.hashSync(req.body.password, 12),

    // Dating Fields
    gender: req.body.gender,
    age: req.body.age,
    status: req.body.status,
    hobbies: req.body.hobbies,
    lookingFor: req.body.lookingFor,
    profileImage: req.body.profileImage
  });

  return newUser.save()
    .then(() => res.status(201).send({ message: "Registered Successfully" }))
    .catch((error) => errorHandler(error, req, res));
};