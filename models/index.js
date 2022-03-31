const User = require('./user')
const Flavor = require('./flavor')


Flavor.hasMany(User)
User.belongsTo(Flavor, {
    foreignKey:'voting',
})


module.exports = {User, Flavor}
