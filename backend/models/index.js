// models/index.js

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const config = require("../config/config");

const db = {};

// Criar instância do Sequelize usando a configuração atualizada
const sequelize = new Sequelize(
  config.database.name,
  config.database.username,
  config.database.password,
  {
    host: config.database.host,
    dialect: "postgres",
    port: config.database.port,
    logging: config.nodeEnv === "development" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Carregar todos os modelos do diretório
const modelsPath = __dirname;
fs.readdirSync(modelsPath)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== "index.js" && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(modelsPath, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// Configurar associações entre os modelos
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Adicionar sequelize e Sequelize ao objeto db
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Testar a conexão com o banco de dados
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ PostgreSQL Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("❌ Unable to connect to the PostgreSQL database:", err);
  });

module.exports = db;
