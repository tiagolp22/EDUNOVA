const jwt = require("jsonwebtoken");
const config = require("../config/config");
const { models } = require("../config/db");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access token missing" });
    }

    jwt.verify(token, config.jwt.secret, async (err, decoded) => {
      if (err) {
        console.error("Token verification error:", err);
        return res.status(401).json({
          error:
            err.name === "TokenExpiredError"
              ? "Token expired"
              : "Invalid token",
        });
      }

      try {
        // Use models directly from the imported db config
        const { User, Privilege } = models;

        const user = await User.findOne({
          where: { id: decoded.id },
          include: [
            {
              model: Privilege,
              as: "privilege",
              attributes: ["name"],
            },
          ],
        });

        if (!user) {
          return res.status(401).json({ error: "User not found" });
        }

        // Attach complete user info to request
        req.user = {
          id: user.id,
          email: user.email,
          username: user.username || user.name,
          privilege: user.privilege ? { name: user.privilege.name } : null,
        };

        next();
      } catch (error) {
        console.error("Error fetching user data:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    });
  } catch (error) {
    console.error("Authentication error:", error);
    res
      .status(500)
      .json({ error: "Internal server error during authentication" });
  }
};

module.exports = authenticateToken;
