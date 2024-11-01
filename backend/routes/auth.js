const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { body } = require("express-validator");
const authenticateToken = require("../middleware/auth");

// Test route to verify API is running
router.get("/", (req, res) => {
  res.json({ message: "Welcome to the backend API!" });
});

// User registration endpoint with updated validation matching the User model
router.post(
  "/register",
  [
    // Username validation
    body("username")
      .notEmpty()
      .withMessage("Username is required")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Username must be at least 3 characters long")
      .matches(/^[a-zA-Z0-9_]+$/)
      .withMessage(
        "Username can only contain letters, numbers and underscores"
      ),

    // Email validation
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Must be a valid email address")
      .normalizeEmail(),

    // Password validation (matching model requirements)
    body("password")
      .isLength({ min: 8, max: 128 })
      .withMessage("Password must be between 8 and 128 characters")
      .matches(/\d/)
      .withMessage("Password must contain at least one number")
      .matches(/[a-z]/)
      .withMessage("Password must contain at least one lowercase letter")
      .matches(/[A-Z]/)
      .withMessage("Password must contain at least one uppercase letter")
      .matches(/[!@#$%^&*(),.?":{}|<>]/)
      .withMessage("Password must contain at least one special character"),

    // Birthday validation (optional field)
    body("birthday")
      .optional()
      .isISO8601()
      .withMessage("Birthday must be a valid date")
      .custom((value) => {
        const date = new Date(value);
        const now = new Date();
        if (date > now) {
          throw new Error("Birthday cannot be in the future");
        }
        // Check if user is at least 13 years old
        const thirteenYearsAgo = new Date();
        thirteenYearsAgo.setFullYear(thirteenYearsAgo.getFullYear() - 13);
        if (date > thirteenYearsAgo) {
          throw new Error("User must be at least 13 years old");
        }
        return true;
      }),
  ],
  authController.register
);

// User authentication endpoint with input validation
router.post(
  "/login",
  [
    // Email validation
    body("email")
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Must be a valid email address")
      .normalizeEmail(),

    // Password validation
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8, max: 128 })
      .withMessage("Invalid password length"),
  ],
  authController.login
);

// User logout endpoint - requires authentication
router.post("/logout", authenticateToken, authController.logout);

// Optional: Check session status endpoint
router.get("/check-session", authenticateToken, (req, res) => {
  res.json({
    isValid: true,
    user: {
      id: req.user.id,
      email: req.user.email,
      privilege_id: req.user.privilege_id,
    },
  });
});

module.exports = router;
