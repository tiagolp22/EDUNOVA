/**
 * Tracks payments for courses.
 * 
 * @param {Sequelize} sequelize - The Sequelize instance.
 * @returns {Model} - The Payment model.
 */
module.exports = (sequelize, DataTypes) => {
    const Payment = sequelize.define(
      "Payment",
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        status: { type: DataTypes.STRING, allowNull: false }, // E.g., "pending", "completed"
        payment_gateway_response: { type: DataTypes.JSON, allowNull: true },
        payment_date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      },
      { tableName: "payments", timestamps: false, underscored: true }
    );
  
    Payment.associate = (models) => {
      Payment.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
      Payment.belongsTo(models.Course, { foreignKey: "course_id", as: "course" });
    };
  
    return Payment;
  };
  