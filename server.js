//https://scotch.io/tutorials/build-a-restful-api-using-node-and-express-4

require('dotenv').config()
console.log(process.env.MONGODB_URI)

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
console.log(process.env.MONGODB_URI)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const port = process.env.PORT || 8080;

const router = express.Router();

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useMongoClient: true });

app.options("*", cors());

router.use((req, res, next) => {
  next();
});

router.get("/", (req, res) => {
  res.json({ message: "whoop whoop!" });
});

const Ingredient = require("./app/models/ingredient");

router
  .route("/ingredients")
  .post((req, res) => {
    const newIngredient = new Ingredient();
    newIngredient.name = req.body.name;
    newIngredient.quantity = req.body.quantity;
    newIngredient.measurement = req.body.measurement;
    newIngredient.imgUrl = req.body.imgUrl;
    newIngredient.save((err, ingredient) => {
      if (err) {
        res.send(err);
      }
      res.json({ _id: ingredient.id });
    });
  })
  .get((req, res) => {
    Ingredient.find((err, ingredients) => {
      if (err) {
        res.send(err);
      }
      res.json(ingredients);
    });
  });

router
  .route("/ingredients/:ingredient_id")
  .get((req, res) => {
    Ingredient.findById(req.params.ingredient_id, (err, ingredient) => {
      if (err) {
        res.send(err);
      }
      res.json(ingredient);
    });
  })
  .put((req, res) => {
    Ingredient.findById(req.params.ingredient_id, (err, ingredient) => {
      if (err) {
        res.send(err);
      }

      (ingredient.name = req.body.name),
        ingredient.name ? req.body.name : ingredient.name;
      (ingredient.quantity = req.body.quantity),
        ingredient.quantity ? req.body.quantity : ingredient.quantity;
      (ingredient.measurement = req.body.measurement),
        ingredient.measurement ? req.body.measurement : ingredient.measurement;

      ingredient.save(err => {
        if (err) {
          res.send(err);
        }

        res.json({ message: "Ingredient updated" });
      });
    });
  })
  .delete((req, res) => {
    Ingredient.remove({ _id: req.params.ingredient_id }, (err, ingredient) => {
      if (err) {
        res.send(err);
      }
      res.json({ message: "Ingredient deleted" });
    });
  });

app.use("/api", router);

app.listen(port);

console.log(`Magic happening on port ${port}`);
