import { eventListener, hide, show, useTemplate } from "../lib/utils";
import state from "../lib/StateManager";
import Autocomplete from "../lib/Autocomplete";

window.customElements.define(
  "ingredients-overview",
  class IngredientsOverview extends HTMLElement {
    eventListeners: (() => void)[] | undefined;

    connectedCallback() {
      const list = this.querySelector("ul")!;
      const template = this.querySelector("template")!;

      const createListItem = useTemplate(template);

      // Parameters are not typed
      const handleIngredientsUpdate: Parameters<typeof state.on>[1] = (
        state
      ) => {
        if (state.ingredients.length > 0) {
          this.classList.remove("ingredients-overview--empty");
        } else {
          this.classList.add("ingredients-overview--empty");
        }

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
  }
);
