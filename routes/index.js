const privateRoutes = require("./private");
const signupRoutes = require("./signup");
const playlistRoutes = require("./playlists");
const profileRoutes = require("./profile");
const publicRoutes = require("./public");
const logoutRoutes = require("./logout");
const detailRoutes = require("./details");

const constructorMethod = app => {
  app.use("/private", privateRoutes);
  app.use("/playlists", playlistRoutes);
  app.use("/signup", signupRoutes);
  app.use("/profile", profileRoutes);
  app.use("/logout", logoutRoutes);
  app.use("/details", detailRoutes);

  app.use("/", publicRoutes);

  app.use("*", (req, res) => {
    req.session.error = { status: 404, message: "Page not found." };
    res.status(404).redirect("/");
  });
};

module.exports = constructorMethod;
