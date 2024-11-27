const authorize = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
      }

      const userRole = req.user.privilege.name;
      const userPermissions = req.user.privilege.permissions || [];

      if (!allowedRoles.includes(userRole) && !userRole === 'admin') {
        return res.status(403).json({ error: 'Insufficient privileges' });
      }

      // Verificar permissões específicas se fornecidas
      if (Array.isArray(allowedRoles) && allowedRoles.some(role => typeof role === 'object')) {
        const requiredPermissions = allowedRoles
          .filter(role => typeof role === 'object')
          .flatMap(role => role.permissions);

        const hasRequiredPermissions = requiredPermissions.every(
          permission => userPermissions.includes(permission)
        );

        if (!hasRequiredPermissions) {
          return res.status(403).json({ error: 'Insufficient permissions' });
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = authorize;