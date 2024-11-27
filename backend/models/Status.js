/**
 * Represents course status (e.g., active, inactive).
 * 
 * @param {Sequelize} sequelize - The Sequelize instance.
 * @returns {Model} - The Status model.
 */
module.exports = (sequelize, DataTypes) => {
    const Status = sequelize.define(
      "Status",
      {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        name: { type: DataTypes.JSONB, allowNull: false, unique: true }, // Multilingual name
      },
      { tableName: "status", timestamps: false, underscored: true }
    );
  
    Status.associate = (models) => {
      Status.hasMany(models.Course, { foreignKey: "status_id", as: "courses" });
    };
  
    return Status;
  };
  