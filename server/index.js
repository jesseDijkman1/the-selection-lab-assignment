/**
 * - Proxy API (connects to the recipe API and returns transformed data)
 * - Stores saved recipes in a fake db
 */
require("dotenv").config();
const express = require("express");

const PORT = 3000;
const app = express();

app.get("/", async (req, res) => {
  const headers = new Headers();
  headers.append("x-api-key", process.env.API_KEY);
  headers.append("Content-Type", "application/json");

  try {
    const response = await fetch("https://api.spoonacular.com/recipes/random", {
      headers,
    });
    const json = await response.json();

    res.json(json);
  } catch (err) {
    res.send(err);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
