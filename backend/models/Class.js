// models/Class.js

/**
 * Class Model Definition
 * 
 * Represents individual lessons within courses.
 * 
 * @param {Sequelize} sequelize - The Sequelize instance.
 * @returns {Model} - The Class model.
 */
module.exports = (sequelize) => {
    const { DataTypes } = require('sequelize');

    const Class = sequelize.define('Class', {
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
        video_path: {
            type: DataTypes.TEXT,
            allowNull: true,
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
        tableName: 'classes',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    Class.associate = (models) => {
        Class.belongsTo(models.Course, {
            foreignKey: 'course_id',
            as: 'course',
        });

        Class.hasMany(models.MediaFile, {
            foreignKey: 'class_id',
            as: 'mediaFiles',
        });

        Class.hasMany(models.Progress, {
            foreignKey: 'class_id',
            as: 'progresses',
        });
    };

    return Class;
};
