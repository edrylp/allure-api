const express = require('express');
const userController = require('../controllers/userController');
const { verify, verifyAdmin } = require("../auth");
const router = express.Router();

console.log("User Routes File Loaded");

// Register User (Public)
router.post("/register", userController.registerUser);

// User Login (Public)
router.post("/login", userController.loginUser);

// Retrieve User Details (Authenticated User)
router.get("/details", verify, userController.getProfile);

// Retrieve Dating Profiles (Authenticated Users)
router.get("/profiles", verify, userController.getProfiles);

// Retrieve Single Profile (Authenticated Users)
router.get("/profile/:id", verify, userController.getSingleProfile);

// Update Admin Status (Authenticated Admin)
router.patch("/:id/set-as-admin", verify, verifyAdmin, userController.updateUser);

// Update Password (Authenticated User)
router.patch("/update-password", verify, userController.updatePassword);

module.exports = router;
