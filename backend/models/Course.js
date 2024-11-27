/**
 * Represents a course with multilingual fields.
 * 
 * @param {Sequelize} sequelize - The Sequelize instance.
 * @returns {Model} - The Course model.
 */
module.exports = (sequelize, DataTypes) => {
    const Course = sequelize.define(
      "Course",
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        title: { type: DataTypes.JSONB, allowNull: false },
        subtitle: { type: DataTypes.JSONB, allowNull: false },
        description: { type: DataTypes.JSONB, allowNull: false },
        price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, validate: { min: 0 } },
      },
      { tableName: "courses", timestamps: true, underscored: true }
    );
  
    Course.associate = (models) => {
      Course.belongsTo(models.Status, { foreignKey: "status_id", as: "status" });
      Course.belongsTo(models.User, { foreignKey: "teacher_id", as: "teacher" });
      Course.hasMany(models.Class, { foreignKey: "course_id", as: "classes" });
      Course.hasMany(models.MediaFile, { foreignKey: "course_id", as: "mediaFiles" });
      Course.hasMany(models.Enrollment, { foreignKey: "course_id", as: "enrollments" });
      Course.hasMany(models.Progress, { foreignKey: "course_id", as: "progresses" });
      Course.hasMany(models.Payment, { foreignKey: "course_id", as: "payments" });
    };
  
    return Course;
  };
  