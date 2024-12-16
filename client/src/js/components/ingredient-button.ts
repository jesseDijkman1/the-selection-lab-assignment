import { eventListener } from "../lib/utils";
import state, { StateManager } from "../lib/StateManager";
import BEM from "../lib/BEM";

const [COMPONENT_NAME, BEM_STATIC, BEM_ACTIVE] = new BEM("ingredient-button")
  .RAW.STATIC.ACTIVE;

window.customElements.define(
  COMPONENT_NAME,
  class IngredientsButton extends HTMLElement {
    eventListeners: (() => void)[] | undefined;

    connectedCallback() {
      if (this.classList.contains(BEM_STATIC)) return;

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
        this.classList.toggle(
          BEM_ACTIVE,
          state.ingredients.includes(thisIngredient)
        );
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
