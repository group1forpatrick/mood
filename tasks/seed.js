var SpotifyWebApi = require("spotify-web-api-node");
const spotifyConfig = require("./spotify").spotifyConfig;
const playlistData = require("../data/playlists");
const dbConnection = require("../config/mongoConnection");

// Create the api object with the credentials
var spotifyApi = new SpotifyWebApi({
  clientId: spotifyConfig.clientId,
  clientSecret: spotifyConfig.clientSecret
});

async function seeder() {
  try {
    const db = await dbConnection();
    await db.collection("playlists").drop();
    const data = await spotifyApi.clientCredentialsGrant();
    spotifyApi.setAccessToken(data.body["access_token"]);
    const lists = await spotifyApi.getUserPlaylists("123643422");
    for (const element in lists.body.items) {
      const list = await spotifyApi.getPlaylist(lists.body.items[element].id);
      await playlistData.createPlaylist(
        list.body.name,
        list.body.description,
        list.body.id
      );
    }
    await db.serverConfig.close();
  } catch (e) {
    console.log(`Error: ${e}`);
  }
}

seeder().catch(console.log);
