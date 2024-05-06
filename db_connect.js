const { Pool } = require("pg");
const dotenv = require("dotenv");
dotenv.config();

// Buat objek konfigurasi koneksi
const pool = new Pool({
  user: process.env.USER_DB_PROD,
  host: process.env.HOST_DB_PROD,
  database: process.env.DB_NAME_PROD,
  password: process.env.PASSWORD_DB_PROD,
  port: process.env.PORT_DB_PROD, // Port default PostgreSQL
});

// Uji koneksi ke database
pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  console.log("Connected to PostgreSQL database");
  release(); // Melepaskan koneksi
});

// Export pool untuk digunakan di aplikasi Express.js
module.exports = pool;
