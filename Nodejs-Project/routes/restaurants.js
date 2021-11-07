const resData = require("../util/restaurant-data");

const express = require("express");
const uuid = require("uuid"); // third party package

const router = express.Router();

router.get("/confirm", (req, res) => {
  res.render("confirm");
});

router.get("/recommend", (req, res) => {
  res.render("recommend");
});

//post request
router.post("/recommend", (req, res) => {
  const formData = req.body; //extract all data from form
  formData.id = uuid.v4(); //third party package
  const restaurants = resData.getStoredRestaurants();
  restaurants.push(formData);
  resData.storeRestaurant(restaurants);
  res.redirect("/confirm");
});

router.get("/restaurants", (req, res) => {
  let order = req.query.order; //for query handling
  let nextOrder = "descending";
  const recommendFormData = resData.getStoredRestaurants();

  if (order !== "ascending" && order !== "descending") {
    order = "ascending";
  }

  if (order === "descending") {
    nextOrder = "ascending";
  }
  //sort by alphabetical order
  recommendFormData.sort((a, b) => {
    if (
      (order === "ascending" && a.name > b.name) ||
      (order === "descending" && a.name < b.name)
    ) {
      return 1;
    }
    return -1;
  });

  res.render("restaurants", {
    numberOfRestaurants: recommendFormData.length,
    restaurants: recommendFormData,
    nextOrder: nextOrder,
  });
});

//dynamic routes
router.get("/restaurants/:id", (req, res) => {
  const restaurantId = req.params.id;

  const recommendFormData = resData.getStoredRestaurants();

  for (const restaurant of recommendFormData) {
    if (restaurant.id === restaurantId) {
      res.render("restaurants-detail", { restaurant: restaurant });
      return;
    }
  }

  //404 page not found
  res.status(404).render("404"); //it shows browser network tab as well
});

module.exports = router;
