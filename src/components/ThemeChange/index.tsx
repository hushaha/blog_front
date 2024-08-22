import { useTheme } from "@/utils";

const ThemeChange = () => {
	const { theme, changeTheme } = useTheme();

	return (
		<>
			<span
				className={`${theme === "dark" ? "icon-[line-md--moon-alt-loop]" : "icon-[line-md--sun-rising-loop]"} cursor-pointer`}
				style={{ fontSize: "1.5rem" }}
				onClick={changeTheme}
			/>
		</>
	);
};

export default ThemeChange;
