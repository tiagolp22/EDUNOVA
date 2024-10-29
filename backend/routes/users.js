// routes/users.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

// User routes
// Route for user registration
router.post("/register", userController.register);

// Route for user login
router.post("/login", userController.login);

// Route to get all users
router.get("/all", userController.getAllUsers);

module.exports = router;
