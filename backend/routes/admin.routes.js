const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');
const verifierAdmin = require('../middleware/auth.middleware');

router.post('/login', adminController.login);
router.get('/inscriptions', verifierAdmin, adminController.listerInscriptions);
router.get('/stats', verifierAdmin, adminController.getStats);

module.exports = router;