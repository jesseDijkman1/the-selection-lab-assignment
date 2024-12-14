import { eventListener, replaceContent, useTemplate } from "../lib/utils";
import state from "../lib/StateManager";

window.customElements.define(
  "recipes-overview",
  class RecipesOverview extends HTMLElement {
    eventListeners: (() => void)[] | undefined;

    connectedCallback() {
      const [recipeTemplate, ingredientTemplate] =
        this.querySelectorAll("template")!;
      const createRecipeItem = useTemplate(recipeTemplate);
      const createIngredientItem = useTemplate(ingredientTemplate);

      const handleRecipesUpdate: Parameters<typeof state.on>[1] = (state) => {
        const recipeItems = state.recipes.map((recipe) => {
          const ingredientItems = recipe.ingredients.map((ingredient: any) =>
            createIngredientItem({
              content: ingredient.name,
              class: `recipe__ingredient ${
                ingredient.missing ? "recipe__ingredient--missing" : ""
              }`,
            })
          );

          return createRecipeItem({
            src: recipe.image,
            alt: recipe.title,
            title: recipe.title,
            id: recipe.id,
            ingredients: ingredientItems,
          });
        });

        replaceContent(this, recipeItems);
      };

      this.eventListeners = [state.on("recipes:update", handleRecipesUpdate)];
    }

    disconnectedCallback() {}
  }
);
