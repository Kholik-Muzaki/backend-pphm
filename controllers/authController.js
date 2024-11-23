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
        return res.status(400).json({
            status: 'fail',
            message: 'Username or password is required to update',
        });
    }

    try {
        const user = await db.User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found',
            });
        }

        // Periksa apakah username ingin diubah dan apakah username sudah digunakan
        if (username && username !== user.username) {
            const existingUser = await db.User.findOne({ where: { username } });
            if (existingUser) {
                return res.status(409).json({
                    status: 'fail',
                    message: 'Username already exists. Please choose another username.',
                });
            }
            user.username = username; // Update username
        }

        // Jika password ingin diubah
        if (password) {
            user.password = await bcrypt.hash(password, 10); // Hash password baru
        }

        // Simpan perubahan ke database
        await user.save();

        return res.status(200).json({
            status: 'success',
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        return res.status(500).json({
            status: 'error',
            message: 'An unexpected error occurred while updating the profile. Please try again later.',
        });
    }
};


// Fungsi login tetap sama, hanya menambah peran autentikasi di bagian ini
exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            status: 'fail',
            message: 'Username and password are required',
        });
    }

    try {
        const user = await db.User.findOne({ where: { username } });

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found. Please check your credentials.',
            });
        }

        // Bandingkan password yang diberikan dengan password yang tersimpan
        bcrypt.compare(password, user.password, function (err, isPasswordValid) {
            if (err) {
                console.error('Error comparing password:', err);
                return res.status(500).json({
                    status: 'error',
                    message: 'An error occurred while validating your password.',
                });
            }

            if (!isPasswordValid) {
                return res.status(401).json({
                    status: 'fail',
                    message: 'Invalid password. Please try again.',
                });
            }

            // Generate token JWT jika password valid
            const token = jwt.sign(
                { id: user.id, role: user.role },
                JWT_SECRET,
                { expiresIn: '1h' }
            );

            return res.status(200).json({
                status: 'success',
                message: 'Login successful',
                data: {
                    token,
                    user: {
                        id: user.id,
                        username: user.username,
                        role: user.role,
                    },
                },
            });
        });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({
            status: 'error',
            message: 'An unexpected error occurred during login. Please try again later.',
        });
    }
};


exports.getProfile = async (req, res) => {
    const userId = req.user.id; // Menggunakan ID pengguna yang sudah terautentikasi
    try {
        // Ambil pengguna berdasarkan ID
        const user = await db.User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found',
            });
        }

        return res.status(200).json({
            status: 'success',
            message: 'User profile retrieved successfully',
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        return res.status(500).json({
            status: 'error',
            message: 'An unexpected error occurred while fetching the user profile. Please try again later.',
        });
    }
};
