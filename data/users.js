const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const playlists = mongoCollections.playlists;
const { ObjectId } = require("mongodb");

// Adding signed up user to database
const addUser = async (
  username,
  email,
  firstname,
  lastname,
  hashedPassword
) => {
  if (!username | !email | !firstname | !lastname | !hashedPassword)
    throw "All input fields required";
  if (
    (username.constructor !== String) |
    (email.constructor !== String) |
    (firstname.constructor !== String) |
    (lastname.constructor !== String) |
    (hashedPassword.constructor !== String)
  )
    throw "Argument type error";

  const userCollection = await users();

  let newUser = {
    username: username,
    email: email,
    firstname: firstname,
    lastname: lastname,
    password: hashedPassword,
    zip: "",
    likedPlaylists: [],
    unlikedPlaylists: []
  };
  const insertInfo = await userCollection.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw "Could not add a user";
  return await userCollection.findOne({
    _id: ObjectId(insertInfo.insertedId)
  });
};

const getAll = async () => {
  const userCollection = await users();
  const allUsers = await userCollection.find({}).toArray();
  return allUsers;
};

const isExist = async username => {
  const userCollection = await users();
  const user = await userCollection.findOne({ username: username });
  if (!user) return false;
  return true;
};

async function addZipcode(id, newZipCode) {
  const userCollection = await users();
  const updatedInfo = await userCollection.updateOne(
    { _id: ObjectId(id) },
    { $set: { zip: newZipCode } }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "could not update successfully";
  }
  return await userCollection.findOne({
    _id: ObjectId(id)
  });
}

async function likePlaylist(user_id, playlistId) {
  if (!user_id) throw "Parameter user_id is undefined.";
  if (typeof user_id !== "string" && !(user_id instanceof ObjectId))
    throw "Parameter user_id is not a string or ObjectId";
  if (!playlistId) throw "Parameter playlistId is undefined.";
  if (typeof playlistId !== "string" && !(playlistId instanceof ObjectId))
    throw "Parameter playlistId is not a string or ObjectId";

  const userCollection = await users();

  const updateLikeInfo = await userCollection.updateOne(
    { _id: ObjectId(user_id) },
    { $addToSet: { likedPlaylists: playlistId } }
  );

  if (updateLikeInfo.modifiedCount === 0)
    throw "could not like playlist successfully";

  await userCollection.updateOne(
    { _id: ObjectId(user_id) },
    { $pull: { unlikedPlaylists: playlistId } }
  );
}

async function unlikePlaylist(user_id, playlistId) {
  if (!user_id) throw "Parameter user_id is undefined.";
  if (typeof user_id !== "string" && !(user_id instanceof ObjectId))
    throw "Parameter user_id is not a string or ObjectId";
  if (!playlistId) throw "Parameter playlistId is undefined.";
  if (typeof playlistId !== "string" && !(playlistId instanceof ObjectId))
    throw "Parameter playlistId is not a string or ObjectId";

  const userCollection = await users();

  const updateUnlikeInfo = await userCollection.updateOne(
    { _id: ObjectId(user_id) },
    { $addToSet: { unlikedPlaylists: playlistId } }
  );

  if (updateUnlikeInfo.modifiedCount === 0)
    throw "could not unlike playlist successfully";

  await userCollection.updateOne(
    { _id: ObjectId(user_id) },
    { $pull: { likedPlaylists: playlistId } }
  );
}

async function getUser(user_id) {
  if (!user_id) throw "Parameter user_id is undefined.";
  if (typeof user_id !== "string" && !(user_id instanceof ObjectId))
    throw "Parameter user_id is not a string or ObjectId";

  const userCollection = await users();
  const user = await userCollection.findOne({ _id: ObjectId(user_id) });

  if (!user) throw "User not found";

  delete user.hashedPassword;

  const playlistCollection = await playlists();

  user.likedPlaylists = await playlistCollection
    .find({ spotifyId: { $in: user.likedPlaylists } })
    .project({ _id: 0, name: 1 })
    .toArray();
  user.unlikedPlaylists = await playlistCollection
    .find({ spotifyId: { $in: user.unlikedPlaylists } })
    .project({ _id: 0, name: 1 })
    .toArray();

  return user;
}

module.exports = {
  addUser,
  getAll,
  isExist,
  addZipcode,
  likePlaylist,
  unlikePlaylist,
  getUser
};
