module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
          notEmpty: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8, 128],
        },
      },
      birthday: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        validate: {
          isDate: true,
        },
      },
    },
    {
      tableName: "users",
      timestamps: true, // Garante createdAt e updatedAt automáticos
      underscored: true, // Garante que eles sejam mapeados para created_at e updated_at
    }
  );

  // Associações
  User.associate = (models) => {
    User.belongsTo(models.Privilege, {
      foreignKey: "privilege_id",
      as: "privilege",
    });
    User.hasMany(models.Course, {
      foreignKey: "teacher_id",
      as: "courses",
    });
    User.hasMany(models.Enrollment, {
      foreignKey: "user_id",
      as: "enrollments",
    });
    User.hasMany(models.Progress, {
      foreignKey: "user_id",
      as: "progresses",
    });
    User.hasMany(models.Payment, {
      foreignKey: "user_id",
      as: "payments",
    });
  };

  return User;
};
