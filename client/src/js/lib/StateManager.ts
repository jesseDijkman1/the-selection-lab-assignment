type State = Record<string, any>;
type ListenerCallback = (state: State, data: any) => void;

class StateManager {
  private state: State;
  private listeners: Record<string, ListenerCallback[]>;

  constructor() {
    this.state = {};
    this.listeners = {};
  }

  /**
   * Register a callback function to be triggered on the specified event.
   * @param eventName - The name of the event to listen for.
   * @param cb - The callback function to execute when the event is emitted.
   * @returns A function to unsubscribe the listener.
   */
  on(eventName: string, cb: ListenerCallback) {
    if (!this.listeners[eventName]) this.listeners[eventName] = [];

    this.listeners[eventName].push(cb);

    return () => {
      this.listeners[eventName] = this.listeners[eventName].filter(
        (fn) => fn !== cb
      );
    };
  }

  /**
   * Emit an event, optionally updating the state and passing additional data to listeners.
   * @param eventName - The name of the event to emit.
   * @param newState - Optional partial state to merge with the current state.
   * @param data - Additional data to pass to listeners.
   */
  emit(eventName: string, newState?: Partial<State> | null, data?: any) {
    if (!this.listeners[eventName]) return;

    if (newState) {
      this.state = { ...this.state, ...newState }; // Very simple, doesn't support nested overrides
    }

    for (let fn of this.listeners[eventName]) {
      fn(this.state, data);
    }
  }

  /**
   * Get a snapshot of the current state.
   * @returns A shallow copy of the current state.
   */
  getState(): State {
    return { ...this.state };
  }
}

const state = new StateManager();

export default state;
