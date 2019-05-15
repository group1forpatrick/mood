const express = require("express");
const router = express.Router();
const users = require("../data/users");

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
    const user = await users.getUser(req.session.user._id);
    res.render("private/profile", { user: user });
  } catch (e) {
    req.session.error = { status: 500, message: e };
    res.status(500).redirect("/");
  }
});

module.exports = router;
