const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const envoyerEmail = require('../utils/email');

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

        const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiration = new Date(Date.now() + 10 * 60 * 1000);

    await pool.query(
      'UPDATE admins SET two_factor_code = $1, two_factor_expires = $2 WHERE id = $3',
      [code, expiration, admin.id]
    );

    await envoyerEmail({
      to: admin.email,
      subject: 'Ton code de connexion - PASTEF Pologne',
      html: `<p>Ton code de connexion est : <strong style="font-size: 24px;">${code}</strong></p><p>Ce code expire dans 10 minutes.</p>`,
    });

    res.json({ message: 'Code envoyé par email.', requiresTwoFactor: true, email: admin.email });
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
const STATUTS_VALIDES_ADMIN = ['Sympathisant', 'Militant', 'Leader Local'];
const PAYS_VALIDES_ADMIN = ['Pologne', 'République Tchèque', 'Slovaquie', 'Roumanie', 'Ukraine', 'Estonie', 'Lettonie', 'Lituanie'];

exports.ajouterInscription = async (req, res) => {
  const { nom, prenoms, pays, ville, telephone, email, statut, consentement } = req.body;

  if (!nom || !prenoms || !pays || !ville || !telephone || !statut) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
  }

  if (!consentement) {
    return res.status(400).json({ error: 'Le consentement est obligatoire.' });
  }

  if (!STATUTS_VALIDES_ADMIN.includes(statut)) {
    return res.status(400).json({ error: 'Statut invalide.' });
  }

  if (!PAYS_VALIDES_ADMIN.includes(pays)) {
    return res.status(400).json({ error: 'Pays invalide.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO inscriptions (nom, prenoms, pays, ville, telephone, email, statut, consentement)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, nom, prenoms, email, statut, created_at`,
      [nom, prenoms, pays, ville, telephone, email || null, statut, consentement]
    );

    res.status(201).json({
      message: 'Inscription ajoutée !',
      inscription: result.rows[0],
    });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Cet email est déjà enregistré.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur, réessaie plus tard.' });
  }
};
exports.changerMotDePasse = async (req, res) => {
  const { nouveauMotDePasse } = req.body;

  if (!nouveauMotDePasse || nouveauMotDePasse.length < 8) {
    return res.status(400).json({ error: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' });
  }

  try {
    const hash = await bcrypt.hash(nouveauMotDePasse, 10);
    await pool.query(
      'UPDATE admins SET password_hash = $1, must_change_password = false WHERE id = $2',
      [hash, req.admin.id]
    );
    res.json({ message: 'Mot de passe mis à jour avec succès.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur, réessaie plus tard.' });
  }
};
exports.modifierCompte = async (req, res) => {
  const { motDePasseActuel, nouvelEmail, nouveauMotDePasse } = req.body;

  if (!motDePasseActuel) {
    return res.status(400).json({ error: 'Le mot de passe actuel est requis.' });
  }
  if (!nouvelEmail && !nouveauMotDePasse) {
    return res.status(400).json({ error: 'Indique un nouvel email ou un nouveau mot de passe.' });
  }

  try {
    const result = await pool.query('SELECT * FROM admins WHERE id = $1', [req.admin.id]);
    const admin = result.rows[0];

    const motDePasseValide = await bcrypt.compare(motDePasseActuel, admin.password_hash);
    if (!motDePasseValide) {
      return res.status(401).json({ error: 'Mot de passe actuel incorrect.' });
    }

    if (nouveauMotDePasse && nouveauMotDePasse.length < 8) {
      return res.status(400).json({ error: 'Le nouveau mot de passe doit contenir au moins 8 caractères.' });
    }

    const nouvelEmailFinal = nouvelEmail || admin.email;
    const nouveauHash = nouveauMotDePasse ? await bcrypt.hash(nouveauMotDePasse, 10) : admin.password_hash;

    await pool.query(
      'UPDATE admins SET email = $1, password_hash = $2 WHERE id = $3',
      [nouvelEmailFinal, nouveauHash, req.admin.id]
    );

    res.json({ message: 'Compte mis à jour avec succès.', email: nouvelEmailFinal });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Cet email est déjà utilisé par un autre compte.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur, réessaie plus tard.' });
  }
};
exports.modifierInscription = async (req, res) => {
  const { id } = req.params;
  const { nom, prenoms, pays, ville, telephone, email, statut } = req.body;

  if (!nom || !prenoms || !pays || !ville || !telephone || !statut) {
    return res.status(400).json({ error: 'Tous les champs sont obligatoires.' });
  }
  if (!STATUTS_VALIDES_ADMIN.includes(statut)) {
    return res.status(400).json({ error: 'Statut invalide.' });
  }
  if (!PAYS_VALIDES_ADMIN.includes(pays)) {
    return res.status(400).json({ error: 'Pays invalide.' });
  }

  try {
    const result = await pool.query(
      `UPDATE inscriptions SET nom=$1, prenoms=$2, pays=$3, ville=$4, telephone=$5, email=$6, statut=$7
       WHERE id=$8 RETURNING id, nom, prenoms, email, statut, created_at`,
      [nom, prenoms, pays, ville, telephone, email || null, statut, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inscription introuvable.' });
    }

    res.json({ message: 'Inscription modifiée !', inscription: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Cet email est déjà utilisé par une autre inscription.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur, réessaie plus tard.' });
  }
};

exports.supprimerInscription = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM inscriptions WHERE id = $1 RETURNING id', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Inscription introuvable.' });
    }
    res.json({ message: 'Inscription supprimée.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur, réessaie plus tard.' });
  }
};
exports.motDePasseOublie = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email requis.' });
  }

  try {
    const result = await pool.query('SELECT * FROM admins WHERE email = $1', [email]);
    const admin = result.rows[0];

    if (admin) {
      const token = crypto.randomBytes(32).toString('hex');
      const expiration = new Date(Date.now() + 60 * 60 * 1000);

      await pool.query(
        'UPDATE admins SET reset_token = $1, reset_token_expires = $2 WHERE id = $3',
        [token, expiration, admin.id]
      );

      const lien = `${process.env.FRONTEND_URL}/admin/reset-password?token=${token}`;

      await envoyerEmail({
        to: admin.email,
        subject: 'Réinitialisation de ton mot de passe - PASTEF Pologne',
        html: `
          <p>Tu as demandé à réinitialiser ton mot de passe.</p>
          <p><a href="${lien}">Clique ici pour choisir un nouveau mot de passe</a></p>
          <p>Ce lien expire dans 1 heure. Si tu n'es pas à l'origine de cette demande, ignore cet email.</p>
        `,
      });
    }

    res.json({ message: "Si ce compte existe, un email de réinitialisation vient d'être envoyé." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur, réessaie plus tard.' });
  }
};

exports.reinitialiserMotDePasse = async (req, res) => {
  const { token, nouveauMotDePasse } = req.body;

  if (!token || !nouveauMotDePasse) {
    return res.status(400).json({ error: 'Requête invalide.' });
  }
  if (nouveauMotDePasse.length < 8) {
    return res.status(400).json({ error: 'Le mot de passe doit contenir au moins 8 caractères.' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM admins WHERE reset_token = $1 AND reset_token_expires > NOW()',
      [token]
    );
    const admin = result.rows[0];

    if (!admin) {
      return res.status(400).json({ error: 'Lien invalide ou expiré. Refais une demande.' });
    }

    const hash = await bcrypt.hash(nouveauMotDePasse, 10);
    await pool.query(
      'UPDATE admins SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL, must_change_password = false WHERE id = $2',
      [hash, admin.id]
    );

    res.json({ message: 'Mot de passe réinitialisé avec succès.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur, réessaie plus tard.' });
  }
};
exports.verifierCode = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: 'Email et code requis.' });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM admins WHERE email = $1 AND two_factor_code = $2 AND two_factor_expires > NOW()',
      [email, code]
    );
    const admin = result.rows[0];

    if (!admin) {
      return res.status(401).json({ error: 'Code invalide ou expiré.' });
    }

    await pool.query(
      'UPDATE admins SET two_factor_code = NULL, two_factor_expires = NULL WHERE id = $1',
      [admin.id]
    );

    const token = jwt.sign(
      { id: admin.id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ message: 'Connexion réussie', token, mustChangePassword: admin.must_change_password });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur, réessaie plus tard.' });
  }
};