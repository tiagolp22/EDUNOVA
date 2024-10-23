require('dotenv').config();

const config = {
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'mydatabase',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'mysecretkey',
    expiration: process.env.JWT_EXPIRATION || 36000,
  },
  server: {
    port: process.env.PORT || 5000,
    environment: process.env.NODE_ENV || 'development',
  },
};

module.exports = config;
