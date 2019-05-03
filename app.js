const express = require("express");
const app = express();
const static = express.static(__dirname + "/public");

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const configRoutes = require("./routes");
const exphbs = require("express-handlebars");

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/public", static);

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(
  session({
    name: "AuthCookie",
    secret: "group1forpatrick",
    resave: false,
    saveUninitialized: true
  })
);

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log("Your routes will be running on http://localhost:3000");
});
