const express = require("express");
const router = express.Router();
const xss = require("xss");
const playlistData = require("../data/playlists");
const commentData = require("../data/comments");

function LoggedIn(req, res, next) {
  if (!req.session.user) {
    req.session.error = { status: 403, message: "Must be logged in." };
    res.status(403).redirect("/");
  } else {
    next();
  }
}

router.get("/", LoggedIn, async (req, res) => {
  const chosenPlaylist = xss(req.query.chosenPlaylist);
  const playlist = await playlistData.getPlaylists(chosenPlaylist);
  const comments = await commentData.getCommentsByPlaylist(chosenPlaylist);
  console.log(playlist);
  console.log(comments);

  try {
    res.render("private/details", { playlist: playlist });
  } catch (e) {
    req.session.error = { status: 500, message: e };
    res.status(500).redirect("/");
  }
});

router.post("/", LoggedIn, async (req, res) => {
  try {
    let p_id = xss(req.body.playlist_id);
    let comment = xss(req.body.comment);
    await commentData.createComment(req.session.user._id, p_id, comment);
  } catch (e) {
    req.session.error = { status: 500, message: e };
    res.status(500).redirect("/");
  }
});

module.exports = router;
