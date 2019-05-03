const express = require("express");
const router = express.Router();

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

router.post("/", async (req, res) => {
  // const zipcode = req.body.zipcode;
  /*
  *** Error Checking ***
  1. no input
  2. proper type input (ajax)
  */
  // try {
  //   const
  // }

  // user's object
  console.log(req.session.user);
});

module.exports = router;
