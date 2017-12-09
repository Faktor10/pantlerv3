const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IngredientSchema = new Schema({
  name: String,
  quantity: Number,
  measurement: String,
  imgUrl: String
});

module.exports = mongoose.model("Ingredient", IngredientSchema);
