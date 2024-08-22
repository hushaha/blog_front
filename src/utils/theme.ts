import { useEffect, useState } from "react";

import { Theme } from "@/types";

const THEME_CODE = "data-theme";

const getDefaultTheme = (): Theme => {
	try {
		return (
			(window.localStorage.getItem(THEME_CODE) as Theme) ||
			(window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light")
		);
	} catch (err) {
		return "light";
	}
};

export const useTheme = () => {
	const [theme, setTheme] = useState<Theme>("");

	const setThemeType = (theme: Theme) => {
		setTheme(theme);
		document.documentElement.setAttribute(THEME_CODE, theme);
		window.localStorage.setItem(THEME_CODE, theme);
	};

	const setThemeWrap = (newTheme: Theme) => {
		// 动画切换
		if (!document.startViewTransition) {
			setThemeType(newTheme);
			return false;
		}

		const transition = document.startViewTransition(() => {
			setThemeType(newTheme);
		});

		transition.ready.then(() => {
			const radius = Math.hypot(innerWidth, innerHeight);
			const clipPath = [
				`circle(0% at ${innerWidth}px ${0}px)`,
				`circle(${radius}px at ${innerWidth}px ${0}px)`,
			];
			document.documentElement.animate(
				{
					clipPath: theme === "dark" ? clipPath : clipPath.reverse(),
				},
				{
					duration: 500,
					pseudoElement:
						theme === "dark"
							? "::view-transition-new(root)"
							: "::view-transition-old(root)",
				},
			);
		});
	};

	useEffect(() => {
		const darkThemeListener = () => {
			setThemeWrap(getDefaultTheme());
		};

		darkThemeListener();

		const isDarkMatch = window.matchMedia("(prefers-color-scheme: dark)");

		isDarkMatch.addEventListener("change", darkThemeListener);

		return () => {
			isDarkMatch.removeEventListener("change", darkThemeListener);
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const changeTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setThemeWrap(newTheme);
	};

	return { theme, changeTheme };
};
