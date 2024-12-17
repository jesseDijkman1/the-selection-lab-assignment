import {
  eventListener,
  hide,
  show,
  replaceContent,
  useTemplate,
  onFocusLost,
  repaint,
} from "../lib/utils";
import IngredientAPI, { IngredientsAPITypes } from "../lib/IngredientsAPI";
import BEM from "../lib/BEM";
import state from "../lib/StateManager";

const [COMPONENT_NAME, BEM_OPEN, BEM_NO_RESULTS] = new BEM(
  "ingredients-selector"
).RAW.OPEN.NO_RESULTS;

window.customElements.define(
  COMPONENT_NAME,
  class IngredientsSelector extends HTMLElement {
    eventListeners: (() => void)[] | undefined;

    connectedCallback() {
      const input = this.querySelector("input")!;
      const autocompleteList = this.querySelector("ul")!;
      const autocompleteContainer = autocompleteList.parentElement!;
      const template = this.querySelector("template")!;

      const createIngredientButton = useTemplate<HTMLLIElement>(template);

      // Component state
      let selectorItems: IngredientsAPITypes.IngredientObject[] = [];
      let dropdownIsOpen = false;

      const openDropdown = () => {
        if (dropdownIsOpen) return;
        dropdownIsOpen = true;
        show(autocompleteContainer);
        repaint(autocompleteContainer);
        autocompleteContainer.classList.add(BEM_OPEN);
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

        autocompleteContainer.classList.remove(BEM_OPEN);
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
              : await IngredientAPI.fetch("search", { q: inputValue });

          this.classList.toggle(BEM_NO_RESULTS, selectorItems.length === 0);

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
            state.emit("ingredients-form:focus", { formFocussedByUser: true });
            if (input.value.length > 0) openDropdown();
          },
          true
        ),
        onFocusLost(this, () => closeDropdown()),
      ];
    }

    disconnectedCallback() {
      for (let removeListener of this.eventListeners ?? []) removeListener();
    }
  }
);
