const express = require("express");
const router = express.Router();
const data = require("../data");
const userData = data.users;
const bcrypt = require("bcrypt");

/* Rendering Main Page with Login Form */
router.get("/", async (req, res) => {
  if (req.session.user) {
    res.redirect("/private");
  } else {
    res.render("public", {});
  }
  //   try {
  //     res.render("public", {});
  //   } catch (e) {
  //     res.status(500).json({ error: e });
  //   }
});

/* Login Request */
router.post("/", async (req, res) => {
  try {
    let username = req.body.username;
    let password = req.body.password;

    const users = userData.getAll();

    let authenticated = false;
    let num = 0;

    for (let i = 0; i < users.length; i++) {
      if (users[i].username === username) {
        num = i;
      }
    }
    try {
      authenticated = await bcrypt.compare(password, users[num].hashedPassword);
    } catch (e) {
      // failed to compare hassedpassword
      res.status(400).json({ error: e });
    }
    if (authenticated === true) {
      req.session.user = users[num];
      res.redirect("/private");
    } else {
      //when password is wrong
      res.status(401).render("error", {
        message: "Incorrect Username or password"
      });
    }
  } catch (e) {
    res.status(500).json("Failed");
  }
});

module.exports = router;
