const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');  // Importa o sequelize de db.js

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  timestamps: true, // Garantindo que createdAt e updatedAt estão habilitados
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = User;
