import { eventListener } from "../lib/utils";
import state from "../lib/StateManager";

window.customElements.define(
  "modal-toggle",
  class ModalToggle extends HTMLElement {
    eventListeners: (() => void)[] | undefined;

    connectedCallback() {
      const modalId = this.dataset.modalId;

      const toggleModal = (e: Event) => {
        const currentState = state.getState();

        if (currentState.openModal === modalId) {
          state.emit("modal:close", { openModal: null });
        } else {
          state.emit("modal:open", { openModal: modalId });
        }
      };

      this.eventListeners = [eventListener("click", this, toggleModal)];
    }

    disconnectedCallback() {}
  }
);
