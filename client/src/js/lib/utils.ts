export const eventListener = <T extends keyof HTMLElementEventMap>(
  eventName: T,
  element: HTMLElement | HTMLElement[],
  fn: (e: HTMLElementEventMap[T]) => void,
  options: EventListenerOptions | boolean = {}
): (() => void) => {
  const elements = Array.isArray(element) ? element : [element];

  for (let el of elements) el.addEventListener(eventName, fn, options);

  return () => {
    for (let el of elements) el.removeEventListener(eventName, fn, options);
  };
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

/**
 * Replaces the content of an HTML element
 *
 * @param {HTMLElement} node - The container element of which the content needs to be replaced.
 * @param {HTMLElement | HTMLElement[]} content - The new content for the container
 * @returns {HTMLElement} The container element
 */
export const replaceContent = (
  node: HTMLElement,
  content: HTMLElement | HTMLElement[]
) => {
  node.innerHTML = "";
  node.append(...([] as HTMLElement[]).concat(content));
  return node;
};

/**
 * A hook that generates a function to create an HTML element from a template
 * with dynamic content and attributes.
 *
 * @param template - An HTMLTemplateElement used as the base for generating elements.
 * @returns A function that accepts a props object and generates a cloned HTML element
 * with content and attributes populated from the template.
 */
export const useTemplate = <T extends HTMLElement>(
  template: HTMLTemplateElement
) => {
  return (
    props: Record<string, string | number | HTMLElement | HTMLElement[]>
  ) => {
    const resolveTemplate = (element: Element) => {
      for (let child of element.children) {
        // Set the content of the element in the template
        if (child.hasAttribute("data-template-content")) {
          const propsKey = child.getAttribute("data-template-content")!;
          child.textContent = props[propsKey] as string;
          child.removeAttribute("data-template-content");
        }

        // Set the attributes on the current elements
        if (child.hasAttribute("data-template-attributes")) {
          const propsKeys = child
            .getAttribute("data-template-attributes")!
            .split(",");

          for (let key of propsKeys) {
            child.setAttribute(key, props[key] as string);
          }

          child.removeAttribute("data-template-attributes");
        }

        if (child.hasAttribute("data-template-html")) {
          const propsKey = child.getAttribute("data-template-html")!;
          const html = props[propsKey] as HTMLElement | HTMLElement[] | string;

          if (typeof html === "string") {
            child.innerHTML = html;
          } else {
            child.append(...([] as HTMLElement[]).concat(html));
          }

          child.removeAttribute("data-template-html");
        }

        if (child.children) resolveTemplate(child);
      }

      return element as T;
    };

    return resolveTemplate(template.content.cloneNode(true) as T); // Technically not correct as cloneNode(true) on content returns Node as the type. Could cause issues ...
  };
};

export const debounce = (fn: (...args: any[]) => void, delay: number) => {
  let timeout: number | null = null;

  return (...args: any[]) => {
    if (timeout !== null) clearTimeout(timeout);

    timeout = setTimeout(() => fn(...args), delay);
  };
};

export const onClickOutside = (container: HTMLElement, cb: () => void) => {
  return eventListener(
    "click",
    document.documentElement,
    (e: Event) => {
      if (!container.contains(e.target as HTMLElement)) cb();
    },
    { capture: true }
  );
};

export const onFocusLost = (container: HTMLElement, cb: () => void) => {
  let hasFocus = false;
  const triggeredEvents: Set<string> = new Set();

  const check = debounce(() => {
    if (
      triggeredEvents.has("focus-inside") ||
      triggeredEvents.has("clicked-inside")
    ) {
      hasFocus = true;
    }

    if (
      hasFocus &&
      (triggeredEvents.has("focus-outside") ||
        triggeredEvents.has("clicked-outside") ||
        (triggeredEvents.size === 1 && triggeredEvents.has("blur")))
    ) {
      hasFocus = false;
      cb();
    }

    triggeredEvents.clear();
  }, 0);

  const removeFocusListener = eventListener(
    "focus",
    document.documentElement,
    (e: Event) => {
      triggeredEvents.add(
        container.contains(e.target as HTMLElement)
          ? "focus-inside"
          : "focus-outside"
      );

      check();
    },
    true
  );

  const removeBlurListener = eventListener(
    "blur",
    document.documentElement,
    () => {
      triggeredEvents.add("blur");

      check();
    },
    true
  );

  const removeClickListener = eventListener(
    "mousedown",
    document.documentElement,
    (e) => {
      triggeredEvents.add(
        container.contains(e.target as HTMLElement)
          ? "clicked-inside"
          : "clicked-outside"
      );

      check();
    },
    true
  );

  return () => {
    removeFocusListener();
    removeBlurListener();
    removeClickListener();
  };
};

export const wait = (duration: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
