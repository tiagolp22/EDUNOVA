const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const config = require("../config/config");

const db = {};

// Initialize Sequelize instance using configuration
const sequelize = new Sequelize(
  config.db.database,
  config.db.user,
  config.db.password,
  {
    host: config.db.host,
    dialect: "postgres",
    port: config.db.port,
    logging: config.nodeEnv === "development" ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

// Load all models in the current directory
fs.readdirSync(__dirname)
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== "index.js" && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

// Set up model associations
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Attach Sequelize instance and library to the db object
db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Test database connection
sequelize
  .authenticate()
  .then(() => console.log("✅ PostgreSQL connection established successfully."))
  .catch((err) =>
    console.error("❌ Unable to connect to the PostgreSQL database:", err)
  );

module.exports = db;
