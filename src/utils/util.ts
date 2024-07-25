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
 * 判断是否是移动端
 * @returns {boolean} 是否是移动端
 */
export const isMobile = ((): boolean => {
	return (
		typeof window !== "undefined" &&
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
			navigator.userAgent,
		)
	);
})();

/**
 * 复制到剪贴板
 * @param text 要复制的文本
 */
export const copyToClipboard = (text: any) => {
	navigator.clipboard.writeText(text);
};

/**
 * 获取图片地址
 * @param name 图片名称
 * @param type 图片类型 cover / ...
 * @returns 图片地址
 */
export const getImageUrl = (name: string, type?: string) => {
	const u = !type ? name : `${type}/${name}`;
	return `/images/${u}`;
};

/**
 * 扁平化数组
 * @param arr 数组
 * @param children 子数组
 * @returns 扁平化后的数组
 */
export const flatArr = <T>(arr: T[], children: string = "children"): T[] => {
	return arr.reduce((pre, cur) => {
		pre.push(cur);
		if (Array.isArray(cur[children])) {
			pre.push(...flatArr(cur[children], children));
		}
		return pre;
	}, []);
};
