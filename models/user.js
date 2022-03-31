const {Model, DataTypes} = require('sequelize')
const connection = require('../database/connection')

class User extends Model{}

  User.init(
    {
      username: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      userId:{
          type: DataTypes.INTEGER,
          autoIncrement:true,
          allowNull:false,
          primaryKey:true
      }
    },
    {
      sequelize: connection,
      modelName: 'User',
    }
  )

  module.exports = User