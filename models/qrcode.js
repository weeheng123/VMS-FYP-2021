'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class qrcode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  qrcode.init({
    name: DataTypes.STRING,
    ic: DataTypes.STRING,
    address: DataTypes.STRING,
    qrimage: DataTypes.BLOB,
    checkin: DataTypes.STRING,
    checkout: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'qrcode',
  });
  return qrcode;
};