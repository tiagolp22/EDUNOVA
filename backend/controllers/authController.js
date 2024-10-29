// controllers/authController.js

/**
 * Authentication Controller
 *
 * Handles user registration and login functionalities.
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../config/db").models;
const config = require("../config/config");

/**
 * Register a new user
 *
 * Allows a user to register by providing name, email, and password.
 * Passwords are securely hashed before storing in the database.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @route POST /api/auth/register
 * @access Public
 */
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  console.log("name ", name);

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    // Securely hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user in the database
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Exclude the password from the response
    const userResponse = { ...newUser.toJSON() };
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error: Unable to create user" });
  }
};

/**
 * Log in a user and generate a JWT token
 *
 * Authenticates the user by email and password. If valid, returns a signed JWT token
 * which includes the user's id, email, and privilege level for authorization purposes.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @route POST /api/auth/login
 * @access Public
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate a JWT token with user info
    const token = jwt.sign(
      { id: user.id, email: user.email, privilege_id: user.privilege_id },
      config.jwt.secret,
      { expiresIn: config.jwt.expiration }
    );

    // Send the token in the response
    res.json({ token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal Server Error: Unable to log in" });
  }
};
