const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../models');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not defined");
}

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

        console.log(`Stored hashed password in DB: ${user.password}`);  // Check stored hash
        console.log(`Plaintext password provided: ${password}`);        // Log plaintext input

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log(`Password Comparison Result: ${isPasswordValid}`);  // True if match

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({ message: 'Login successful', token });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};

exports.register = async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password || !role) {
        return res.status(400).json({ message: 'Username, password, and role are required' });
    }

    try {
        const existingUser = await db.User.findOne({ where: { username } });
        if (existingUser) {
            return res.status(409).json({ message: 'Username already exists' });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log(`Registering user with hashed password: ${hashedPassword}`); // Log hashed password

        const newUser = await db.User.create({
            username,
            password: hashedPassword,
            role
        });

        console.log(`User registered successfully with ID: ${newUser.id} and hashed password: ${newUser.password}`);

        return res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: newUser.id,
                username: newUser.username,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json({ message: 'Server error' });
    }
};
