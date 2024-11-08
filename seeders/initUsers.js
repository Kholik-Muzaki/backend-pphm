const initUsers = async () => {
    const users = [
        {
            role: 'admin',
            username: 'admin',
            password: await bcrypt.hash('admin123', 10),
        },
        {
            role: 'bendahara',
            username: 'bendahara',
            password: await bcrypt.hash('bendahara123', 10),
        },
    ];

    for (let user of users) {
        const [createdUser, created] = await db.User.findOrCreate({
            where: { username: user.username },
            defaults: user,
        });

        // Tambahkan log untuk memastikan password ter-hash dan tersimpan dengan benar
        console.log(`User: ${user.username}, Password Hash: ${createdUser.password}`);
    }
};

module.exports = initUsers;
