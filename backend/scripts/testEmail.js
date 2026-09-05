require('dotenv').config();
const envoyerEmail = require('../utils/email');

const destinataire = process.argv[2];

if (!destinataire) {
  console.log('Usage : node scripts/testEmail.js fullvibedev@gmail.com');
  process.exit(1);
}

envoyerEmail({
  to: destinataire,
  subject: 'Test PASTEF Pologne',
  html: '<p>Si tu reçois cet email, tout fonctionne correctement ! 🎉</p>',
})
  .then((res) => {
    console.log('Email envoyé avec succès :', JSON.stringify(res));
    process.exit();
  })
  .catch((err) => {
    console.error('Erreur lors de l\'envoi :', err.message || err);
    process.exit(1);
  });