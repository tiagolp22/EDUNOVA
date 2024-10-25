// controllers/statusController.js
const { Status } = require('../config/db').models;

// Create a new status
exports.createStatus = async (req, res) => {
    const { name } = req.body;

    try {
        const status = await Status.create({ name });
        res.status(201).json(status);
    } catch (error) {
        res.status(400).json({ error: 'Error creating status' });
    }
};

// Get all statuses
exports.getAllStatuses = async (req, res) => {
    try {
        const statuses = await Status.findAll();
        res.json(statuses);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching statuses' });
    }
};

// Get a status by ID
exports.getStatusById = async (req, res) => {
    const { id } = req.params;

    try {
        const status = await Status.findByPk(id);
        if (!status) {
            return res.status(404).json({ error: 'Status not found' });
        }
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching status' });
    }
};

// Update a status
exports.updateStatus = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const status = await Status.findByPk(id);
        if (!status) {
            return res.status(404).json({ error: 'Status not found' });
        }

        status.name = name;
        await status.save();

        res.json(status);
    } catch (error) {
        res.status(400).json({ error: 'Error updating status' });
    }
};

// Delete a status
exports.deleteStatus = async (req, res) => {
    const { id } = req.params;

    try {
        const status = await Status.findByPk(id);
        if (!status) {
            return res.status(404).json({ error: 'Status not found' });
        }

        await status.destroy();
        res.json({ message: 'Status deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting status' });
    }
};
