const express = require("express");
const router = express.Router();
const userData = require("../data/users");
const bcrypt = require("bcrypt");
const xss = require("xss");

/* Rendering Main Page with Login Form */
router.get("/", async (req, res) => {
  if (req.session.user) {
    res.render("private/private", {
      user: req.session.user
    });
  } else {
    res.render("public", { error: req.session.error });
  }
});

/* Login Request */
router.post("/login", async (req, res) => {
  try {
    let username = xss(req.body.username);
    let password = xss(req.body.password);

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
      req.session.error = { status: 400, message: e };
      res.status(400).redirect("/");
    }
    if (authenticated === true) {
      req.session.user = users[num];
      delete req.session.error;
      res.redirect("/private");
    } else {
      //when password is wrong
      req.session.error = {
        status: 401,
        message: "Incorrect Username/Password"
      };
      res.status(401).redirect("/");
    }
  } catch (e) {
    req.session.error = { status: 500, message: e };
    res.status(500).redirect("/");
  }
});

module.exports = router;
