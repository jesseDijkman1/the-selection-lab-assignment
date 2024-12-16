import { eventListener, onClickOutside, useTemplate } from "../lib/utils";
import state from "../lib/StateManager";
import RecipesAPI from "../lib/RecipesAPI";
import BEM from "../lib/BEM";

const [COMPONENT_NAME, BEM_OPEN] = new BEM("recipe-modal").RAW.OPEN;

window.customElements.define(
  COMPONENT_NAME,
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
          const recipe = await RecipesAPI.fetch("details", { id });

          const modalContent = createModalContent({
            src: recipe.image,
            alt: recipe.title,
            title: recipe.title,
            description: recipe.summary,
            instructions: recipe.instructions,
          });

          body.appendChild(modalContent);
        } catch (err) {
          console.error(err);
        }
      };

      this.eventListeners = [
        state.on("modal:open", async (state) => {
          showLoader();
          this.classList.add(BEM_OPEN);
          await loadModalContent(state.openModal!);
        }),
        state.on("modal:close", () => {
          this.classList.remove(BEM_OPEN);
        }),
        onClickOutside(body, () => {
          state.emit("modal:close", { openModal: null });
        }),
      ];
    }

    disconnectedCallback() {
      for (let removeListener of this.eventListeners ?? []) removeListener();
    }
  }
);
