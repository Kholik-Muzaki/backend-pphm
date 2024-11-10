const bcrypt = require('bcryptjs');
const db = require('../models');  // Pastikan Anda mengimpor db yang tepat

const initUsers = async () => {
    const users = [
        {
            role: 'admin',
            username: 'admin',
            password: 'admin123',  // Jangan hash password di sini, biarkan proses hash terjadi di model
        },
        {
            role: 'bendahara',
            username: 'bendahara',
            password: 'bendahara123',  // Sama, gunakan password plain
        },
    ];

    try {
        for (let user of users) {
            // Pastikan tidak ada duplikasi username, jika sudah ada, akan dilewati
            const [createdUser, created] = await db.User.findOrCreate({
                where: { username: user.username },
                defaults: user,  // Akan memasukkan password plain dan data lainnya
            });

            console.log(`User: ${user.username}, Password: ${user.password}`);
        }
        console.log('Users have been seeded successfully.');
    } catch (error) {
        console.error('Error seeding users:', error);
    }
};

// Panggil fungsi ini untuk memulai proses seeding
initUsers();

