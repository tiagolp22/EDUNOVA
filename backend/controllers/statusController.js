// controllers/statusController.js

const { Status } = require("../models");

/**
 * Fetch all statuses.
 */
exports.getStatuses = async (req, res) => {
  try {
    const statuses = await Status.findAll();
    res.status(200).json(statuses);
  } catch (error) {
    console.error("Error fetching statuses:", error);
    res.status(500).json({ error: "An error occurred while fetching statuses." });
  }
};

/**
 * Create a new status.
 */
exports.createStatus = async (req, res) => {
  try {
    const status = await Status.create(req.body);
    res.status(201).json(status);
  } catch (error) {
    console.error("Error creating status:", error);
    res.status(500).json({ error: "An error occurred while creating the status." });
  }
};

/**
 * Delete a status by ID.
 */
exports.deleteStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const status = await Status.findByPk(id);
    if (!status) return res.status(404).json({ error: "Status not found." });

    await status.destroy();
    res.status(200).json({ message: "Status deleted successfully." });
  } catch (error) {
    console.error("Error deleting status:", error);
    res.status(500).json({ error: "An error occurred while deleting the status." });
  }
};
