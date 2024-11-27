/**
 * Represents course categories.
 * 
 * @param {Sequelize} sequelize - The Sequelize instance.
 * @returns {Model} - The Category model.
 */
module.exports = (sequelize, DataTypes) => {
    const Category = sequelize.define(
      "Category",
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.JSONB, allowNull: false, unique: true }, // Multilingual name
      },
      { tableName: "categories", timestamps: true, underscored: true }
    );
  
    Category.associate = (models) => {
      Category.hasMany(models.Course, { foreignKey: "category_id", as: "courses" });
    };
  
    return Category;
  };
  