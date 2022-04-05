const database = require("../database/connection");

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
          {flavorName:"coconut"},
          {flavorName:"strawberry"},
          {flavorName:"pistachio"},
          {flavorName:"mint"},
          {flavorName:"blueberry"},
          {flavorName:"saltedcaramel"},
          {flavorName:"almond"},
          {flavorName:"coffeeoreo"},
          {flavorName:"guava"},
          {flavorName:"pineapple"},
        ]) 
}

async function start(){
    await setup()
    await seed()
}

start()

module.exports = {User, Flavor}
