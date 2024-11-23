// server.js
const express = require('express');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/authRoutes');
const keuanganRoutes = require('./routes/keuanganRoutes');
const artikelRoutes = require('./routes/artikelRoutes');
const beritaRoutes = require('./routes/beritaRoutes');
const videoRoutes = require('./routes/videoRoutes');
const albumRoutes = require('./routes/albumRoutes');
const cors = require('cors')

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// menyediakan akses ke folder uploads sebagai static files
app.use('/uploads', express.static('uploads'));

// konfigurasi cors
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

// route
app.use('/api/auth', authRoutes);
app.use('/api/', keuanganRoutes);
app.use('/api/', artikelRoutes);
app.use('/api/', beritaRoutes);
app.use('/api/', videoRoutes);
app.use('/api/', albumRoutes);

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
