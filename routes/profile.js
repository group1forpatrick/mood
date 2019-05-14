const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.render("private/profile", { user: req.session.user });
  } catch (e) {
    req.session.error = { status: 500, message: e };
    res.status(500).redirect("/");
  }
});

module.exports = router;
