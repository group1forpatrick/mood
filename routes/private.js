const express = require("express");
const router = express.Router();
const userData = require("../data/users");
const xss = require("xss");

function LoggedIn(req, res, next) {
  if (!req.session.user) {
    req.session.error = { status: 403, message: "Must be logged in." };
    res.status(403).redirect("/");
  } else {
    next();
  }
}

router.get("/", LoggedIn, async (req, res) => {
  try {
    res.render("private/private", { user: req.session.user });
  } catch (e) {
    req.session.error = { status: 500, message: e };
    res.status(500).redirect("/");
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
    req.session.error = { status: 400, message: "zipcode update fail" };
    res.status(400).redirect("/");
  }
});

module.exports = router;
