class SpoonacularAPI {
  static getDefaultHeaders() {
    const headers = new Headers();
    headers.append("x-api-key", process.env.API_KEY);
    headers.append("Content-Type", "application/json");

    return headers;
  }

  static async get(endpoint) {
    const url = new URL(endpoint, "https://api.spoonacular.com/");
    const headers = SpoonacularAPI.getDefaultHeaders();

    const response = await fetch(url, { headers });
    const json = await response.json();

    return json;
  }
}

module.exports = SpoonacularAPI;
