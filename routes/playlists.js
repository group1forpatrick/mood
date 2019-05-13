const express = require("express");
const router = express.Router();
const playlistsData = require("../data/playlists");
const weatherData = require("../data/weather");
const userData = require("../data/users");

function LoggedIn(req, res, next) {
  if (!req.session.user) {
    return res.status(403).json("ERROR"); // TODO: change to redirect to login with error message
  } else {
    next();
  }
}

router.get("/", async (req, res) => {
  try {
    let weData = await weatherData.getWeather(req.session.user.zip);
    let weatherPlaylists = await playlistsData.getPlaylistsByWeather(
      weData.weather_tag
    );
    let lists = [];
    for (let element of weatherPlaylists)
      lists.push(await playlistsData.getPlaylists(element.spotifyId));
    res.render("private/playlists", {});
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

module.exports = router;
