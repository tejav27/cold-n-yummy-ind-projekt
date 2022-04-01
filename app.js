const express = require("express");
// const { Sequelize, DataTypes, Model } = require('sequelize')
// const sequelize = require("./database/connection");

const { User, Flavor } = require("./models/index");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
// app.use('/css',express.static(__dirname+'public/css'))

let registeredUser = "";

app.get("/", async (req, res) => {
  const flavorsOrder = await Flavor.findAll({
    order: [["numVotes", "DESC"]],
    attributes: ["flavorName","numVotes"],
    raw:true,
    limit:10

  })
  .then((flavors) => flavors.map(flavor => (
    {
        flavorName: flavor.flavorName,
        numVotes: flavor.numVotes
    } 
  )))
  res.render("home", { flavorList: flavorsOrder });
});


app.post("/voting", async (req, res) => {
  const { flavor, username, usermail } = req.body;
  //check if user alredy exists
  const dupUser = await User.findOne({ where: { email: usermail } });
  if (!dupUser) {
    const votedFlavor = await Flavor.findOne({ where: { flavorName: flavor } });
    console.log("votedFlavor", votedFlavor);
    votedFlavor.increment("numVotes", { by: 1 });
    await User.create({
      userName: username,
      email: usermail,
      FlavorFlavorId: votedFlavor.flavorId,
    });
    registeredUser = username;
    res.redirect("success");
  } else {
    res.render("failed");
  }
});

app.get("/success", (req, res) => {
  res.render("success", { registeredUser: registeredUser });
});

app.listen(8081);
