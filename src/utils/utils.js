export const delay = time =>
  new Promise(resolve => {
    setTimeout(() => resolve(true), time);
  });

export const byteSize = size => {
  var sizes = [" Bytes", " KB", " MB", " GB", " TB"];
  for (var i = 1; i < sizes.length; i++) {
    if (size < Math.pow(1024, i)) return Math.round((size / Math.pow(1024, i - 1)) * 100) / 100 + sizes[i - 1];
  }
  return size;
};

const _pipe = function(callback, fn) {
  return async function(...args) {
    return fn(...(await callback(...args)));
  };
};
export const pipe = (...fns) => fns.reduce(_pipe);
