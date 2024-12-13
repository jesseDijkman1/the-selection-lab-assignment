import { eventListener, hide, show, useTemplate } from "../lib/utils";
import state from "../lib/StateManager";

type AutocompleteResult = {
  data: Array<{
    id: number;
    imageType: string;
    title: string;
  }>;
  error: string;
};

window.customElements.define(
  "search-form",
  class SearchForm extends HTMLElement {
    eventListeners: (() => void)[] | undefined;

    async autocomplete(query: string): Promise<AutocompleteResult["data"]> {
      const response = await fetch(
        `http://localhost:3000/search/autocomplete?q=${query}`
      );
      const { error, data }: AutocompleteResult = await response.json();

      if (error !== null) throw error;

      return data;
    }

    async search(query: string) {
      const response = await fetch(`http://localhost:3000/search?q=${query}`);
      const { error, data }: AutocompleteResult = await response.json();

      if (error !== null) throw error;

      return data;
    }

    connectedCallback() {
      const input = this.querySelector("input")!;
      const submit = this.querySelector("button")!;
      const autocompleteList = this.querySelector("ul")!;
      const autocompleteContainer = autocompleteList.parentElement!;

      const template = this.querySelector("template")!;
      const createAutocompleteListItem = useTemplate(template);

      // Component state
      let inputValue = "";

      const handleInput = async (e: Event) => {
        inputValue = (e.target as HTMLInputElement).value.trim();

        if (inputValue.length === 0) {
          hide(autocompleteContainer);
          autocompleteList.innerHTML = "";
          return;
        }

        try {
          const autocompleteItems = await this.autocomplete(inputValue);
          const autocompleteListItems = autocompleteItems.map((item) =>
            createAutocompleteListItem({ content: item.title })
          );
          show(autocompleteContainer);
          autocompleteList.innerHTML = "";
          autocompleteList.append(...autocompleteListItems);
        } catch (err) {
          console.error(err);
        }
      };

      const handleSubmit = async () => {
        if (inputValue === "") return; // Show some kind of state error state (with message)

        try {
          const data = await this.search(inputValue);

          state.emit("search:submit", null, data);
        } catch (err) {
          console.error(err);
        }
      };

      const handleAutocompleteClick = (e: Event) => {
        if (!e.target) return;

        const button = (e.target as HTMLElement).closest("button");

        if (button) {
          input.value = button?.textContent!;
          input.dispatchEvent(new Event("input"));
        }
      };

      this.eventListeners = [
        eventListener("input", input, handleInput),
        eventListener("click", submit, handleSubmit),
        eventListener("click", autocompleteList, handleAutocompleteClick),
      ];
    }

    disconnectedCallback() {
      if (!this.eventListeners || this.eventListeners.length === 0) return;

      this.eventListeners.forEach((removeListener) => removeListener());
    }
  }
);
