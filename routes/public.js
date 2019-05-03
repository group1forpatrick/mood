const express = require("express");
const router = express.Router();
const userData = require("../data/users");
const bcrypt = require("bcrypt");

/* Rendering Main Page with Login Form */
router.get("/", async (req, res) => {
  if (req.session.user) {
    res.render("private/private", { user: req.session.user });
  } else {
    res.render("public", {});
    console.log("no?");
  }
});

/* Login Request */
router.post("/login", async (req, res) => {
  console.log("here");
  try {
    let username = req.body.username;
    let password = req.body.password;

    const users = await userData.getAll();

    let authenticated = false;
    let num = 0;

    for (let i = 0; i < users.length; i++) {
      if (users[i].username === username) {
        num = i;
      }
    }
    try {
      authenticated = await bcrypt.compare(password, users[num].password);
    } catch (e) {
      // failed to compare hassedpassword
      res.status(400).json({ error: e });
    }
    if (authenticated === true) {
      req.session.user = users[num];
      res.redirect("/private");
    } else {
      //when password is wrong
      res.status(401).json("Incorrect Password");
    }
  } catch (e) {
    res.status(500).json("Failed");
  }
});

module.exports = router;
