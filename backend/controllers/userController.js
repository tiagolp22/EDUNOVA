/**
 * User Controller
 * Handles all user-related business logic
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, Privilege } = require("../config/db").models;
const redisClient = require("../services/redisClient");
const config = require("../config/config");

/**
 * Get all users - Admin only
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllUsers = async (req, res) => {

  try {
    // Check if user exists in request
    if (!req.user) {
      console.log("No user in request");
      return res.status(401).json({ error: "No authenticated user" });
    }

    // Log privilege ID for debugging
    console.log("User privilege_id:", req.user.privilege_id);

    // Check admin privileges
    const userPrivilege = await Privilege.findByPk(req.user.privilege_id);
    console.log("User privilege found:", userPrivilege);

    if (!userPrivilege || userPrivilege.name !== "admin") {
      console.log("User is not admin:", userPrivilege?.name);
      return res.status(403).json({ error: "Only admins can view users" });
    }

    // Fetch all users with their privileges
    console.log("Fetching users...");
    const users = await User.findAll({
      attributes: ["id", "name", "email", "privilege_id"],
      include: [
        {
          model: Privilege,
          attributes: ["name"],
        },
      ],
    });
    console.log("Users found:", users.length);

    // Format user data for response
    const formattedUsers = users.map((user) => ({
      id: user.id,
      username: user.name,
      courriel: user.email,
      privilege_id: user.Privilege?.name || user.privilege_id,
    }));
    console.log("Formatted users:", formattedUsers.length);

    return res.json(formattedUsers);
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return res.status(500).json({
      error: "Error fetching users",
      details: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

/**
 * User registration
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser.toJSON();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: "Error creating user" });
  }
};

/**
 * User login
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        privilege_id: user.privilege_id,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiration }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Error during login" });
  }
};
