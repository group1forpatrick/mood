const express = require("express");
const router = express.Router();
const xss = require("xss");
const playlistData = require("../data/playlists");
const commentData = require("../data/comments");
const userData = require("../data/users");
const users = require("../config/mongoCollections").users;
const { ObjectId } = require("mongodb");

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
    const chosenPlaylist = xss(req.query.chosenPlaylist);
    const playlist = await playlistData.getPlaylists(chosenPlaylist);
    const comments = await commentData.getCommentsByPlaylist(chosenPlaylist);
    res.render("private/details", { playlist: playlist, comments: comments });
  } catch (e) {
    let p_id = xss(req.query.chosenPlaylist);
    req.session.error = { status: 500, message: e };
    res.status(500).redirect(`/details?chosenPlaylist=${p_id}`);
  }
});

router.post("/", LoggedIn, async (req, res) => {
  try {
    let p_id = xss(req.body.playlist_id);
    let comment = xss(req.body.comment);
    await commentData.createComment(req.session.user._id, p_id, comment);
    res.redirect(`/details?chosenPlaylist=${p_id}`);
  } catch (e) {
    let p_id = xss(req.body.playlist_id);
    req.session.error = { status: 500, message: e };
    res.status(500).redirect(`/details?chosenPlaylist=${p_id}`);
  }
});

router.post("/like", LoggedIn, async (req, res) => {
  try {
    let p_id = xss(req.body.playlist_id);
    await userData.likePlaylist(req.session.user._id, p_id);
    const userCollection = await users();
    req.session.user = await userCollection.findOne({
      _id: ObjectId(req.session.user._id)
    });
    res.redirect(`/details?chosenPlaylist=${p_id}`);
  } catch (e) {
    let p_id = xss(req.body.playlist_id);
    req.session.error = { status: 500, message: e };
    res.status(500).redirect(`/details?chosenPlaylist=${p_id}`);
  }
});

router.post("/unlike", LoggedIn, async (req, res) => {
  try {
    let p_id = xss(req.body.playlist_id);
    await userData.unlikePlaylist(req.session.user._id, p_id);
    const userCollection = await users();
    req.session.user = await userCollection.findOne({
      _id: ObjectId(req.session.user._id)
    });
    res.redirect(`/details?chosenPlaylist=${p_id}`);
  } catch (e) {
    let p_id = xss(req.body.playlist_id);
    req.session.error = { status: 500, message: e };
    res.status(500).redirect(`/details?chosenPlaylist=${p_id}`);
  }
});

module.exports = router;
