var SpotifyWebApi = require("spotify-web-api-node");
const spotifyConfig = require("./spotify").spotifyConfig;
const mongoCollections = require("../config/mongoCollections");
const playlists = mongoCollections.playlists;

// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
  clientId: spotifyConfig.clientId,
  clientSecret: spotifyConfig.clientSecret
});

async function createPlaylist(genre, weatherTag, spotifyId) {
  if (!genre) {
    throw "error: argument genre does not exist";
  }
  if (!weatherTag) {
    throw "error: argument weatherTag does not exist";
  }
  if (!spotifyId) {
    throw "error: argument spotifyId does not exist";
  }

  if (typeof genre !== "string") {
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
    genre: genre,
    weatherTag: weatherTag,
    comments: [],
    spotifyId: spotifyId
  };

  const insertInfo = await playlistCollection.insertOne(newPlaylist);
  if (insertInfo.insertedCount === 0) throw "Could not add playlist";
  return;
}

async function seeder() {
  try {
    const data = await spotifyApi.clientCredentialsGrant();
    console.log("The access token expires in " + data.body["expires_in"]);
    console.log("The access token is " + data.body["access_token"]);
    spotifyApi.setAccessToken(data.body["access_token"]);
    const lists = await spotifyApi.getUserPlaylists("123643422");
    lists.body.items.forEach(async element => {
      const list = await spotifyApi.getPlaylist(element.id);
      await createPlaylist(list.body.description, element.name, element.id);
    });
    return;
  } catch (e) {
    console.log(`Error: ${e}`);
  }
}

async () => {
  try {
    await seeder();
  } catch (e) {
    console.log(`Error: ${e}`);
  }
};
