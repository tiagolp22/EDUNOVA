const { Privilege } = require("../config/db").models;
const redisClient = require("../services/redisClient");

/**
 * Create a new privilege - Only accessible by admins
 */
exports.createPrivilege = async (req, res) => {
  // if (req.user.privilege_id !== 'admin') {
  //     return res.status(403).json({ error: 'Only admins can create privileges' });
  // }

  const { name } = req.body;
  console.log(name, "name");

  try {
    const privilege = await Privilege.create({ name });

    // Clear privilege cache to ensure new data reflects in subsequent requests
    await redisClient.del("all_privileges");
    res.status(201).json(privilege);
  } catch (error) {
    res.status(500).json({ error: "Error creating privilege" });
  }
};

/**
 * Retrieve all privileges with caching - Accessible by admins
 */
exports.getAllPrivileges = async (req, res) => {
  if (req.user.privilege_id !== "admin") {
    return res.status(403).json({ error: "Only admins can view privileges" });
  }

  const cacheKey = "all_privileges";

  try {
    const cachedPrivileges = await redisClient.get(cacheKey);
    if (cachedPrivileges) return res.json(JSON.parse(cachedPrivileges));

    const privileges = await Privilege.findAll();
    await redisClient.set(cacheKey, JSON.stringify(privileges), "EX", 3600); // Cache for 1 hour
    res.json(privileges);
  } catch (error) {
    res.status(500).json({ error: "Error fetching privileges" });
  }
};

/**
 * Retrieve a privilege by ID - Accessible by admins
 */
exports.getPrivilegeById = async (req, res) => {
  if (req.user.privilege_id !== "admin") {
    return res
      .status(403)
      .json({ error: "Only admins can view privilege details" });
  }

  const { id } = req.params;

  try {
    const privilege = await Privilege.findByPk(id);
    if (!privilege)
      return res.status(404).json({ error: "Privilege not found" });

    res.json(privilege);
  } catch (error) {
    res.status(500).json({ error: "Error fetching privilege" });
  }
};

/**
 * Update a privilege - Only accessible by admins
 */
exports.updatePrivilege = async (req, res) => {
  if (req.user.privilege_id !== "admin") {
    return res.status(403).json({ error: "Only admins can update privileges" });
  }

  const { id } = req.params;
  const { name } = req.body;

  try {
    const privilege = await Privilege.findByPk(id);
    if (!privilege)
      return res.status(404).json({ error: "Privilege not found" });

    privilege.name = name;
    await privilege.save();

    // Clear privilege cache
    await redisClient.del("all_privileges");
    res.json(privilege);
  } catch (error) {
    res.status(500).json({ error: "Error updating privilege" });
  }
};

/**
 * Delete a privilege - Only accessible by admins
 */
exports.deletePrivilege = async (req, res) => {
  if (req.user.privilege_id !== "admin") {
    return res.status(403).json({ error: "Only admins can delete privileges" });
  }

  const { id } = req.params;

  try {
    const privilege = await Privilege.findByPk(id);
    if (!privilege)
      return res.status(404).json({ error: "Privilege not found" });

    await privilege.destroy();

    // Clear privilege cache
    await redisClient.del("all_privileges");
    res.json({ message: "Privilege deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting privilege" });
  }
};
