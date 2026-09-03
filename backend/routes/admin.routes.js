const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const verifierAdmin = require('../middleware/auth.middleware');

router.post('/login', adminController.login);
router.get('/inscriptions', verifierAdmin, adminController.listerInscriptions);
router.post('/inscriptions', verifierAdmin, adminController.ajouterInscription);
router.put('/inscriptions/:id', verifierAdmin, adminController.modifierInscription);
router.delete('/inscriptions/:id', verifierAdmin, adminController.supprimerInscription);
router.get('/stats', verifierAdmin, adminController.getStats);
router.put('/password', verifierAdmin, adminController.changerMotDePasse);
router.put('/account', verifierAdmin, adminController.modifierCompte);

module.exports = router;