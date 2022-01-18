export function watchResize(
  element: HTMLElement,
  callback: (width: number, height: number) => void
) {
  const func = () => {
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    callback(width, height);
  };
  const observer = new ResizeObserver(func);
  observer.observe(element);
  func();
  return observer;
}

function throttle(callback: (args: any[]) => any, limit: number) {
  var waiting = false;
  return function () {
    if (!waiting) {
      callback.apply(this, arguments);
      waiting = true;
      setTimeout(function () {
        waiting = false;
      }, limit);
    }
  };
}
