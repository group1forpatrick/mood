const express = require("express");
const router = express.Router();
const xss = require("xss");

router.get("/", async (req, res) => {
  const chosenPlaylist = req.query.chosenPlaylist;
  console.log(chosenPlaylist);
  res.render("private/details", {});
});

module.exports = router;
