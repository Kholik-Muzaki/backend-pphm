const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

exports.verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Mengambil token dari header Authorization

    if (!token) {
        return res.status(403).json({ message: 'Token is required' });
    }

    try {
        // Verifikasi token JWT
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Menyimpan data pengguna yang sudah terverifikasi dalam request
        next(); // Lanjutkan ke handler berikutnya
    } catch (error) {
        console.error('Invalid token:', error);
        return res.status(403).json({ message: 'Invalid or expired token' });
    }
};
