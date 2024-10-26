const { Status } = require('../config/db').models;
const redisClient = require('../services/redisClient');

/**
 * Create a new status - Only accessible by admins
 */
exports.createStatus = async (req, res) => {
    if (req.user.privilege_id !== 'admin') {
        return res.status(403).json({ error: 'Only admins can create statuses' });
    }

    const { name } = req.body;

    try {
        const status = await Status.create({ name });

        // Clear status cache to ensure new data is reflected
        await redisClient.del('all_statuses');
        res.status(201).json(status);
    } catch (error) {
        res.status(500).json({ error: 'Error creating status' });
    }
};

/**
 * Retrieve all statuses with caching - Accessible by all users
 */
exports.getAllStatuses = async (req, res) => {
    const cacheKey = 'all_statuses';

    try {
        const cachedStatuses = await redisClient.get(cacheKey);
        if (cachedStatuses) return res.json(JSON.parse(cachedStatuses));

        const statuses = await Status.findAll();
        await redisClient.set(cacheKey, JSON.stringify(statuses), 'EX', 3600); // Cache for 1 hour
        res.json(statuses);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching statuses' });
    }
};

/**
 * Retrieve a status by ID - Accessible by all users
 */
exports.getStatusById = async (req, res) => {
    const { id } = req.params;

    try {
        const status = await Status.findByPk(id);
        if (!status) return res.status(404).json({ error: 'Status not found' });

        res.json(status);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching status' });
    }
};

/**
 * Update a status - Only accessible by admins
 */
exports.updateStatus = async (req, res) => {
    if (req.user.privilege_id !== 'admin') {
        return res.status(403).json({ error: 'Only admins can update statuses' });
    }

    const { id } = req.params;
    const { name } = req.body;

    try {
        const status = await Status.findByPk(id);
        if (!status) return res.status(404).json({ error: 'Status not found' });

        status.name = name;
        await status.save();

        // Clear status cache
        await redisClient.del('all_statuses');
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: 'Error updating status' });
    }
};

/**
 * Delete a status - Only accessible by admins
 */
exports.deleteStatus = async (req, res) => {
    if (req.user.privilege_id !== 'admin') {
        return res.status(403).json({ error: 'Only admins can delete statuses' });
    }

    const { id } = req.params;

    try {
        const status = await Status.findByPk(id);
        if (!status) return res.status(404).json({ error: 'Status not found' });

        await status.destroy();

        // Clear status cache
        await redisClient.del('all_statuses');
        res.json({ message: 'Status deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting status' });
    }
};
