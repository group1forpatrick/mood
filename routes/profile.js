const express = require("express");
const router = express.Router();
const users = require("../data/users");

router.get("/", async (req, res) => {
  try {
    const user = await users.getUser(req.session.user._id);
    res.render("private/profile", { user: user });
  } catch (e) {
    req.session.error = { status: 500, message: e };
    res.status(500).redirect("/");
  }
});

module.exports = router;
