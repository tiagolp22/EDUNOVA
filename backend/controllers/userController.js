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
 * Get user by ID
 * Only admins can view any user's details. Regular users can only view their own details.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if authenticated user has permission to view this user
    if (req.user.privilege_id !== "admin" && req.user.id !== parseInt(id)) {
      return res.status(403).json({
        error: "Unauthorized to view this user's details",
      });
    }

    // Try to get from cache first
    const cachedUser = await redisClient.get(`user_${id}`);
    if (cachedUser) {
      return res.json(JSON.parse(cachedUser));
    }

    // If not in cache, get from database
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password"] }, // Never send password
      include: [
        {
          model: Privilege,
          as: "privilege",
          attributes: ["name"],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Format user data
    const userData = {
      id: user.id,
      username: user.username || user.name,
      email: user.email,
      birthday: user.birthday,
      privilege: user.privilege ? user.privilege.name : null,
      created_at: user.created_at,
      updated_at: user.updated_at,
    };

    // Cache the user data
    await redisClient.set(`user_${id}`, JSON.stringify(userData), "EX", 3600); // Cache for 1 hour

    res.json(userData);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      error: "Error fetching user details",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Update user information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, birthday, password, privilege_id } = req.body;

  try {
    // Check if the requesting user is an admin or the user themselves
    if (req.user.privilege?.name !== "admin" && req.user.id !== parseInt(id)) {
      return res
        .status(403)
        .json({ error: "Unauthorized to update this user" });
    }

    // Find the user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prepare update object
    const updateData = {};

    // Only update fields that are provided and different from current values
    if (username && username !== user.username) {
      // Check if username is already taken
      const existingUsername = await User.findOne({ where: { username } });
      if (existingUsername && existingUsername.id !== parseInt(id)) {
        return res.status(400).json({ error: "Username already taken" });
      }
      updateData.username = username;
    }

    if (email && email !== user.email) {
      // Check if email is already taken
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail && existingEmail.id !== parseInt(id)) {
        return res.status(400).json({ error: "Email already taken" });
      }
      updateData.email = email;
    }

    if (birthday && birthday !== user.birthday) {
      // Validate birthday format and logic
      const birthDate = new Date(birthday);
      const now = new Date();
      if (birthDate > now) {
        return res
          .status(400)
          .json({ error: "Birthday cannot be in the future" });
      }
      updateData.birthday = birthday;
    }

    // Only admins can update privilege_id
    if (privilege_id && req.user.privilege?.name === "admin") {
      const privilege = await Privilege.findByPk(privilege_id);
      if (!privilege) {
        return res.status(400).json({ error: "Invalid privilege" });
      }
      updateData.privilege_id = privilege_id;
    }

    // Handle password update if provided
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // Update user
    await user.update(updateData);

    // Clear user cache
    await redisClient.del("all_users");
    await redisClient.del(`user_${id}`);

    // Return updated user without password
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Privilege,
          as: "privilege",
          attributes: ["name"],
        },
      ],
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      error: "Error updating user",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Delete user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if user is admin
    if (!req.user.privilege || req.user.privilege.name !== "admin") {
      return res.status(403).json({ error: "Admin privileges required" });
    }

    // Find user
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Prevent admin from deleting themselves
    if (user.id === req.user.id) {
      return res.status(400).json({ error: "Cannot delete your own account" });
    }

    // Delete user
    await user.destroy();

    // Clear cache
    await redisClient.del("all_users");

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      error: "Error deleting user",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
