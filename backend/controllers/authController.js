// controllers/authController.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");
const config = require("../config/config");

/**
 * User registration controller
 * Creates a new user account with the provided credentials.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing user data
 * @param {string} req.body.username - User's chosen username
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password (will be hashed)
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user data or error message
 * @throws {Error} When validation fails or database operation fails
 */
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Input validation
    if (!username || !email || !password) {
      return res.status(400).json({
        error: "All fields are required",
        details: {
          message: "Username, email and password are required",
        },
      });
    }

    // Check for existing user with same email or username
    const existingUser = await db.User.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return res.status(400).json({
        error:
          existingUser.email === email
            ? "Email already registered"
            : "Username already taken",
      });
    }

    // Password length validation as per model requirements
    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({
        error: "Invalid password",
        details: {
          message: "Password must be between 8 and 128 characters",
        },
      });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user record with default privilege
    const newUser = await db.User.create({
      username,
      email,
      password: hashedPassword,
      privilege_id: 3, // Default to subscriber
    });

    // Prepare response (excluding password)
    const userResponse = newUser.toJSON();
    delete userResponse.password;

    res.status(201).json({
      message: "User registered successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Error creating user:", error);

    // Handle Sequelize validation errors
    if (error.name === "SequelizeValidationError") {
      return res.status(400).json({
        error: "Validation error",
        details: error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        })),
      });
    }

    // Handle unique constraint violations
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        error: "Duplicate entry",
        details: error.errors.map((err) => ({
          field: err.path,
          message: err.message,
        })),
      });
    }

    // Handle unexpected errors
    res.status(500).json({
      error: "Internal Server Error: Unable to create user",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * User authentication controller
 * Validates user credentials and returns a JWT token upon successful authentication.
 *
 * @param {Object} req - Express request object
 * @param {Object} req.body - Request body containing login credentials
 * @param {string} req.body.email - User's email address
 * @param {string} req.body.password - User's password
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with token and user data or error message
 * @throws {Error} When authentication fails or database operation fails
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        error: "All fields are required",
        details: {
          message: "Email and password are required",
        },
      });
    }

    // Find user and include privilege information
    const user = await db.User.findOne({
      where: { email },
      include: [
        {
          model: db.Privilege,
          as: "privilege",
          attributes: ["name"], // Only include the name of the privilege
        },
      ],
    });

    // Generic authentication error for security
    if (!user) {
      return res.status(404).json({
        error: "Authentication failed",
        details: {
          message: "Invalid email or password",
        },
      });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: "Authentication failed",
        details: {
          message: "Invalid email or password",
        },
      });
    }

    // Generate authentication token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        privilege_id: user.privilege_id,
      },
      config.jwt.secret,
      {
        expiresIn: config.jwt.expiration,
      }
    );

    // Send successful response
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        privilege: {
          name: user.privilege?.name,
        },
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({
      error: "Internal Server Error: Unable to log in",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
