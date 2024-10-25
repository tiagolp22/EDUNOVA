// controllers/privilegeController.js
const { Privilege } = require('../config/db').models;

// Create a new privilege
exports.createPrivilege = async (req, res) => {
    const { name } = req.body;

    try {
        const privilege = await Privilege.create({ name });
        res.status(201).json(privilege);
    } catch (error) {
        res.status(400).json({ error: 'Error creating privilege' });
    }
};

// Get all privileges
exports.getAllPrivileges = async (req, res) => {
    try {
        const privileges = await Privilege.findAll();
        res.json(privileges);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching privileges' });
    }
};

// Get a privilege by ID
exports.getPrivilegeById = async (req, res) => {
    const { id } = req.params;

    try {
        const privilege = await Privilege.findByPk(id);
        if (!privilege) {
            return res.status(404).json({ error: 'Privilege not found' });
        }
        res.json(privilege);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching privilege' });
    }
};

// Update a privilege
exports.updatePrivilege = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const privilege = await Privilege.findByPk(id);
        if (!privilege) {
            return res.status(404).json({ error: 'Privilege not found' });
        }

        privilege.name = name;
        await privilege.save();

        res.json(privilege);
    } catch (error) {
        res.status(400).json({ error: 'Error updating privilege' });
    }
};

// Delete a privilege
exports.deletePrivilege = async (req, res) => {
    const { id } = req.params;

    try {
        const privilege = await Privilege.findByPk(id);
        if (!privilege) {
            return res.status(404).json({ error: 'Privilege not found' });
        }

        await privilege.destroy();
        res.json({ message: 'Privilege deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting privilege' });
    }
};
