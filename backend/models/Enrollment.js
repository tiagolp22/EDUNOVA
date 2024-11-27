/**
 * Tracks user enrollments in courses.
 * 
 * @param {Sequelize} sequelize - The Sequelize instance.
 * @returns {Model} - The Enrollment model.
 */
module.exports = (sequelize, DataTypes) => {
    const Enrollment = sequelize.define(
      "Enrollment",
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        is_paid: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
        enrolled_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      },
      { tableName: "enrollments", timestamps: false, underscored: true }
    );
  
    Enrollment.associate = (models) => {
      Enrollment.belongsTo(models.User, { foreignKey: "user_id", as: "user" });
      Enrollment.belongsTo(models.Course, { foreignKey: "course_id", as: "course" });
    };
  
    return Enrollment;
  };
  