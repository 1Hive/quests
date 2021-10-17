export function append(...str: any[]) {
  return str.join(' ');
}

export const debounce = (func: Function, wait?: number) => {
  // eslint-disable-next-line no-undef
  let timeout: NodeJS.Timeout | null;
  return (...args: any) => {
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
};
