// models/Privilege.js

/**
 * Privilege Model Definition
 * 
 * Represents user roles and permissions, allowing for role-based access control within the platform.
 * 
 * @param {Sequelize} sequelize - The Sequelize instance.
 * @returns {Model} - The Privilege model.
 */

module.exports = (sequelize, DataTypes) => {
    const Privilege = sequelize.define('Privilege', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
    }, {
      tableName: 'privileges',
      timestamps: false,
      underscored: true,
    });
  
    /**
     * Define associations between models
     */
    Privilege.associate = (models) => {
      Privilege.hasMany(models.User, {
        foreignKey: 'privilege_id',
        as: 'users',
      });
    };
  
    return Privilege;
  };
  