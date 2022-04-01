const express = require('express')

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
        await User.create({
            userName:username,
            email:usermail,
            FlavorFlavorId:flavor
        })
        res.redirect('/voted')
    }else{
        res.render('failed')
    }
})
app.get('/voted',(req,res)=>{
    console.log(req.body)
    res.render('voted',{userName : "hello"})
})

start()
app.listen(8080)