/**
 * - Proxy API (connects to the recipe API and returns transformed data)
 * - Stores saved recipes in a fake db
 */
require("dotenv").config();
const express = require("express");

// Libs
const SpoonacularAPI = require("./lib/SpoonacularApi");

const PORT = 3000;
const app = express();

app.get("/", async (req, res) => {
  try {
    const json = await SpoonacularAPI.get("/recipes/random");

    res.json(json);
  } catch (err) {
    res.send(err);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
