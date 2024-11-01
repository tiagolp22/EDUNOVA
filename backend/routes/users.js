const express = require("express");
const router = express.Router();
const { models } = require("../config/db");
const authenticateToken = require("../middleware/auth");
const userController = require("../controllers/userController");

// Apply authentication middleware to all routes
router.use(authenticateToken);

// Get all users route
router.get("/all", async (req, res) => {
  try {
    // Ensure user is authenticated and has admin privileges
    if (!req.user) {
      return res.status(401).json({ error: "No authenticated user" });
    }

    if (!req.user.privilege || req.user.privilege.name !== "admin") {
      return res.status(403).json({ error: "Admin privileges required" });
    }

    // Use models from imported db config
    const { User, Privilege } = models;

    const users = await User.findAll({
      include: [
        {
          model: Privilege,
          as: "privilege",
          attributes: ["name"],
        },
      ],
    });

    // Format users for response
    const formattedUsers = users.map((user) => ({
      id: user.id,
      name: user.username || user.name,
      email: user.email,
      privilege: user.privilege ? user.privilege.name : null,
    }));

    res.json(formattedUsers);
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    res.status(500).json({
      error: "Error fetching users",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Delete user route
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Ensure user is authenticated and has admin privileges
    if (!req.user) {
      return res.status(401).json({ error: "No authenticated user" });
    }

    if (!req.user.privilege || req.user.privilege.name !== "admin") {
      return res.status(403).json({ error: "Admin privileges required" });
    }

    // Use models from imported db config
    const { User } = models;

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

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      error: "Error deleting user",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

module.exports = router;
