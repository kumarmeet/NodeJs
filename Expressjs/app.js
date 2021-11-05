const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: false })); //parse incoming data and tanslated js object

const port = 3000;

//route home
app.get("/", (req, res) => {
  res.send(`
  <form action = "/store-user" method = "POST">
    <label id = "username">Your Name</label>
    <input type = "text" name = "username" id = "username">
    <button type = "submit">Submit</button>
  </form>`);
}); //localhost:3000

app.post("/store-user", (req, res) => {
  const userName = req.body.username;
  res.send(`<h1>${userName}</h1>`);
}); //localhost:3000/store-user

//route current time
app.get("/current-time", (req, res) => {
  res.send(`<h1>${new Date().toISOString()}</h1>`);
}); //localhost:3000/current-time

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
