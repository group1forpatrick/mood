const users = require("../config/mongoCollections").users;
const playlists = require("../config/mongoCollections").playlists;
const comments = require("../config/mongoCollections").comments;
const { ObjectId } = require("mongodb");

async function createComment(user_id, playlist_id, comment) {
  if (!user_id) throw "parameter User_id must be provided";
  if (!playlist_id) throw "parameter Playlist_id must be provided";
  if (!comment) throw "parameter Comment must be provided";

  if (typeof user_id !== "string" && !(user_id instanceof ObjectId))
    throw "User_id must be string or ObjectId";
  if (typeof playlist_id !== "string" && !(playlist_id instanceof ObjectId))
    throw "Playlist_id must be string or ObjectId";
  if (typeof comment !== "string") throw "Comment must be a string";
  if (user_id.length === 0) throw "User_id is empty.";
  if (playlist_id.length === 0) throw "Playlist_id is empty.";
  if (comment.length === 0) throw "Comment is empty.";

  const userCollection = await users();
  const user = await userCollection.find({ user_id: ObjectId(user_id) });
  if (!user) throw "User not found";

  const playlistsCollection = await playlists();
  const playlist = await playlistsCollection.find({
    user_id: ObjectId(playlist_id)
  });
  if (!playlist) throw "Playlist not found";

  const commentsCollection = await comments();

  let newComment = {
    user_id,
    playlist_id,
    comment
  };

  const insertInfo = await commentsCollection.insertOne(newComment);
  if (insertInfo.insertedCount === 0) throw "Unable to insert comment";
}

async function getCommentsByUser(user_id) {
  if (!user_id) throw "User_id must be provided";
  if (typeof user_id !== "string" && !(user_id instanceof ObjectId))
    throw "User_id must be string or ObjectId";
  if (user_id.length === 0) throw "User_id is empty.";
  const commentsCollection = await comments();

  const commentArray = await commentsCollection
    .find({ user_id: ObjectId(user_id) })
    .toArray();

  return commentArray;
}

async function getCommentsByPlaylist(playlist_id) {
  if (!playlist_id) throw "Playlist_id must be provided";
  if (typeof playlist_id !== "string" && !(playlist_id instanceof ObjectId))
    throw "Playlist_id must be string or ObjectId";
  if (playlist_id.length === 0) throw "Playlist_id is empty.";

  const commentsCollection = await comments();

  const commentArray = await commentsCollection
    .find({ playlist_id: ObjectId(playlist_id) })
    .toArray();

  return commentArray;
}

async function deleteComment(comment_id) {
  if (!comment_id) throw "Comment_id must be provided";
  if (typeof comment_id !== "string" && !(comment_id instanceof ObjectId))
    throw "Comment_id must be string or ObjectId";
  if (comment_id.length === 0) throw "Comment_id is empty.";

  const commentsCollection = await comments();

  const deleteInfo = await commentsCollection.deleteOne({
    _id: ObjectId(comment_id)
  });

  if (deleteInfo.deletedCount === 0)
    throw `Could not delete comment with id of ${comment_id}`;
}

module.exports = {
  createComment,
  getCommentsByUser,
  getCommentsByPlaylist,
  deleteComment
};
