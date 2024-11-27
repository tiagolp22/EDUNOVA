// controllers/privilegeController.js

const { Privilege } = require("../models");

/**
 * Fetch all privileges.
 */
exports.getPrivileges = async (req, res) => {
  try {
    const privileges = await Privilege.findAll();
    res.status(200).json(privileges);
  } catch (error) {
    console.error("Error fetching privileges:", error);
    res.status(500).json({ error: "An error occurred while fetching privileges." });
  }
};

/**
 * Create a new privilege.
 */
exports.createPrivilege = async (req, res) => {
  try {
    const privilege = await Privilege.create(req.body);
    res.status(201).json(privilege);
  } catch (error) {
    console.error("Error creating privilege:", error);
    res.status(500).json({ error: "An error occurred while creating the privilege." });
  }
};

/**
 * Delete a privilege by ID.
 */
exports.deletePrivilege = async (req, res) => {
  const { id } = req.params;

  try {
    const privilege = await Privilege.findByPk(id);
    if (!privilege) return res.status(404).json({ error: "Privilege not found." });

    await privilege.destroy();
    res.status(200).json({ message: "Privilege deleted successfully." });
  } catch (error) {
    console.error("Error deleting privilege:", error);
    res.status(500).json({ error: "An error occurred while deleting the privilege." });
  }
};
