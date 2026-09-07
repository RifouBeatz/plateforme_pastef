const pool = require('../config/db');

async function run() {
  try {
    await pool.query('ALTER TABLE inscriptions ALTER COLUMN email DROP NOT NULL');
    console.log('La colonne email est maintenant facultative.');
  } catch (err) {
    console.error('Erreur lors de la migration :', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

run();