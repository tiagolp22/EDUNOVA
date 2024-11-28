const BaseController = require('./base/BaseController');
const { User, Privilege } = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

/**
 * UserController handles all user-related operations.
 */
class UserController extends BaseController {
  constructor() {
    super(User);
  }

  /**
   * Retrieves all users, excluding their passwords.
   * Only accessible by admin users.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  getAllUsers = async (req, res) => {
    try {
      const users = await User.findAll({
        attributes: { exclude: ['password'] },
        include: [{
          model: Privilege,
          as: 'privilege',
          attributes: ['name']
        }]
      });

      return res.json(this.formatResponse(users));
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  /**
   * Retrieves the currently authenticated user's information.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  getCurrentUser = async (req, res) => {
    try {
      const user = await User.findByPk(req.user.id, {
        attributes: { exclude: ['password'] },
        include: [{
          model: Privilege,
          as: 'privilege',
          attributes: ['name']
        }]
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.json(this.formatResponse(user));
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  /**
   * Retrieves a user by their ID.
   * Accessible by admin users or the user themselves.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  getUserById = async (req, res) => {
    try {
      const { id } = req.params;

      // Authorization: Only admin or the user themselves can access
      if (req.user.privilege.name !== 'admin' && req.user.id !== parseInt(id, 10)) {
        return res.status(403).json({ error: 'Unauthorized access' });
      }

      const user = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: [{
          model: Privilege,
          as: 'privilege',
          attributes: ['name']
        }]
      });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      return res.json(this.formatResponse(user));
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  /**
   * Updates a user's information.
   * Accessible by admin users or the user themselves.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  updateUser = async (req, res) => {
    try {
      const { id } = req.params;
      const { username, email, password, birthday, name } = req.body;

      // Authorization: Only admin or the user themselves can update
      if (req.user.privilege.name !== 'admin' && req.user.id !== parseInt(id, 10)) {
        return res.status(403).json({ error: 'Unauthorized to update this user' });
      }

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const updates = {};
      if (username) updates.username = username;
      if (email) updates.email = email;
      if (birthday) updates.birthday = birthday;
      if (name) updates.name = name;
      if (password) {
        updates.password = await bcrypt.hash(password, 12);
      }

      await user.update(updates);

      const updatedUser = await User.findByPk(id, {
        attributes: { exclude: ['password'] },
        include: [{
          model: Privilege,
          as: 'privilege',
          attributes: ['name']
        }]
      });

      return res.json(this.formatResponse(updatedUser));
    } catch (error) {
      return this.handleError(error, res);
    }
  }

  /**
   * Deletes a user.
   * Only accessible by admin users.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  deleteUser = async (req, res) => {
    try {
      const { id } = req.params;

      // Authorization: Only admin can delete users
      if (req.user.privilege.name !== 'admin') {
        return res.status(403).json({ error: 'Admin privileges required' });
      }

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      await user.destroy();
      return res.json(this.formatResponse(null, 'User deleted successfully'));
    } catch (error) {
      return this.handleError(error, res);
    }
  }
}

module.exports = new UserController();
