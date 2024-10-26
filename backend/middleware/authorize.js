const permissionsConfig = require('../config/permissionsConfig');
const { User, Privilege } = require('../config/db').models;

const authorize = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id, {
        include: [{ model: Privilege, as: 'privilege' }]
      });

      if (!user || !permissionsConfig.roles[user.privilege.name]?.includes(requiredPermission)) {
        return res.status(403).json({
          error: `Access denied. Missing required permission: ${requiredPermission}`
        });
      }
      next();
    } catch (error) {
      res.status(500).json({ error: 'Error checking privileges' });
    }
  };
};

module.exports = authorize;
