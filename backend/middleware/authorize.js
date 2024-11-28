/**
 * Middleware to authorize users based on their privileges.
 * @param {Array<string>} allowedRoles - Array of roles that are authorized.
 * @returns {Function} - Express middleware function.
 */
const authorize = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const userRole = req.user.privilege.name;

      // Check if the user's role is included in the allowedRoles
      const isAllowed = allowedRoles.includes(userRole) || userRole === 'admin';

      if (!isAllowed) {
        return res.status(403).json({ error: 'Insufficient privileges' });
      }

      // If specific permissions are required (optional)
      // Example: authorize([{ role: 'editor', permissions: ['edit_article'] }])
      const permissionRoles = allowedRoles.filter(role => typeof role === 'object');

      if (permissionRoles.length > 0) {
        const requiredPermissions = permissionRoles.flatMap(role => role.permissions);

        const userPermissions = req.user.privilege.permissions || [];

        const hasRequiredPermissions = requiredPermissions.every(permission =>
          userPermissions.includes(permission)
        );

        if (!hasRequiredPermissions) {
          return res.status(403).json({ error: 'Insufficient permissions' });
        }
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
};

module.exports = authorize;
