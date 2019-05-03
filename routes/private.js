const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.render("private/private", {});
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post("/", async (req, res) => {
  // const zipcode = req.body.zipcode;
  /*
  *** Error Checking ***
  1. no input
  2. proper type input (ajax)
  */
  // try {
  //   const
  // }
});

module.exports = router;
