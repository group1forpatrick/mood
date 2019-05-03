const express = require("express");
const router = express.Router();
const users = require("../data/users");
const bcrypt = require("bcrypt");

router.get("/", async (req, res) => {
  try {
    res.render("signup", {});
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/", async (req, res) => {
  const username = req.query.username;
  const email = req.query.email;
  const firstname = req.query.firstname;
  const lastname = req.query.lastname;
  const password = req.query.pass1;
  const confirmPassword = req.query.pass2;

  console.log(username);

  // check if password and confirm password match
  if (password !== confirmPassword) {
    // res.render("signup", { error: "Confirm your password again!" });
    console.log("password differ");
  } else {
    if (await users.isExist(username)) {
      // res.render("signup", { error: "This username already exists" });
      console.log("already exist");
    } else {
      try {
        // const hashedPassword = await bcrypt.hash(password, 10);

        await users.addUser(
          username,
          email,
          firstname,
          lastname,
          // hashedPassword
          password
        );
      } catch (e) {
        // res.render("signup", { error: e });
        console.log(e);
      }
      // res.redirect("/public");
    }
  }
});

// router.post("/", async (req, res) => {
//   const username = req.body.username;
//   const email = req.body.email;
//   const firstname = req.body.firstname;
//   const lastname = req.body.lastname;
//   const password = req.body.pass1;
//   const confirmPassword = req.body.pass2;
//   console.log("hi");

//   // check if password and confirm password match
//   if (password !== confirmPassword) {
//     // res.render("signup", { error: "Confirm your password again!" });
//     console.log("password differ");
//   } else {
//     if (await users.isExist(username)) {
//       // res.render("signup", { error: "This username already exists" });
//       console.log("already exist");
//     } else {
//       try {
//         const hashedPassword = await bcrypt.hash(password, saltRounds);
//         await users.addUser(
//           username,
//           email,
//           firstname,
//           lastname,
//           hashedPassword
//         );
//       } catch (e) {
//         // res.render("signup", { error: e });
//         console.log(e);
//       }
//       res.redirect("/public");
//     }
//   }
// });

module.exports = router;
