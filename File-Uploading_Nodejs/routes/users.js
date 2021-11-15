const express = require('express');

const multer = require('multer');

const db = require("../data/database")

//configuration for how data should be stored where and what is the file extension name
const storageConfig = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storageConfig });

const router = express.Router();

router.get('/', async function (req, res) {
  const users = await db.getDb().collection('users').find().toArray();
  res.render("profiles", {users: users});
});

router.get('/new-user', function(req, res) {
  res.render('new-user');
});

router.post("/profiles", upload.single("image"), async function (req, res, next) {
  const uploadedImage = req.file;
  const userData = req.body;
  const file = await db.getDb().collection("users").insertOne({
    name: userData.username,
    imagePath: uploadedImage.path,
  });

  res.redirect('/')
});

module.exports = router;