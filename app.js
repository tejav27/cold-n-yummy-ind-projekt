const bcrypt = require("bcryptjs");
const express = require("express");
const session = require("express-session");
require("dotenv").config();
const { User, Flavor } = require("./models/index");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
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
    res.render("failed", {message:"Looks like you have already voted. Cannot vote again.Check out our top-voted flavors", link: "/home", linkname:"Back to home"});
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
    res.render("failed", {message:"Registered Successfully! Please login to continue", link: "/login", linkname:"Login"});
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
  res.render("login",{regsuccess:false});
});

app.post("/login", async (req, res) => {
  try {
    const { usermail, password } = req.body;
    const user = await User.authenticate(usermail, password);
    req.session.user = {
      userName: user.userName,
      userEmail: user.email,
    };
    res.redirect("home")
  } catch (error) {
    req.session.errorMessage = error.message;
    res.render("failed", {message:"Invalid credentials. Try login again", link: "/login", linkname:"Login"});
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy();
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
  res.render("failed", {message:"Thank you for adding a new flavor!! Check out the top voted flavours", link: "/home", linkname:"Back to home"});
});

app.listen(8081);
