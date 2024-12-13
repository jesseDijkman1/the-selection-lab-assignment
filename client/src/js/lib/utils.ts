/**
 * Adds an event listener to one or more HTML elements and returns a function to remove it.
 *
 * @param {string} eventName - The name of the event to listen for (e.g., "click").
 * @param {HTMLElement | HTMLElement[]} element - A single HTMLElement or an array of HTMLElements to attach the event listener to.
 * @param {(e: Event) => void} fn - The callback function to execute when the event is triggered.
 * @returns {() => void} A function that removes the event listener from all specified elements.
 */
export const eventListener = (
  eventName: string,
  element: HTMLElement | HTMLElement[],
  fn: (e: Event) => void
): (() => void) => {
  const elements = Array.isArray(element) ? element : [element];

  elements.forEach((el) => el.addEventListener(eventName, fn));

  return () => elements.forEach((el) => el.removeEventListener(eventName, fn));
};

/**
 * Forces a browser repaint of the specified node.
 * This can be useful for applying CSS transitions or animations.
 *
 * @param {HTMLElement} node - The HTML element to repaint.
 */
export const repaint = (node: HTMLElement): void => void node.offsetHeight;

/**
 * Hides one or more HTML elements by setting "hidden" and "aria-hidden" attributes.
 *
 * @param {...HTMLElement[]} nodes - One or more HTML elements to hide.
 * @returns {HTMLElement[]} The array of elements that were hidden.
 */
export const hide = (...nodes: HTMLElement[]) =>
  nodes.map((node) => {
    node.setAttribute("hidden", "hidden"); // Setting .hidden = true doesn't work on SVG's
    node.setAttribute("aria-hidden", "true");
    return node;
  });

/**
 * Shows one or more HTML elements by removing "hidden" and "aria-hidden" attributes.
 *
 * @param {...HTMLElement[]} nodes - One or more HTML elements to show.
 * @returns {HTMLElement[]} The array of elements that were shown.
 */
export const show = (...nodes: HTMLElement[]) =>
  nodes.map((node) => {
    node.removeAttribute("hidden");
    node.removeAttribute("aria-hidden");
    return node;
  });
