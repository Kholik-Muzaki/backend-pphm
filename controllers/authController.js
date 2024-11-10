const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
}

// Fungsi untuk mengupdate profil pengguna
exports.updateProfile = async (req, res) => {
    const { username, password } = req.body;
    const userId = req.user.id; // Menggunakan ID pengguna yang sudah terautentikasi

    if (!username && !password) {
        return res.status(400).json({ message: 'Username or password is required to update' });
    }

    try {
        const user = await db.User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Jika ada perubahan username, pastikan username baru belum digunakan oleh pengguna lain
        if (username && username !== user.username) {
            const existingUser = await db.User.findOne({ where: { username } });
            if (existingUser) {
                return res.status(409).json({ message: 'Username already exists' });
            }
            user.username = username;  // Update username
        }

        // Jika password diubah, lakukan hashing password baru
        if (password) {
            user.password = await bcrypt.hash(password, 10);  // Hash password baru
        }

        // Simpan perubahan ke database
        await user.save();

        return res.status(200).json({
            message: 'Profile updated successfully',
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

// Fungsi login tetap sama, hanya menambah peran autentikasi di bagian ini
exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        const user = await db.User.findOne({ where: { username } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Compare the provided password with the stored hashed password
        bcrypt.compare(password, user.password, function (err, isPasswordValid) {
            if (err) {
                console.error('Error comparing password:', err);
                return res.status(500).json({ message: 'Error comparing password' });
            }

            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            // Generate a JWT token if the password is valid
            const token = jwt.sign(
                { id: user.id, role: user.role },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.status(200).json({ message: 'Login successful', token });
        });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
