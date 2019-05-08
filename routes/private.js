const express = require("express");
const router = express.Router();
const userData = require("../data/users");

function LoggedIn(req, res, next) {
  if (!req.session.user) {
    return res.status(403).json("ERROR NOT LOGGED IN");
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
  const zipcodeInput = req.body.zipcode;
  /*
  *** Error Checking ***
  1. no input
  2. proper type input (ajax)
  */

  try {
    req.session.user = await userData.addZipcode(userId, zipcodeInput);
    res.redirect("/playlists");
  } catch (e) {
    res.status(400).json("zipcode update fail");
  }
});

module.exports = router;
