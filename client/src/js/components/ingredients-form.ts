import { eventListener } from "../lib/utils";
import state from "../lib/StateManager";

window.customElements.define(
  "ingredients-form",
  class IngredientsForm extends HTMLElement {
    eventListeners: (() => void)[] | undefined;

    connectedCallback() {
      const handleSubmit = async (e: Event) => {
        e.preventDefault();

        const { ingredients } = state.getState();

        if (ingredients.length === 0)
          alert("Please select ingredients to continue");

        try {
          const response = await fetch(
            `http://localhost:3000/recipes/search?ingredients=${ingredients}`
          );
          const { error, data }: { error: any; data: any } =
            await response.json();

          if (error !== null) throw new Error(error);

          state.emit("recipes:update", { recipes: data });
        } catch (err) {
          console.error(err);
        }
      };

      this.eventListeners = [eventListener("submit", this, handleSubmit)];
    }
  }
);
