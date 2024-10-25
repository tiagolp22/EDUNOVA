// models/User.js

/**
 * User Model Definition
 * 
 * Represents students, instructors, and admins.
 * 
 * @param {Sequelize} sequelize - The Sequelize instance.
 * @returns {Model} - The User model.
 */
module.exports = (sequelize) => {
    const { DataTypes } = require('sequelize');

    const User = sequelize.define('User', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        email: {
            type: DataTypes.TEXT,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.TEXT,
            allowNull: false,
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
        tableName: 'users',
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    });

    User.associate = (models) => {
        User.belongsTo(models.Privilege, {
            foreignKey: 'privilege_id',
            as: 'privilege',
        });

        User.hasMany(models.Course, {
            foreignKey: 'teacher_id',
            as: 'courses',
        });

        User.hasMany(models.Enrollment, {
            foreignKey: 'user_id',
            as: 'enrollments',
        });

        User.hasMany(models.Progress, {
            foreignKey: 'user_id',
            as: 'progresses',
        });

        User.hasMany(models.Payment, {
            foreignKey: 'user_id',
            as: 'payments',
        });
    };

    return User;
};
