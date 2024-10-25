// models/Payment.js

/**
 * Payment Model Definition
 * 
 * Tracks course purchases and payments.
 * 
 * @param {Sequelize} sequelize - The Sequelize instance.
 * @returns {Model} - The Payment model.
 */
module.exports = (sequelize) => {
    const { DataTypes } = require('sequelize');

    const Payment = sequelize.define('Payment', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0,
            },
        },
        status: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                isIn: [['pending', 'completed', 'failed']],
            },
        },
        payment_gateway_response: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        payment_date: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'payments',
        timestamps: false,
    });

    Payment.associate = (models) => {
        Payment.belongsTo(models.User, {
            foreignKey: 'user_id',
            as: 'user',
        });

        Payment.belongsTo(models.Course, {
            foreignKey: 'course_id',
            as: 'course',
        });
    };

    return Payment;
};
