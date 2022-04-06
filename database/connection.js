const Sequelize = require('sequelize')

const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: './db.db',
});


module.exports = sequelize;