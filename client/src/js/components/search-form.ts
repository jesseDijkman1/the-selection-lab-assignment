const eventListener = (
  eventName: string,
  element: HTMLElement | HTMLElement[],
  fn: () => void
) => {
  const elements = Array.isArray(element) ? element : [element];
  elements.forEach((el) => el.addEventListener(eventName, fn));

  return () => elements.forEach((el) => el.removeEventListener(eventName, fn));
};

window.customElements.define(
  "search-form",
  class SearchForm extends HTMLElement {
    eventListeners: (() => void)[] | undefined;

    connectedCallback() {
      const input = this.querySelector("input")!;
      const submit = this.querySelector("button")!;

      const handleInput = () => {
        console.log("handle input");
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
