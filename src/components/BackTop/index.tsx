import { useEffect, useState } from "react";

import { throttle } from "@/utils";

const BackTop = () => {
	const [visabled, setVisabled] = useState(false);

	useEffect(() => {
		// 防止卸载后继续触发scroll事件
		let igore = false;

		const onScroll = throttle(() => {
			if (igore) {
				return;
			}

			if (window.scrollY < 50) {
				setVisabled(false);
			} else {
				setVisabled(true);
			}
		}, 300);

		document.addEventListener("scroll", onScroll, true);

		return () => {
			igore = true;
			document.removeEventListener("scroll", onScroll);
		};
	}, []);

	const scrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	};

	return (
		<button
			className={`q-bg-cpt fixed bottom-10 right-1 z-10 animate-bounce items-center justify-center rounded-full shadow-md sm:right-10 sm:h-16 sm:w-16 ${visabled ? "flex" : "hidden"}`}
			onClick={scrollToTop}
		>
			<span
				className="q-color-primary-hover icon-[mdi--arrow-top-circle]"
				style={{ width: "2rem", height: "2rem" }}
			/>
		</button>
	);
};

export default BackTop;
