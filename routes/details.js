const express = require("express");
const router = express.Router();
const xss = require("xss");
const playlistData = require("../data/playlists");

router.get("/", async (req, res) => {
  const chosenPlaylist = xss(req.query.chosenPlaylist);
  const playlist = await playlistData.getPlaylists(chosenPlaylist);
  console.log(playlist);

  try {
    res.render("private/details", { playlist: playlist });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;
