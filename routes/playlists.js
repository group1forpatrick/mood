const express = require("express");
const router = express.Router();
const playlistsData = require("../data/playlists");
const weatherData = require("../data/weather");
const userData = require("../data/users");

function LoggedIn(req, res, next) {
  if (!req.session.user) {
    return res.status(403).json("ERROR");
  } else {
    next();
  }
}

router.get("/", async (req, res) => {
  try {
    res.render("private/playlists", {});
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/", LoggedIn, async (req, res) => {
  const userInfo = req.session.user;
  console.log(userInfo);

  let newAnimal;
  if (
    typeof json == "object" &&
    json.hasOwnProperty("name") &&
    json.hasOwnProperty("animalType") &&
    size == 2
  ) {
    try {
      newAnimal = await animalsData.create(json.name, json.animalType);
    } catch (e) {
      console.log(e);
    }
    newAnimal.posts = [];
    return res.status(200).json(newAnimal);
  } else {
    return res.status(400).send("animal post failed");
  }
});

module.exports = router;
