// config/db.js

const { Sequelize, DataTypes } = require("sequelize");
const config = require("./config");
const fs = require("fs");
const path = require("path");

const sequelize = new Sequelize(
  config.db.database, // Database name
  config.db.user, // Database username
  config.db.password, // Database password
  {
    host: config.db.host, // Database host
    port: config.db.port, // Database port
    dialect: "postgres", // Database dialect
    logging: process.env.NODE_ENV === "development" ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const db = { models: {} };

// Import models dynamically
const modelsDir = path.join(__dirname, "../models");

fs.readdirSync(modelsDir)
  .filter((file) => file.endsWith(".js") && file !== "index.js")
  .forEach((file) => {
    const modelDefiner = require(path.join(modelsDir, file));
    if (typeof modelDefiner === "function") {
      const model = modelDefiner(sequelize, DataTypes);
      db[model.name] = model;
      db.models[model.name] = model;
    }
  });

// Set up associations
Object.keys(db.models).forEach((modelName) => {
  if (typeof db.models[modelName].associate === "function") {
    db.models[modelName].associate(db.models);
  }
});

// Test database connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    throw error;
  }
};

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.testConnection = testConnection;

module.exports = db;
