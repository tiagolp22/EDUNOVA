// middleware/authorize.js
const { User, Privilege } = require('../config/db').models;

const authorize = (requiredPrivileges) => {
    return async (req, res, next) => {
        try {
            const user = await User.findByPk(req.user.id, {
                include: [{ model: Privilege, as: 'privilege' }]
            });

            if (!user || !user.privilege || !requiredPrivileges.includes(user.privilege.name)) {
                return res.status(403).json({ error: 'Access denied' });
            }

            next();
        } catch (error) {
            res.status(500).json({ error: 'Error checking privileges' });
        }
    };
};

module.exports = authorize;
