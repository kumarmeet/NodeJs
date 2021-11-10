const express = require("express");

const db = require("../data/database");

const router = express.Router();

router.get("/", (req, res) => {
  res.redirect("/posts");
});

router.get("/posts", async (req, res) => {
  const [posts] = await db.query(
    `SELECT posts.*, authors.name AS author_name FROM posts 
    INNER JOIN authors ON posts.author_id = authors.id`
  );
  res.render("posts-list", { posts: posts });
});

router.get("/new-post", async (req, res) => {
  const [authors] = await db.query("SELECT * FROM authors");
  res.render("create-post", { authors: authors });
});

router.post("/posts", async (req, res) => {
  const data = [
    req.body.title,
    req.body.summary,
    req.body.content,
    req.body.author,
  ];
  // alternative
  // db.query(
  //   `INSERT INTO posts (title, summary, body, author_id) VALUES (?, ?, ?, ?)`,
  //   [data[0], data[1], data[2], data[3]]
  // );

  await db.query(
    `INSERT INTO posts (title, summary, body, author_id) VALUES (?)`,
    [data]
  );

  res.redirect("/posts");
});

router.get("/detail/:id", async (req, res) => {
  const id = req.params.id;

  const [posts] = await db.query(
    `SELECT posts.*, authors.name AS author_name FROM posts 
    INNER JOIN authors ON posts.author_id = authors.id`
  );

  for (const post of posts) {
    if (parseInt(id) === post.id) {
      res.render("post-detail", { post: post });
      return;
    }
  }

  res.status(404).render("404");
});

module.exports = router;
