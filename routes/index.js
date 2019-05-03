const privateRoutes = require("./private");
const signupRoutes = require("./signup");
const playlistRoutes = require("./playlists");
const profileRoutes = require("./profile");
const publicRoutes = require("./public");

const constructorMethod = app => {
  app.use("/private", privateRoutes);
  app.use("/playlists", playlistRoutes);
  app.use("/signup", signupRoutes);
  app.use("/profile", profileRoutes);
  app.use("/", publicRoutes);

  app.use("*", (req, res) => {
    res.redirect("/");
  });
};

module.exports = constructorMethod;
