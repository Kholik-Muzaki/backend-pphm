'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('album', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false
            },
            title: {
                type: Sequelize.STRING(255),
                allowNull: false
            },
            description: {
                type: Sequelize.TEXT,
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
        await queryInterface.dropTable('album');
    }
};
