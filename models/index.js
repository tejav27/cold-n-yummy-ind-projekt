const database = require("../database/connection");
const { Sequelize, DataTypes, Model } = require('sequelize')


const User = require('./user')
const Flavor = require('./flavor')

Flavor.hasMany(User)
User.belongsTo(Flavor)

async function setup(){
    await database.sync({force: true})
}

async function seed(){
    await Flavor.bulkCreate([
          {flavorName:"chocolate"},
          {flavorName:"banana"},
          {flavorName:"vanilla"},
          {flavorName:"butterscotch"},
          {flavorName:"mango"},
        ]) 
}

async function start(){
    await setup()
    await seed()
}

start()

module.exports = {User, Flavor,start}
