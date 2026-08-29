const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis.' });
  }

  try {
    const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    const admin = result.rows[0];

    if (!admin) {
      return res.status(401).json({ error: 'Identifiants incorrects.' });
    }

    const motDePasseValide = await bcrypt.compare(password, admin.password_hash);
    if (!motDePasseValide) {
      return res.status(401).json({ error: 'Identifiants incorrects.' });
    }

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ message: 'Connexion réussie', token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur, réessaie plus tard.' });
  }
};
exports.listerInscriptions = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, nom, prenoms, pays, ville, telephone, email, statut, created_at FROM inscriptions ORDER BY created_at DESC'
    );
    res.json({ total: result.rows.length, inscriptions: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur, réessaie plus tard.' });
  }
};
exports.getStats = async (req, res) => {
  try {
    const total = await pool.query('SELECT COUNT(*) FROM inscriptions');
    const parStatut = await pool.query(
      'SELECT statut, COUNT(*) AS total FROM inscriptions GROUP BY statut ORDER BY total DESC'
    );
    const parPays = await pool.query(
      'SELECT pays, COUNT(*) AS total FROM inscriptions GROUP BY pays ORDER BY total DESC'
    );

    res.json({
      total: parseInt(total.rows[0].count, 10),
      parStatut: parStatut.rows,
      parPays: parPays.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur, réessaie plus tard.' });
  }
};