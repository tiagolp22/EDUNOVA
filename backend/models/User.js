// models/User.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db'); // Importa a instância correta

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    // Adicione outros atributos conforme necessário
}, {
    tableName: 'users', // Opcional: define o nome da tabela
    timestamps: true,   // Opcional: adiciona campos de timestamp
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

    return User;
};
