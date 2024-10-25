// models/Privilege.js

/**
 * Privilege Model Definition
 * 
 * Represents user roles and permissions.
 * 
 * @param {Sequelize} sequelize - The Sequelize instance.
 * @returns {Model} - The Privilege model.
 */
module.exports = (sequelize) => {
    const { DataTypes } = require('sequelize');

    const Privilege = sequelize.define('Privilege', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        tableName: 'privileges',
        timestamps: false,
    });

    Privilege.associate = (models) => {
        Privilege.hasMany(models.User, {
            foreignKey: 'privilege_id',
            as: 'users',
        });
    };

    return Privilege;
};
