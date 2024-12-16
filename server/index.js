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

app.get("/ingredients/search", async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim().length === 0) {
    return res.status(200).json({ data: [], error: null }); // Not sure about the status code
  }

  try {
    const json = await SpoonacularAPI.get("/food/ingredients/autocomplete", {
      query: q,
    });

    return res.status(200).json({ data: json, error: null });
  } catch (err) {
    return res.status(500).json({ data: null, error: err });
  }
});

app.get("/recipes/search", async (req, res) => {
  const { ingredients } = req.query;

  // TODO: Fix status code
  if (!ingredients || ingredients.trim().length === 0) {
    return res.status(200).json({ data: [], error: null }); // Not sure about the status code
  }

  try {
    const json = await SpoonacularAPI.get("/recipes/findByIngredients", {
      ingredients,
    });

    // Reduce and transform some of the data
    const data = json.map((recipe) => {
      const usedIngredients = recipe.usedIngredients.map((ingredient) => ({
        ...ingredient,
        missing: false,
      }));

      const missingIngredients = recipe.missedIngredients.map((ingredient) => ({
        ...ingredient,
        missing: true,
      }));

      return {
        ...recipe,
        ingredients: [...usedIngredients, ...missingIngredients],
      };
    });

    return res.status(200).json({ data, error: null });
  } catch (err) {
    return res.status(500).json({ data: null, error: err });
  }
});

app.get("/recipes/details", async (req, res) => {
  const { id } = req.query;

  if (!id) {
    return res
      .status(500)
      .json({ data: null, error: "Request is missing 'id' parameter" }); // Not sure about the status code
  }

  try {
    const json = await SpoonacularAPI.get(`/recipes/${id}/information`);
    return res.status(200).json({ data: json, error: null });
  } catch (err) {
    return res.status(500).json({ data: null, error: err });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
