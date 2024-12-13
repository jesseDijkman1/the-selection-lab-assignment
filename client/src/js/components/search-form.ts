import { eventListener, hide, show } from "../lib/utils";

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

    connectedCallback() {
      const input = this.querySelector("input")!;
      const submit = this.querySelector("button")!;
      const autocompleteList = this.querySelector("ul")!;
      const autocompleteContainer = autocompleteList.parentElement!;

      const handleInput = async (e: Event) => {
        const value = (e.target as HTMLInputElement).value.trim();

        if (value.length === 0) {
          hide(autocompleteContainer);
          autocompleteList.innerHTML = "";
          return;
        }

        try {
          const autocompleteItems = await this.autocomplete(value);
          const autocompleteListItems = autocompleteItems.map((item) => {
            const li = document.createElement("li");
            li.className = "search-form__autocomplete-list-item";
            li.textContent = item.title;
            return li;
          });

          show(autocompleteContainer);
          autocompleteList.innerHTML = "";
          autocompleteList.append(...autocompleteListItems);
        } catch (err) {
          console.error(err);
        }
      };

      const handleSubmit = () => {
        console.log("handle submit");
      };

      this.eventListeners = [
        eventListener("input", input, handleInput),
        eventListener("click", submit, handleSubmit),
      ];
    }

    disconnectedCallback() {
      if (!this.eventListeners || this.eventListeners.length === 0) return;

      this.eventListeners.forEach((removeListener) => removeListener());
    }
  }
);
