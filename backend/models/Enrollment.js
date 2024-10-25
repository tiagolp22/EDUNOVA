// models/Enrollment.js

/**
 * Enrollment Model Definition
 * 
 * Tracks student enrollments in courses.
 * 
 * @param {Sequelize} sequelize - The Sequelize instance.
 * @returns {Model} - The Enrollment model.
 */
module.exports = (sequelize) => {
    const { DataTypes } = require('sequelize');

    const Enrollment = sequelize.define('Enrollment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        is_paid: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        enrolled_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'enrollments',
        timestamps: false,
    });

    Enrollment.associate = (models) => {
        Enrollment.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user',
        });

        Enrollment.belongsTo(models.Course, {
            foreignKey: 'course_id',
            as: 'course',
        });
    };

    return Enrollment;
};
