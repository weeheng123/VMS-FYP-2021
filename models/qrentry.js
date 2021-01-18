'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class qrentry extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  qrentry.init({
    name: DataTypes.STRING,
    ic: DataTypes.STRING,
    address: DataTypes.STRING,
    qrimage: DataTypes.BLOB,
    checkin: DataTypes.STRING,
    checkout: DataTypes.STRING,
    oriname: DataTypes.STRING,
    oriic: DataTypes.STRING,
    oriaddress: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'qrentry',
  });
  return qrentry;
};