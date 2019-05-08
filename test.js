const mongoCollections = require("./config/mongoCollections");
const playlists = mongoCollections.playlists;
//const { ObjectId } = require("mongodb");
var SpotifyWebApi = require("spotify-web-api-node");

var clientId = "aba7897fb89b4bf299913de0fda991e0",
  clientSecret = "9d58ecc5a16f4f8299cc6e0bbea197bf";

// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
  clientId: clientId,
  clientSecret: clientSecret
});

let playlistIds = [];

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

  //const newId = insertInfo.insertedId;

  //return await playlistCollection.find({}).toArray();
}

// Retrieve an access token.
spotifyApi.clientCredentialsGrant().then(
  async function(data) {
    console.log("The access token expires in " + data.body["expires_in"]);
    console.log("The access token is " + data.body["access_token"]);

    // Save the access token so that it's used in future calls
    spotifyApi.setAccessToken(data.body["access_token"]);
    spotifyApi.getUserPlaylists("123643422").then(
      async function(data) {
        const playlistCollection = await playlists();
        console.log("Retrieved playlists", data.body);
        data.body.items.forEach(element => {
          createPlaylist("Multiple", "Sunny", element.id);
        });
        console.log(`Playlist Id: ${data.body.items[0].id}`);
        console.log(await playlistCollection.find({}).toArray());
      },
      function(err) {
        console.log("Something went wrong!", err);
      }
    );
  },
  function(err) {
    console.log("Something went wrong when retrieving an access token", err);
  }
);
