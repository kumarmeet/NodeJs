const express = require("express");
const router = express.Router();

const users = require("../data/data");

router.post("/", (req, res) => {
  const user = req.body;
  user.id = Math.random().toString();
    users.usersSet(user);
  res.redirect("/");
});

router.get("/:id/:name", (req, res) => {
  const userId = req.params.id;
  const userName = req.params.name;

  const userFound = users.usersGet().find(
    (val) => val.id === userId && val.name === userName,
  );

  return userFound
    ? res.render("user", { userFound: userFound })
    : res.status(404).render("404");
});

module.exports = router;
