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

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", async (req, res) => {
  try {
    const json = await SpoonacularAPI.get("/recipes/complexSearch", {
      query: "tomato",
    });

    res.json(json);
  } catch (err) {
    console.error(err);
    res.send(err);
  }
});

app.get("/search/autocomplete", async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length === 0) {
    return res.status(200).json({ data: [], error: null }); // Not sure about the status code
  }

  try {
    const json = await SpoonacularAPI.get("/recipes/autocomplete", {
      query: q,
    });

    return res.status(200).json({ data: json, error: null });
  } catch (err) {
    return res.status(500).json({ data: null, error: err });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});