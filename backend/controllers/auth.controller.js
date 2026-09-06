const pool = require('../config/db');

const STATUTS_VALIDES = ['Sympathisant', 'Militant', 'Leader Local'];
const PAYS_VALIDES = ['Pologne', 'République Tchèque', 'Slovaquie', 'Roumanie', 'Ukraine', 'Estonie', 'Lettonie', 'Lituanie'];

exports.inscrire = async (req, res) => {
  const { nom, prenoms, pays, ville, telephone, email, statut, consentement } = req.body;

  if (!nom || !prenoms || !pays || !ville || !telephone || !email || !statut) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
  }

  if (!consentement) {
    return res.status(400).json({ error: "Le consentement est obligatoire pour s'inscrire." });
  }

  if (!STATUTS_VALIDES.includes(statut)) {
    return res.status(400).json({ error: 'Statut invalide.' });
  }

  if (!PAYS_VALIDES.includes(pays)) {
    return res.status(400).json({ error: 'Pays invalide.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO inscriptions (nom, prenoms, pays, ville, telephone, email, statut, consentement)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, nom, prenoms, email, statut, created_at`,
      [nom, prenoms, pays, ville, telephone, email, statut, consentement]
    );

    res.status(201).json({
      message: 'Inscription réussie !',
      inscription: result.rows[0],
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Cet email est déjà inscrit.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur, réessaie plus tard.' });
  }
};