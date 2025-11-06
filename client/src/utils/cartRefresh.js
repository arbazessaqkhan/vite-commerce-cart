// client/src/utils/cartRefresh.js
const listeners = new Set();

export function subscribe(listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notifyCartChanged() {
  listeners.forEach(fn => fn());
}