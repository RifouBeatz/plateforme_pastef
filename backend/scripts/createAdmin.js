const pool = require('../config/db');
const bcrypt = require('bcrypt');

const [, , email, password] = process.argv;

if (!email || !password) {
  console.log('Usage : node scripts/createAdmin.js email motdepasse');
  process.exit(1);
}

async function run() {
  const hash = await bcrypt.hash(password, 10);
  try {
    await pool.query(
      'INSERT INTO admins (email, password_hash) VALUES ($1, $2)',
      [email, hash]
    );
    console.log('Admin créé :', email);
  } catch (err) {
    console.error('Erreur :', err.message);
  }
  process.exit();
}

run();