export const delay = time =>
  new Promise(resolve => {
    setTimeout(() => resolve(true), time);
  });

const _pipe = function(callback, fn) {
  return async function(...args) {
    return fn(...(await callback(...args)));
  };
};
export const pipe = (...fns) => fns.reduce(_pipe);
