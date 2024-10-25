// models/Course.js

/**
 * Course Model Definition
 * 
 * Represents courses with multilingual support.
 * 
 * @param {Sequelize} sequelize - The Sequelize instance.
 * @returns {Model} - The Course model.
 */
module.exports = (sequelize) => {
    const { DataTypes } = require('sequelize');

    const Course = sequelize.define('Course', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: DataTypes.JSONB,
            allowNull: false,
        },
        subtitle: {
            type: DataTypes.JSONB,
            allowNull: false,
        },
        description: {
            type: DataTypes.JSONB,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'courses',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    Course.associate = (models) => {
        Course.belongsTo(models.Status, {
            foreignKey: 'status_id',
            as: 'status',
        });

        Course.belongsTo(models.User, {
            foreignKey: 'teacher_id',
            as: 'teacher',
        });

        Course.hasMany(models.Class, {
            foreignKey: 'course_id',
            as: 'classes',
        });

        Course.hasMany(models.MediaFile, {
            foreignKey: 'course_id',
            as: 'mediaFiles',
        });

        Course.hasMany(models.Enrollment, {
            foreignKey: 'course_id',
            as: 'enrollments',
        });

        Course.hasMany(models.Progress, {
            foreignKey: 'course_id',
            as: 'progresses',
        });

        Course.hasMany(models.Payment, {
            foreignKey: 'course_id',
            as: 'payments',
        });
    };

    return Course;
};
