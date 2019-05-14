const express = require("express");
const router = express.Router();
const users = require("../data/users");
const bcrypt = require("bcrypt");
const xss = require("xss");

router.get("/", async (req, res) => {
  try {
    res.render("signup", {});
  } catch (e) {
    req.session.error = { status: 500, message: e };
    res.status(500).redirect("/");
  }
});

router.get("/added", async (req, res) => {
  const username = xss(req.query.username);
  const email = xss(req.query.email);
  const firstname = xss(req.query.firstname);
  const lastname = xss(req.query.lastname);
  const password = xss(req.query.pass1);
  const confirmPassword = xss(req.query.pass2);

  // check if password and confirm password match
  // if (
  //   !username ||
  //   !email ||
  //   !firstname ||
  //   !lastname ||
  //   !password ||
  //   confirmPassword
  // ) {
  //   res.render("signup", { error: "You need to fill out all fields" });
  // } else
  if (password !== confirmPassword) {
    res.render("signup", { error: "Confirm your password again!" });
  } else {
    if (await users.isExist(username)) {
      res.render("signup", { error: "This username already exists" });
    } else {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);

        await users.addUser(
          username,
          email,
          firstname,
          lastname,
          hashedPassword
        );
      } catch (e) {
        req.session.error = { status: 400, message: e };
        res.status(400).render("signup", { error: req.session.error });
        console.log(e);
      }
      res.redirect("/public");
    }
  }
});

module.exports = router;
