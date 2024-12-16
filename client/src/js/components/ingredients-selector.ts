import {
  eventListener,
  hide,
  show,
  replaceContent,
  useTemplate,
  onFocusLost,
  repaint,
} from "../lib/utils";
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

      const createIngredientButton = useTemplate<HTMLLIElement>(template);

      const ingredientsAutocomplete = new Autocomplete("ingredients", {});

      // Component state
      let selectorItems: Array<{
        name: string;
        image: string;
      }> = [];
      let dropdownIsOpen = false;

      const openDropdown = () => {
        if (dropdownIsOpen) return;
        dropdownIsOpen = true;
        show(autocompleteContainer);
        repaint(autocompleteContainer);
        autocompleteContainer.classList.add(
          "ingredients-selector__dropdown--open"
        );
      };

      const closeDropdown = () => {
        if (!dropdownIsOpen) return;
        dropdownIsOpen = false;

        this.addEventListener(
          "transitionend",
          () => {
            hide(autocompleteContainer);
          },
          {
            once: true,
          }
        );

        autocompleteContainer.classList.remove(
          "ingredients-selector__dropdown--open"
        );
      };

      const updateSelector = () => {
        const autocompleteListItems = selectorItems.map((item) =>
          createIngredientButton({
            ingredient: item.name,
            "data-ingredient": item.name,
          })
        );
        replaceContent(autocompleteList, autocompleteListItems);
      };

      const handleInput = async (e: Event) => {
        const inputValue = (e.target as HTMLInputElement).value.trim();

        if (inputValue === "") {
          closeDropdown();
          return;
        }

        try {
          selectorItems =
            inputValue.length === 0
              ? []
              : await ingredientsAutocomplete.query(inputValue);

          if (selectorItems.length === 0) {
            this.classList.add("ingredients-selector--no-results");
          } else {
            this.classList.remove("ingredients-selector--no-results");
          }
          updateSelector();
          openDropdown();
        } catch (err) {
          console.error(err);
        }
      };

      this.eventListeners = [
        eventListener("input", input, handleInput),
        eventListener(
          "focus",
          this,
          () => {
            if (input.value.length > 0) openDropdown();
          },
          true
        ),
        onFocusLost(this, () => closeDropdown()),
      ];
    }

    disconnectedCallback() {
      if (this.eventListeners) {
        for (let removeListener of this.eventListeners) removeListener();
      }
    }
  }
);
