'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('image', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            album_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'album', // Pastikan ini sesuai dengan nama tabel album
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            src: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            caption: {
                type: Sequelize.STRING(255),
                allowNull: true
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW')
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.fn('NOW')
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('image');
    }
};
