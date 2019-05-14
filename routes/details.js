const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  res.render("private/details", {});
});

module.exports = router;
