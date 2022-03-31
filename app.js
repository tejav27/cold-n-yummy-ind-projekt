const sequelize = require("./database/connection");

const {User, Flavor} = require('./models/index')

sequelize
.sync({force:true})
.then(result => {
    return User.create({username:"abcd",email:"acdd@jchd.com"})
})
.then(result => {
    return Flavor.create({name:"apple"})
})
.then(res => console.log(res))
.catch(err => {
    console.log(err)
})