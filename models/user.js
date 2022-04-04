const {Model, DataTypes} = require('sequelize')
const connection = require('../database/connection')
const bcrypt = require("bcryptjs");


class User extends Model{
  static async authenticate(email, password){
    const user = await User.findOne({where: {email}})
    if(!user){ 
      throw new Error('Invalid email')
    }
    if(!bcrypt.compareSync(password, user.password)){
      throw new Error('Invalid password')
    }      
    return user
  }
}

  User.init(
    {
      userName: {
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
      },
      password:{
        type: DataTypes.TEXT,
        allowNull: false
      }
    },
    {
      sequelize: connection,
      modelName: 'User',
      timestamps: false
    }
  )

  module.exports = User