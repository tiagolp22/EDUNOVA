// models/Status.js

/**
 * Status Model Definition
 * 
 * Tracks the status of a course (e.g., draft, published).
 * 
 * @param {Sequelize} sequelize - The Sequelize instance.
 * @returns {Model} - The Status model.
 */
module.exports = (sequelize) => {
    const { DataTypes } = require('sequelize');

    const Status = sequelize.define('Status', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.JSONB,
            allowNull: false,
        },
    }, {
        tableName: 'status',
        timestamps: false,
    });

    Status.associate = (models) => {
        Status.hasMany(models.Course, {
            foreignKey: 'status_id',
            as: 'courses',
        });
    };

    return Status;
};
