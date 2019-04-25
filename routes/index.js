const loginRoutes = require("./login");
const signupRoutes = require("./signup");

const constructorMethod = app => {
  app.use("/login", loginRoutes);
  app.use("/signup", signupRoutes);
  app.use("/", (req, res) => {
    res.render("mainBeforeLogin", {});
  });

  app.use("*", (req, res) => {
    res.redirect("/");
  });
};

module.exports = constructorMethod;
