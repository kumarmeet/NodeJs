const path = require("path");
const express = require("express");

const defaultRoutes = require("./routes/defaultRoutes")
const userRoutes = require("./routes/userRoutes")

const app = express(path.join(__dirname, "views"));

app.set("views"); 
app.set("view engine", "ejs");

app.use(express.static("public")); 

app.use(express.urlencoded({ extended: false })); 

app.use("/", defaultRoutes);
app.use("/", userRoutes);

app.use((req, res) => {
  res.status(404).render("404"); 
});

app.use((error, req, res, next) => {
  res.status(500).render("500"); 
});

const port = 3000;

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
