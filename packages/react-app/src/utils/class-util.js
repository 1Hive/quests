export function append(...str) {
  return str.join(' ');
}

export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
};

// eslint-disable-next-line no-unused-vars
export function emptyFunc(..._args) {}
