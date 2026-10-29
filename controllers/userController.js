const mongoose = require("mongoose");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const auth = require("../auth.js");
const { errorHandler } = auth;

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

// User Authentication
module.exports.loginUser = (req, res) => {

  if (!req.body.email || !req.body.email.includes("@")) {
    return res.status(400).send({ error: "Invalid Email" });
  }

  return User.findOne({ email: req.body.email })
    .then((result) => {

      if (!result) {
        return res.status(404).send({ error: "No Email Found" });
      }

      const isPasswordCorrect = bcrypt.compareSync(
        req.body.password,
        result.password
      );

      if (!isPasswordCorrect) {
        return res.status(401).send({ error: "Email and password do not match" });
      }

      return res.status(200).send({
        access: auth.createAccessToken(result)
      });
    })
    .catch((error) => errorHandler(error, req, res));
};

// Get Profile
module.exports.getProfile = (req, res) => {

  return User.findById(req.user.id)
    .select("-password")
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found" });
      }

      return res.status(200).send(user);
    })
    .catch((error) => errorHandler(error, req, res));
};

// Get All Profiles
module.exports.getProfiles = (req, res) => {

  return User.find({
      isAdmin: false, 
      _id: { $ne: new mongoose.Types.ObjectId(req.user.id) }
  })
  .select("-password")
  .then(users => {
      return res.status(200).send(users);
  })
  .catch(error => {
      console.error("Get profiles error:", error);
      return res.status(500).send({
          error: "Failed to retrieve profiles"
      });
  });
};

// Get A Specific Profile
module.exports.getSingleProfile = (req, res) => {

  const profileId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(profileId)) {
    return res.status(400).send({ error: "Invalid profile ID" });
  }

  return User.findById(profileId)
  .select("-password")
  .then(user => {

      if (!user) {
        return res.status(404).send({ error: "Profile not found" });
      }

      // 🚨 BLOCK ADMIN PROFILE VIEW
      if (user.isAdmin === true) {
        return res.status(403).send({
          error: "You are not allowed to view this profile"
        });
      }

      return res.status(200).send(user);
  })
  .catch(err => {
      console.error("Single profile error:", err);
      return res.status(500).send({ error: "Failed to retrieve profile" });
  });
};

// Update user to admin
module.exports.updateUser = (req, res) => {

  const userId = req.params.id;

  return User.findByIdAndUpdate(
      userId,
      { isAdmin: true },
      { new: true }
  )
  .then(user => {
      if (!user) {
          return res.status(404).send({ error: "User not Found" });
      }

      return res.status(200).send({ updatedUser: user });
  })
  .catch(error => {
      return res.status(500).send({
          error: "Failed in Find"
      });
  });
};

// Update Password
module.exports.updatePassword = (req, res) => {

  const { password } = req.body;

  bcrypt.hash(password, 12)
  .then(hashedPassword =>
    User.findByIdAndUpdate(req.user.id, { password: hashedPassword })
  )
  .then(() => res.status(201).send({ message: "Password reset successfully" }))
  .catch(() => res.status(500).send({ error: "Password reset failed" }));
};