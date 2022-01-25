const express = require("express");

const router = express.Router();

const users = require("../data/data")

router.get("/", (req, res) => {
  let order = req.query.order;
  let nextOrder = "desc";

  if (nextOrder !== "desc" && nextOrder !== "asc") {
    order = "asc";
  }

  if (order === 'desc') {
    nextOrder = "asc"
  }

  users.usersGet().sort((a, b) =>
    order === 'asc' ?
      a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

  res.render("registration",
    { users: users.usersGet(), nextOrder: nextOrder });
});

module.exports = router;