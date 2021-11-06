const fs = require("fs"); //file system

const path = require("path"); //for path

const express = require("express");

const app = express(path.join(__dirname, "views"));

app.set("views"); //for find where is template files
//set the view template engine, next arg is which template engine
app.set("view engine", "ejs");

//goto public folderexecutes css or js (static files)
app.use(express.static("public")); //middleware

//parse incoming data and tanslated js object
app.use(express.urlencoded({ extended: false })); //middleware

//root route
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/confirm", (req, res) => {
  res.render("confirm");
});

app.get("/recommend", (req, res) => {
  res.render("recommend");
});

//post request
app.post("/recommend", (req, res) => {
  const formData = req.body; //extract all data from form

  const filePath = path.join(__dirname, "data", "data.json");
  const fileData = fs.readFileSync(filePath);
  const recommendFormData = JSON.parse(fileData);

  recommendFormData.push(formData);

  fs.writeFileSync(filePath, JSON.stringify(recommendFormData));

  res.redirect("/confirm");
});

app.get("/restaurants", (req, res) => {
  const filePath = path.join(__dirname, "data", "data.json");
  const fileData = fs.readFileSync(filePath);
  const recommendFormData = JSON.parse(fileData);

  res.render("restaurants", {
    numberOfRestaurants: recommendFormData.length,
    restaurants: recommendFormData,
  });
});

const port = 3000;

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
