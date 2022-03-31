const {Model, DataTypes} = require('sequelize')
const connection = require('../database/connection')


class Flavor extends Model{}

  Flavor.init(
    {
      flavorName: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      flavorId:{
          type: DataTypes.INTEGER,
          autoIncrement:true,
          allowNull:false,
          primaryKey:true
      }
    },
    {
      sequelize: connection,
      modelName: 'Flavor',
    }
  )

  module.exports = Flavor