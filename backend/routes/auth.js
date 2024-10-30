// routes/auth.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { body } = require("express-validator");

// Test route
router.get("/", (req, res) => {
  res.json({ message: "Welcome to the backend API!" });
});

// Registration route
router.post(
  "/register",
  [
    body("username").notEmpty().withMessage("Username is required"), // Changed from name to username
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 8, max: 128 }) // Updated to match model requirements
      .withMessage("Password must be between 8 and 128 characters"),
    body("privilege_id").isInt().withMessage("Privilege ID must be an integer"),
  ],
  authController.register
);

// Login route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  authController.login
);

module.exports = router;
