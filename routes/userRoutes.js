const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

console.log("User Routes File Loaded");

// Register User (Public)
router.post("/register", userController.registerUser);

// User Login (Public)
router.post("/login", userController.loginUser);

module.exports = router;
