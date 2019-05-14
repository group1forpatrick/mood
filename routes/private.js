const express = require("express");
const router = express.Router();
const userData = require("../data/users");
const xss = require("xss");

function LoggedIn(req, res, next) {
  if (!req.session.user) {
    req.session.error = { status: 403, message: "Must be logged in." };
    res.status(403).redirect("/"); // TODO: change to redirect to login with error message
  } else {
    next();
  }
}

router.get("/", LoggedIn, async (req, res) => {
  try {
    res.render("private/private", { user: req.session.user });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.put("/", LoggedIn, async (req, res) => {
  const userId = req.session.user._id;
  const zipcodeInput = xss(req.body.zipcode);
  /*
  *** Error Checking ***
  1. no input
  2. proper type input (ajax)
  */

  try {
    if (req.session.user.zip !== zipcodeInput)
      req.session.user = await userData.addZipcode(userId, zipcodeInput);
    res.redirect("/playlists");
  } catch (e) {
    res.status(400).json("zipcode update fail");
  }
});

module.exports = router;
