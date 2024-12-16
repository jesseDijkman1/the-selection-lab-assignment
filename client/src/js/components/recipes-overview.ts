import { eventListener, replaceContent, show, useTemplate } from "../lib/utils";
import state, { StateManager } from "../lib/StateManager";

const recipeItemSkeleton = `
<div class="recipe-item-loader">
    <div class="recipe-item-loader__image"></div>
    <div class="recipe-item-loader__content">
      <div class="recipe-item-loader__title"></div>
      <div class="recipe-item-loader__ingredients">
        <div class="recipe-item-loader__ingredient"></div>
        <div class="recipe-item-loader__ingredient"></div>
        <div class="recipe-item-loader__ingredient"></div>
      </div>
    </div>
  </div>
`;

window.customElements.define(
  "recipes-overview",
  class RecipesOverview extends HTMLElement {
    eventListeners: (() => void)[] | undefined;

    connectedCallback() {
      const list = this.querySelector("ul")!;
      const [recipeTemplate, ingredientTemplate] =
        this.querySelectorAll("template")!;

      const createRecipeItem = useTemplate(recipeTemplate);
      const createIngredientItem = useTemplate(ingredientTemplate);

      const setLoadingState = () => {
        const div = document.createElement("div");
        div.innerHTML = recipeItemSkeleton;
        const loaders = Array(5)
          .fill("")
          .map(() => div.firstElementChild?.cloneNode(true) as HTMLElement);

        replaceContent(list, loaders);
      };

      const handleRecipesUpdate = (state: StateManager.StateObject) => {
        const recipeItems = state.recipes.map((recipe) => {
          const ingredientItems = recipe.ingredients.map((ingredient: any) =>
            createIngredientItem({
              ingredient: ingredient.name,
              "data-ingredient": ingredient.name,
              class: `ingredient-button ${
                ingredient.missing
                  ? ""
                  : "ingredient-button--static ingredient-button--active"
              }`,
            })
          );

          return createRecipeItem({
            src: recipe.image,
            alt: recipe.title,
            title: recipe.title,
            id: recipe.id,
            "data-modal-id": recipe.id,
            ingredients: ingredientItems,
          });
        });

        show(this);

        replaceContent(list, recipeItems);
      };

      this.eventListeners = [
        state.on("recipes:updating", setLoadingState),
        state.on("recipes:update", handleRecipesUpdate),
      ];
    }

    disconnectedCallback() {
      for (let removeListener of this.eventListeners ?? []) removeListener();
    }
  }
);
