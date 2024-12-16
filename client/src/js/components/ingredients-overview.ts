import { eventListener, useTemplate } from "../lib/utils";
import state, { StateManager } from "../lib/StateManager";
import BEM from "../lib/BEM";

const [COMPONENT_NAME, BEM_EMPTY] = new BEM("ingredients-overview").RAW.EMPTY;

window.customElements.define(
  COMPONENT_NAME,
  class IngredientsOverview extends HTMLElement {
    eventListeners: (() => void)[] | undefined;

    connectedCallback() {
      const list = this.querySelector("ul")!;
      const template = this.querySelector("template")!;

      const createListItem = useTemplate(template);

      // Parameters are not typed
      const handleIngredientsUpdate = (state: StateManager.StateObject) => {
        this.classList.toggle(BEM_EMPTY, state.ingredients.length === 0);

        const listItems = state.ingredients.map((ingredient: string) =>
          createListItem({ ingredient, "data-ingredient": ingredient })
        );

        list.innerHTML = "";
        list.append(...listItems);
      };

      const handleClick = (e: Event) => {
        if (e.target) {
          const button = (e.target as HTMLElement).closest("button");

          // Removes ingredient from state
          if (button) {
            const ingredientToRemove = button.dataset.ingredient!;
            const currentState = state.getState();

            state.emit("ingredients:update", {
              ingredients: currentState.ingredients.filter(
                (ingredient: string) => ingredient !== ingredientToRemove
              ),
            });
          }
        }
      };

      this.eventListeners = [
        state.on("ingredients:update", handleIngredientsUpdate),
        eventListener("click", this, handleClick),
      ];
    }

    disconnectedCallback() {
      for (let removeListener of this.eventListeners ?? []) removeListener();
    }
  }
);
