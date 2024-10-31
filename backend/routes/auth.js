// routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { body } = require("express-validator");

// Test route to verify API is running
router.get("/", (req, res) => {
  res.json({ message: "Welcome to the backend API!" });
});

// User registration endpoint with input validation
router.post(
  "/register",
  [
    // Validate username field
    body("username").notEmpty().withMessage("Username is required"),

    // Validate email format
    body("email").isEmail().withMessage("Valid email is required"),

    // Validate password length requirements
    body("password")
      .isLength({ min: 8, max: 128 })
      .withMessage("Password must be between 8 and 128 characters"),
  ],
  authController.register
);

// User authentication endpoint with input validation
router.post(
  "/login",
  [
    // Validate email format
    body("email").isEmail().withMessage("Valid email is required"),

    // Ensure password is not empty
    body("password").notEmpty().withMessage("Password is required"),
  ],
  authController.login
);

module.exports = router;
