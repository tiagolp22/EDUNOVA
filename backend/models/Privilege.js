/**
 * Represents user privileges.
 * 
 * @param {Sequelize} sequelize - The Sequelize instance.
 * @returns {Model} - The Privilege model.
 */
module.exports = (sequelize, DataTypes) => {
  const Privilege = sequelize.define(
    "Privilege",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.JSONB, allowNull: false }, // Multilingual name
    },
    { tableName: "privileges", timestamps: false, underscored: true }
  );

  Privilege.associate = (models) => {
    Privilege.hasMany(models.User, { foreignKey: "privilege_id", as: "users" });
  };

  return Privilege;
};
