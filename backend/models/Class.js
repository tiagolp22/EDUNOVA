/**
 * Represents individual lessons within courses.
 * 
 * @param {Sequelize} sequelize - The Sequelize instance.
 * @returns {Model} - The Class model.
 */
module.exports = (sequelize, DataTypes) => {
    const Class = sequelize.define(
      "Class",
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        title: { type: DataTypes.JSONB, allowNull: false },
        subtitle: { type: DataTypes.JSONB, allowNull: false },
        description: { type: DataTypes.JSONB, allowNull: false },
        video_path: { type: DataTypes.TEXT, allowNull: true },
      },
      { tableName: "classes", timestamps: true, underscored: true }
    );
  
    Class.associate = (models) => {
      Class.belongsTo(models.Course, { foreignKey: "course_id", as: "course" });
      Class.hasMany(models.MediaFile, { foreignKey: "class_id", as: "mediaFiles" });
      Class.hasMany(models.Progress, { foreignKey: "class_id", as: "progresses" });
    };
  
    return Class;
  };
  