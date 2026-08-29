const express = require('express');
const cors = require('cors');
require('dotenv').config();
require('./config/db');

const app = express();
const PORT = process.env.PORT || 5001;
const DATABASE_URL = process.env.DATABASE_URL;

app.use(cors());
app.use(express.json());
const authRoutes = require('./routes/auth.routes');
app.use('/api', authRoutes);
const adminRoutes = require('./routes/admin.routes');
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'API PASTEF Pologne en ligne 🚀' });
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});