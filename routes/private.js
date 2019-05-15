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
    res.render("private/private", {
      user: req.session.user,
      error: req.session.error
    });
  } catch (e) {
    res.render("private/private", { error: e });
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

  if (!zipcodeInput) {
    res.render("private/private", {
      error: "You need to give us a zipcode!",
      user: req.session.user
    });
  } else {
    try {
      if (req.session.user.zip !== zipcodeInput)
        req.session.user = await userData.addZipcode(userId, zipcodeInput);
      res.redirect("/playlists");
    } catch (e) {
      res.render("private/private", {
        error: "zipcode update fail"
      });
    }
  }
});

module.exports = router;
