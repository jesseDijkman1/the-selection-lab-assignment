import { eventListener, replaceContent, useTemplate } from "../lib/utils";
import state from "../lib/StateManager";

window.customElements.define(
  "recipes-overview",
  class RecipesOverview extends HTMLElement {
    eventListeners: (() => void)[] | undefined;

    connectedCallback() {
      const template = this.querySelector("template")!;
      const createRecipeItem = useTemplate(template);

      const handleRecipesUpdate: Parameters<typeof state.on>[1] = (state) => {
        const recipeItems = state.recipes.map((recipe) =>
          createRecipeItem({
            src: recipe.image,
            alt: recipe.title,
            title: recipe.title,
            id: recipe.id,
          })
        );

        replaceContent(this, recipeItems);
      };

      this.eventListeners = [state.on("recipes:update", handleRecipesUpdate)];
    }

    disconnectedCallback() {}
  }
);
