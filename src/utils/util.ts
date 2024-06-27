/**
 * 防抖
 * @param fn 防抖目标函数
 * @param delay 间隔时间
 * @param options 配置参数
 * @returns
 */
export const debounce = <T extends (...args: any[]) => void>(
  fn: T,
  delay?: number,
  options?: {
    immediate?: boolean;
  },
): T => {
  const { immediate = false } = options || {};
  let timer = null;

  const debounceFn = function (...args: Parameters<T>) {
    if (immediate && !timer) {
      fn.apply(this, args);
    }

    if (timer) clearTimeout(timer);

    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };

  return debounceFn as T;
};

/**
 * 节流
 * @param fn 节流目标函数
 * @param delay 间隔时间
 * @param options 配置参数
 * @returns
 */
export const throttle = <T extends (...args: any[]) => void>(
  fn: T,
  delay?: number,
  options?: {
    immediate?: boolean;
  },
): T => {
  let timer = true;
  let initImmediate = options?.immediate || false;

  const throttleFn = function (...args: Parameters<T>) {
    if (initImmediate) {
      fn.apply(this, args);
      initImmediate = false;
    } else if (timer) {
      timer = false;
      setTimeout(() => {
        fn.apply(this, args);
        timer = true;
      }, delay);
    }
  };

  return throttleFn as T;
};

/**
 *  判断是否是移动端
 * @returns {boolean} 是否是移动端
 */
export const isMobile = (): boolean => {
  return (
    typeof window !== "undefined" &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent,
    )
  );
};
