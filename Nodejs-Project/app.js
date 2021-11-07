const defaultRoutes = require("./routes/default");
const restaurantRoutes = require("./routes/restaurants");

const path = require("path"); //for path
const express = require("express");

const app = express(path.join(__dirname, "views"));

app.set("views"); //for find where is template files
//set the view template engine, next arg is which template engine
app.set("view engine", "ejs");

//goto public folder executes css or js (static files)
app.use(express.static("public")); //middleware

//parse incoming data and translated js object
app.use(express.urlencoded({ extended: false })); //middleware

//middleware for handling default routes (<domain name>/)
/**
 * every request starts with '/' since every request is at least
 * targeting <your domain name>/something
 * (even if its just (<your domain name>/))
 */
app.use("/", defaultRoutes);
app.use("/", restaurantRoutes);

//for non existing routes middleware, client side error (404)
//if any other routes not handle the request then this middleware executes
app.use((req, res) => {
  res.status(404).render("404"); //it shows browser network tab as well
});

//for server side error middleware (500)
//if anywhere error occurs in express app then express will invoke this function
//passing all args is mandatory to express, then express invoke this explicitly
app.use((error, req, res, next) => {
  res.status(500).render("500"); //it shows browser network tab as well
});

const port = 3000;

app.listen(port, () => {
  console.log("Server is running on port 3000");
});
