const express = require("express");
const router = express.Router();

router.use(function(req, res, next) {
  res.clearCookie("AuthCookie");
  next();
});

router.get("/", async (req, res) => {
  res.redirect("/public");
});

module.exports = router;
