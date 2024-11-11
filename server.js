// server.js
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const keuanganRoutes = require('./routes/keuanganRoutes'); 
const artikelRoutes = require('./routes/artikelRoutes');
const beritaRoutes = require('./routes/beritaRoutes');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Tambahkan route auth
app.use('/api/auth', authRoutes);
app.use('/api/', keuanganRoutes);
app.use('/api/', artikelRoutes);
app.use('/api/', beritaRoutes);

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
