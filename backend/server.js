// server.js
const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');  // Importing the database connection
const userRoutes = require('./routes/users');
const config = require('./config/config');

const app = express();

// Middleware setup
app.use(cors());  // Enable Cross-Origin Resource Sharing
app.use(express.json());  // Parse incoming JSON requests

// Routes setup
app.use('/api/users', userRoutes);  // User routes

// Syncing the database and starting the server
sequelize.sync().then(() => {
  app.listen(config.server.port, () => {
    console.log(`Server running on port ${config.server.port}`);
  });
}).catch(err => {
  console.error('Error syncing the database:', err);
});
