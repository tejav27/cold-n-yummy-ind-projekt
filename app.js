const bcrypt = require("bcryptjs");
const express = require("express");
const session = require("express-session");
require("dotenv").config();

// const { Sequelize, DataTypes, Model } = require('sequelize')
// const sequelize = require("./database/connection");

const { User, Flavor } = require("./models/index");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
// app.use('/css',express.static(__dirname+'public/css'))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/home", async (req, res) => {
  await loadHomePage(res, req);
});

app.post("/voting", async (req, res) => {
  const { flavor } = req.body;
  const username = req.session.user.userName;
  const usermail = req.session.user.userEmail;
  //check if user alredy exists
  const dupUser = await User.findOne({ where: { email: usermail } });
  if (!dupUser.FlavorFlavorId) {
    const votedFlavor = await Flavor.findOne({ where: { flavorId: flavor } });
    votedFlavor.increment("numVotes", { by: 1 });
    await User.update(
      { FlavorFlavorId: flavor },
      { where: { email: usermail } }
    );
    res.redirect("success");
  } else {
    res.render("failed", {message:"Looks like you have already voted. Cannot vote again", link: "/", linkname:"Back to home"});
  }
});



app.get("/", (req,res)=>{
    res.render("welcome")
})

app.get("/success", (req, res) => {
  res.render("success", { registeredUser: req.session.user.userName });
});

app.get("/register", (req, res) => {
  res.render("register");
});


app.post("/register", async (req, res) => {
  const { username, password, usermail } = req.body;
  const dupUser = await User.findOne({ where: { email: usermail } });
  if (!dupUser) {
    await User.create({
      userName: username,
      email: usermail,
      password: generateHash(password),
    });
    res.redirect("login"); // Attach a login message
  } else {
    res.render("failed", {message:"Looks like you have already registered. Login instead", link: "/login", linkname:"Back to Login"});
  }
});

async function getTopFlavors() {
  return await Flavor.findAll({
    order: [["numVotes", "DESC"]],
    attributes: ["flavorName", "numVotes"],
    raw: true,
    limit: 10,
  }).then((flavors) =>
    flavors.map((flavor) => ({
      flavorName: flavor.flavorName,
      numVotes: flavor.numVotes,
    }))
  );
}

async function getAllFlavors() {
  return await Flavor.findAll({
    attributes: ["flavorName", "flavorId"],
    raw: true,
  }).then((flavors) =>
    flavors.map((flavor) => ({
      flavorName: flavor.flavorName,
      flavorId: flavor.flavorId,
    }))
  );
}

function generateHash(password) {
  const hash = bcrypt.hashSync(password);
  return hash;
}

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const { usermail, password } = req.body;
    const user = await User.authenticate(usermail, password);
    req.session.user = {
      userName: user.userName,
      userEmail: user.email,
    };
    // await loadHomePage(res, req);
    res.redirect("home")
  } catch (error) {
    req.session.errorMessage = error.message;
    res.render("failed", {message:"Invalid credentials. Try login again", link: "/login", linkname:"Login"});
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy();
  //req.session = null
  res.redirect("/login");
});

async function loadHomePage(res, req) {
  res.render("home", {
    top10Flavors: await getTopFlavors(),
    user: req.session.user,
    allFlavors: await getAllFlavors(),
  });
}

app.post("/addflavor", async (req, res) => {
  const { flavorname } = req.body;
  await Flavor.create({
    flavorName: flavorname,
  });
  res.redirect("success");
});

app.listen(8081);
