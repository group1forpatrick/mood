const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.render("userAuth/signup", {});
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;

/* This is very BASIC setting */
