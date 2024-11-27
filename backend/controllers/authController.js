const BaseController = require('./base/BaseController');
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const redisClient = require('../services/redisClient');

class AuthController extends BaseController {
  constructor() {
    super(User);
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  async register(req, res) {
    try {
      const { username, email, password, birthday, name, privilege_id = 3 } = req.body;

      // Check if user already exists
      const existingUser = await this.model.findOne({
        where: {
          [Op.or]: [{ email }, { username }]
        }
      });

      if (existingUser) {
        return res.status(409).json({
          error: 'User already exists',
          details: existingUser.email === email ? 'Email already registered' : 'Username already taken'
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await this.model.create({
        username,
        email,
        password: hashedPassword,
        birthday,
        name,
        privilege_id
      });

      // Remove password from response
      const { password: _, ...userData } = user.toJSON();

      return res.status(201).json(
        this.formatResponse(userData, 'User registered successfully')
      );
    } catch (error) {
      console.error('Registration error:', error);
      return this.handleError(error, res);
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await this.model.findOne({
        where: { email },
        include: [{
          model: this.model.sequelize.models.Privilege,
          as: 'privilege',
          attributes: ['name']
        }]
      });

      if (!user) {
        return res.status(401).json({
          error: 'Invalid credentials'
        });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({
          error: 'Invalid credentials'
        });
      }

      // Aumentando o tempo de expiração para 7 dias
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          privilege: user.privilege?.name
        },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: '7d' }  // 7 dias
      );

      // Atualizando o tempo no Redis também
      await redisClient.set(
        `auth_${token}`,
        'valid',
        'EX',
        7 * 24 * 60 * 60 // 7 dias em segundos
      );

      const { password: _, ...userData } = user.toJSON();

      return res.json(
        this.formatResponse({
          user: userData,
          token
        })
      );
    } catch (error) {
      console.error('Login error:', error);
      return this.handleError(error, res);
    }
  }

  async logout(req, res) {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (token) {
        await redisClient.del(`auth_${token}`);
      }

      return res.json(
        this.formatResponse(null, 'Logged out successfully')
      );
    } catch (error) {
      return this.handleError(error, res);
    }
  }
}

module.exports = new AuthController();