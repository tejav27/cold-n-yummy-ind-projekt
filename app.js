const express = require('express')
const { Sequelize, DataTypes, Model } = require('sequelize')

const sequelize = require("./database/connection");

const {User, Flavor,start} = require('./models/index');

const app = express()
app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))

app.get('/', (req,res) =>{
    console.log("here at home")
    res.render('home')
})
app.post('/voting', async (req,res)=>{
    console.log("from voting::", req.body)
    const {flavor,username,usermail} = req.body
    //check if user alredy exists
    const dupUser = await User.findOne({ where: { email: usermail } });
    if(!dupUser){
        const v = Flavor.findOne({ where: {flavorName : flavor}})
        .then( votedFlavor => {
            votedFlavor.increment('numVotes', { by: 1 })
            // return votedFlavor.increment('numVotes', { by: 1 })
        })
        console.log("v",v)
       const newUser = await User.create({
            userName:username,
            email:usermail,
            FlavorFlavorId:v.flavorId
        })
        console.log("neewUser:", newUser)
        res.redirect('success')
    }else{
        res.render('failed')
    }
})
app.get('/success',(req,res)=>{
    console.log(req.body)
    res.render('success',{userName : "hello"})
})

start()
app.listen(8080)