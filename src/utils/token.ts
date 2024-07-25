import { TOKEN_NAME } from "@/config/constant";

/**
 * 获取token
 */
export const getToken = () => {
	return window.localStorage.getItem(TOKEN_NAME);
};

/**
 * 设置token
 * @param token
 */
export const setToken = (token: string) => {
	window.localStorage.setItem(TOKEN_NAME, token);
};
