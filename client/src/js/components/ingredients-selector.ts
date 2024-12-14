import { eventListener, hide, show, useTemplate } from "../lib/utils";
import state from "../lib/StateManager";
import Autocomplete from "../lib/Autocomplete";

window.customElements.define(
  "ingredients-selector",
  class IngredientsSelector extends HTMLElement {
    eventListeners: (() => void)[] | undefined;

    connectedCallback() {
      const input = this.querySelector("input")!;
      const autocompleteList = this.querySelector("ul")!;
      const autocompleteContainer = autocompleteList.parentElement!;
      const template = this.querySelector("template")!;

      const createAutocompleteListItem = useTemplate(template);

      const ingredientsAutocomplete = new Autocomplete("ingredients", {});

      // Component state
      let selectorItems: Array<{
        name: string;
        image: string;
      }> = [];

      const updateSelector = () => {
        if (selectorItems.length === 0) {
          return hide(autocompleteContainer);
        }

        const autocompleteListItems = selectorItems.map((item) =>
          createAutocompleteListItem({ content: item.name })
        );
        show(autocompleteContainer);
        autocompleteList.innerHTML = "";
        autocompleteList.append(...autocompleteListItems);
      };

      const handleInput = async (e: Event) => {
        const inputValue = (e.target as HTMLInputElement).value.trim();

        try {
          selectorItems =
            inputValue.length === 0
              ? []
              : await ingredientsAutocomplete.query(inputValue);
          updateSelector();
        } catch (err) {
          console.error(err);
        }
      };

      const handleAutocompleteClick = (e: Event) => {
        if (!e.target) return;

        const button = (e.target as HTMLElement).closest("button");

        if (button) {
          const currentState = state.getState();
          state.emit("ingredients:update", {
            ingredients: [
              ...(currentState.ingredients ?? []),
              button.textContent,
            ],
          });
        }
      };

      const handleIngredientsUpdate: Parameters<typeof state.on>[1] = (
        state
      ) => {
        const selectedIngredients = state.ingredients;

        selectorItems = selectorItems.filter(
          ({ name }) => !selectedIngredients.includes(name)
        );
        updateSelector();
      };

      this.eventListeners = [
        state.on("ingredients:update", handleIngredientsUpdate),
        eventListener("input", input, handleInput),
        eventListener("click", autocompleteList, handleAutocompleteClick),
      ];
    }
  }
);
