const express = require("express");
const router = express.Router();
const users = require("../data/users");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  try {
    res.render("signup", {});
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.get("/added", async (req, res) => {
  const username = req.query.username;
  const email = req.query.email;
  const firstname = req.query.firstname;
  const lastname = req.query.lastname;
  const password = req.query.pass1;
  const confirmPassword = req.query.pass2;

  // check if password and confirm password match
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
        res.render("signup", { error: e });
        console.log(e);
      }
      res.redirect("/public");
    }
  }
});

module.exports = router;
