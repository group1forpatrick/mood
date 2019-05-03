const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
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
    zipcode: "",
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

const addZipcode = async id => {};

module.exports = {
  addUser,
  getAll,
  isExist,
  addZipcode
};
