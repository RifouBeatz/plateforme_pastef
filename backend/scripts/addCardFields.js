const pool = require('../config/db');

async function run() {
  try {
    await pool.query(`
      ALTER TABLE inscriptions
        ADD COLUMN IF NOT EXISTS a_carte BOOLEAN NOT NULL DEFAULT false,
        ADD COLUMN IF NOT EXISTS type_carte VARCHAR(20),
        ADD COLUMN IF NOT EXISTS numero_carte VARCHAR(120)
    `);
    console.log('Les champs de carte ont été ajoutés à inscriptions.');
  } catch (err) {
    console.error('Erreur lors de la migration :', err.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

run();
