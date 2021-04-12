/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable no-empty */
/**
 * EventManager - simplifies events
 * Src : https://dmnsgn.medium.com/singleton-pattern-in-es6-d2d021d150ae
 */
class EventManager {
  constructor() {
    // eslint-disable-next-line no-underscore-dangle
    this._type = 'EventManager';
    this.node = window;
    this.cache = {}; // old events
  }

  // returns the last time this event was dispatched - even prior to your "listener"
  get(event) {
    return this.cache[event];
  }

  // dispatches the last instance of this event
  echo(event) {
    this.dispatch(this.get(event));
  }

  // listen for and respond to events
  addListener(event, handler, useCapture) {
    if (!event) return;

    handler =
      handler ||
      function (e) {
        if (!e) return null;
        return e.details || null;
      };

    this.node.addEventListener(event, handler, useCapture);
  }

  // stop listening
  removeListener(event, handler) {
    if (!event) return;
    this.node.removeEventListener(event, handler);
  }

  // dispatch an event with forgiving syntax
  dispatch(event, params, quiet) {
    if (!event) return;
    if (!event.type) {
      const e = event;
      const n = e.event || e.name || e;
      let p = e.params || e.data || params;
      if (typeof p === 'object') {
        p = { ...e.params, ...e.data, ...params };
      }
      event = new CustomEvent(n, { detail: p });
    }

    this.node.dispatchEvent(event);
    this.cache[event.type] = event;
    try {
      if (!quiet)
        console.log(`dispatch ${event.type}(${event.detail ? JSON.stringify(event.detail) : ''})`); // TODO : Implement Logger
    } catch (ex) {}
  }
}

export default new EventManager();
