const mongoose = require('mongoose');

const dishSchema = new mongoose.Schema({
  dishId: { type: String, unique: true },
  dishName: String,
  imageUrl: String,
  isPublished: Boolean
});

const Dish = mongoose.model('Dish', dishSchema);

module.exports = Dish;
