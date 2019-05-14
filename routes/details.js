const express = require("express");
const router = express.Router();
const xss = require("xss");

router.get("/", async (req, res) => {
  const playlistIndex = req.query.chosenPlaylist;

  try {
    res.render("private/details", {});
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;
