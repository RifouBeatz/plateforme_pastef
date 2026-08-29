const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Erreur de connexion à PostgreSQL :', err.message);
  } else {
    console.log('PostgreSQL connecté, heure serveur :', res.rows[0].now);
  }
});

module.exports = pool;