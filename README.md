# Recipes app

## Installation guide
- Clone repository `git clone git@github.com:jesseDijkman1/the-selection-lab-assignment.git`
- Go into the project and install the packages on both the server and client `npm --prefix ./server install ; npm --prefix ./client install `
- Create the .env file (`touch .env`) in the root directory of of the project
- Add the API key to the .env file `echo 'API_KEY=<< API KEY HERE >>' > .env`
- Run the following command to run the project `node ./server && npm --prefix ./client run dev` (or you can open two terminals and run each command separately).

---

## Features
- Lots of custom utility functions 
- Search recipes using [Spoonacular](https://spoonacular.com/food-api) API.
- Simple threejs animation
- Fully accessible with keyboard (but missing some extra features like focus trap, aria attributes and custom keyboard controls)
