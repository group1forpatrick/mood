const SpotifyWebApi = require("spotify-web-api-node");
const bcrypt = require("bcrypt");
const defaultUserConfig = require("./defaultUser").defaultUser;
const spotifyConfig = require("./spotify").spotifyConfig;
const userData = require("../data/users");
const playlistData = require("../data/playlists");
const dbConnection = require("../config/mongoConnection");

// Create the api object with the credentials
const spotifyApi = new SpotifyWebApi({
  clientId: spotifyConfig.clientId,
  clientSecret: spotifyConfig.clientSecret
});

async function seeder() {
  try {
    const db = await dbConnection();
    await db.dropDatabase();

    let hashedPassword = await bcrypt.hash(defaultUserConfig.password, 10);

    let defaultUser = await userData.addUser(
      defaultUserConfig.username,
      defaultUserConfig.email,
      defaultUserConfig.firstName,
      defaultUserConfig.lastName,
      hashedPassword
    );
    if (!defaultUser) throw "Error seeding default user.";

    const data = await spotifyApi.clientCredentialsGrant();
    if (!data) throw "Error getting Spotify credentials.";
    spotifyApi.setAccessToken(data.body["access_token"]);

    const lists = await spotifyApi.getUserPlaylists("123643422");
    if (!lists) throw "Error getting playlists from Spotify.";

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
