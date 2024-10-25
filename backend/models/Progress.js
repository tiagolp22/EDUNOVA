// models/Progress.js

/**
 * Progress Model Definition
 * 
 * Tracks the progress of students within a course.
 * 
 * @param {Sequelize} sequelize - The Sequelize instance.
 * @returns {Model} - The Progress model.
 */
module.exports = (sequelize) => {
    const { DataTypes } = require('sequelize');

    const Progress = sequelize.define('Progress', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        progress_percentage: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: true,
            validate: {
                min: 0,
                max: 100,
            },
        },
        last_accessed: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    }, {
        tableName: 'progress',
        timestamps: false,
    });

    Progress.associate = (models) => {
        Progress.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user',
        });

        Progress.belongsTo(models.Course, {
            foreignKey: 'course_id',
            as: 'course',
        });

        Progress.belongsTo(models.Class, {
            foreignKey: 'class_id',
            as: 'class',
        });
    };

    return Progress;
};
