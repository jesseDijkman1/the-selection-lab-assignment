import { eventListener } from "../lib/utils";
import state from "../lib/StateManager";
import RecipesAPI from "../lib/RecipesAPI";

window.customElements.define(
  "ingredients-form",
  class IngredientsForm extends HTMLElement {
    eventListeners: (() => void)[] | undefined;

    connectedCallback() {
      const submitButton = this.querySelector<HTMLButtonElement>(
        'button[type="submit"]'
      )!;

      const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();

        const { ingredients } = state.getState();

        if (ingredients.length === 0)
          alert("Please select ingredients to continue");

        try {
          state.emit("recipes:updating");

          const recipes = await RecipesAPI.fetch("search", {
            ingredients: ingredients.join(","),
          });

          state.emit("recipes:update", { recipes: recipes });
        } catch (err) {
          console.error(err);
        }
      };

      this.eventListeners = [
        state.on("ingredients:update", (state) => {
          submitButton.disabled = state.ingredients.length === 0;
        }),
        eventListener("submit", this, handleSubmit),
      ];
    }

    disconnectedCallback() {
      for (let removeListener of this.eventListeners ?? []) removeListener();
    }
  }
);
