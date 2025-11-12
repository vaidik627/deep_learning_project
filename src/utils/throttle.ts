/**
 * Throttle function to limit the rate at which a function can fire
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => ReturnType<T> | undefined {
  let lastFunc: number;
  let lastRan: number;
  
  return function(...args: Parameters<T>): ReturnType<T> | undefined {
    if (!lastRan) {
      func(...args);
      lastRan = Date.now();
    } else {
      clearTimeout(lastFunc);
      lastFunc = window.setTimeout(function() {
        if (Date.now() - lastRan >= limit) {
          func(...args);
          lastRan = Date.now();
        }
      }, limit - (Date.now() - lastRan));
    }
    return undefined;
  };
}
