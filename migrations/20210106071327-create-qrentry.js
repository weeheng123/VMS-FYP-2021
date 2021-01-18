'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('qrentries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING
      },
      ic: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
      qrimage: {
        type: Sequelize.BLOB
      },
      checkin: {
        type: Sequelize.STRING
      },
      checkout: {
        type: Sequelize.STRING
      },
      oriname: {
        type: Sequelize.STRING
      },
      oriic: {
        type: Sequelize.STRING
      },
      oriaddress: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('qrentries');
  }
};