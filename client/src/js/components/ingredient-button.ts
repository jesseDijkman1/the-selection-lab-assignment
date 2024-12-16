import { eventListener } from "../lib/utils";
import state, { StateManager } from "../lib/StateManager";

window.customElements.define(
  "ingredient-button",
  class IngredientsButton extends HTMLElement {
    eventListeners: (() => void)[] | undefined;

    connectedCallback() {
      if (this.classList.contains("ingredient-button--static")) return;

      const button = this.querySelector("button")!;
      const thisIngredient = this.getAttribute("data-ingredient")!;

      const handleClick = () => {
        const currentState = state.getState();
        const ingredientIsAdded =
          currentState.ingredients.includes(thisIngredient);

        state.emit("ingredients:update", {
          ingredients: ingredientIsAdded
            ? currentState.ingredients.filter(
                (ingredient) => ingredient !== thisIngredient
              )
            : [...currentState.ingredients, thisIngredient],
        });
      };

      const handleIngredientUpdate = (state: StateManager.StateObject) => {
        if (state.ingredients.includes(thisIngredient)) {
          this.classList.add("ingredient-button--active");
        } else {
          this.classList.remove("ingredient-button--active");
        }
      };

      this.eventListeners = [
        state.on("ingredients:update", handleIngredientUpdate),
        eventListener("click", button, handleClick),
      ];
    }

    disconnectedCallback() {
      for (let removeListener of this.eventListeners ?? []) removeListener();
    }
  }
);
