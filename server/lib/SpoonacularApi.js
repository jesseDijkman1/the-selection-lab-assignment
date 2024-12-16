class SpoonacularAPI {
  static getDefaultHeaders() {
    const headers = new Headers();
    headers.append("x-api-key", process.env.API_KEY);
    headers.append("Content-Type", "application/json");

    return headers;
  }

  static async get(endpoint, params = {}) {
    const url = new URL(endpoint, "https://api.spoonacular.com/");
    const headers = SpoonacularAPI.getDefaultHeaders();

    // Set url search params
    Object.entries(params).forEach((entry) => {
      url.searchParams.set(...entry);
    });

    try {
      const response = await fetch(url, { headers });
      const json = await response.json();

      return json;
    } catch (err) {
      throw err;
    }
  }
}

module.exports = SpoonacularAPI;
