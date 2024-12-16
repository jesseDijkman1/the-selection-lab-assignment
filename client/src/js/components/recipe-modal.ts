import { eventListener, onClickOutside, useTemplate } from "../lib/utils";
import state from "../lib/StateManager";

window.customElements.define(
  "recipe-modal",
  class RecipeModal extends HTMLElement {
    eventListeners: (() => void)[] | undefined;

    connectedCallback() {
      const body = this.querySelector<HTMLDivElement>(".recipe-modal__body")!;
      const template = this.querySelector("template")!;
      const createModalContent = useTemplate(template);

      const showLoader = () => {
        body.innerHTML = "";
      };

      // Fetch the recipe information and generate the content
      const loadModalContent = async (id: string) => {
        try {
          const response = await fetch(`http://localhost:3000/recipes/${id}`);
          const json = await response.json();

          const modalContent = createModalContent({
            src: json.data.image,
            alt: json.data.title,
            title: json.data.title,
            description: json.data.summary,
            instructions: json.data.instructions,
          });

          body.appendChild(modalContent);
        } catch (err) {
          console.error(err);
        }
      };

      this.eventListeners = [
        state.on("modal:open", async (state) => {
          showLoader();
          this.classList.add("recipe-modal--open");
          await loadModalContent(state.openModal!);
        }),
        state.on("modal:close", (state) => {
          this.classList.remove("recipe-modal--open");
        }),
        onClickOutside(body, () => {
          state.emit("modal:close", { openModal: null });
        }),
      ];
    }

    disconnectedCallback() {}
  }
);
