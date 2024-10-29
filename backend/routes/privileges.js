// routes/privileges.js
const express = require("express");
const router = express.Router();
const privilegeController = require("../controllers/privilegeController");
const authenticateToken = require("../middleware/auth");
const { body, param } = require("express-validator");

// All routes below require authentication
// router.use(authenticateToken);

// Create a privilege
router.post(
  "/",
  [body("name").notEmpty().withMessage("Name is required")],
  privilegeController.createPrivilege
);

// Get all privileges
router.get("/", privilegeController.getAllPrivileges);

// Get a privilege by ID
router.get(
  "/:id",
  [param("id").isInt().withMessage("Privilege ID must be an integer")],
  privilegeController.getPrivilegeById
);

// Update a privilege
router.put(
  "/:id",
  [
    param("id").isInt().withMessage("Privilege ID must be an integer"),
    body("name").notEmpty().withMessage("Name is required"),
  ],
  privilegeController.updatePrivilege
);

// Delete a privilege
router.delete(
  "/:id",
  [param("id").isInt().withMessage("Privilege ID must be an integer")],
  privilegeController.deletePrivilege
);

module.exports = router;
