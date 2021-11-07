const fs = require("fs"); //file system
const path = require("path");

const filePath = path.join(__dirname, "..", "data", "data.json");

const getStoredRestaurants = () => {
  const fileData = fs.readFileSync(filePath);
  const recommendFormData = JSON.parse(fileData);
  return recommendFormData;
};

const storeRestaurant = (restaurants) => {
  fs.writeFileSync(filePath, JSON.stringify(restaurants));
};

module.exports = {
  getStoredRestaurants: getStoredRestaurants,
  storeRestaurant: storeRestaurant,
};
