const privateRoutes = require("./private");

const constructorMethod = app => {
  app.use("/private", privateRoutes);
  app.use("/", (req, res) => {
    res.render("public", {});
  });

  app.use("*", (req, res) => {
    res.redirect("/");
  });
};

module.exports = constructorMethod;
