const playlists = require("../config/mongoCollections").playlists;
var SpotifyWebApi = require("spotify-web-api-node");
const spotifyConfig = require("../tasks/spotify").spotifyConfig;
const MAX_SONGS = 15;

async function createPlaylist(name, weatherTag, spotifyId) {
  if (!name) {
    throw "error: argument genre does not exist";
  }
  if (!weatherTag) {
    throw "error: argument weatherTag does not exist";
  }
  if (!spotifyId) {
    throw "error: argument spotifyId does not exist";
  }

  if (typeof name !== "string") {
    throw "error: argument genre is not type string";
  }
  if (typeof weatherTag !== "string") {
    throw "error: argument weatherTag is not type string";
  }
  if (typeof spotifyId !== "string") {
    throw "error: argument spotifyId is not type string";
  }

  const playlistCollection = await playlists();

  let newPlaylist = {
    name: name,
    weatherTag: weatherTag,
    comments: [],
    spotifyId: spotifyId
  };

  const insertInfo = await playlistCollection.insertOne(newPlaylist);
  if (insertInfo.insertedCount === 0) throw "Could not add playlist";
  return;
}

async function getPlaylistsByWeather(weather_tag) {
  if (!weather_tag) throw "error: argument weather_tag does not exist";
  const playlistCollection = await playlists();
  const pls = await playlistCollection
    .find({ weatherTag: weather_tag })
    .toArray();
  return pls;
}

async function getPlaylists(playlist_id) {
  var spotifyApi = new SpotifyWebApi({
    clientId: spotifyConfig.clientId,
    clientSecret: spotifyConfig.clientSecret
  });

  const data = await spotifyApi.clientCredentialsGrant();
  spotifyApi.setAccessToken(data.body["access_token"]);

  let playlist = await spotifyApi.getPlaylist(playlist_id);

  let list = {
    playlist_id: playlist_id,
    name: playlist.body.name,
    weatherTag: playlist.body.description,
    playlistCover: playlist.body.images[0].url, //640x640 image
    tracks: []
  };

  let counter = 0;
  for (let songs of playlist.body.tracks.items) {
    if (counter === MAX_SONGS) break;
    list.tracks.push({
      name: songs.track.name,
      artist: songs.track.artists[0].name,
      album: songs.track.album.name,
      songCover: songs.track.album.images[0].url, //640x640 image
      duration: {
        minutes: Math.floor(songs.track.duration_ms / 60000),
        seconds: Math.floor((songs.track.duration_ms % 60000) / 1000)
      },
      spotifyId: songs.track.id
    });
    counter++;
  }

  return list;
}

module.exports = {
  createPlaylist,
  getPlaylistsByWeather,
  getPlaylists
};
