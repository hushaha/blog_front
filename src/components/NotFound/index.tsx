import Router from "next/router";

import NotFoundSVG from "@/assets/imgs/404.svg";

const NotFound = () => {
	const toHome = () => {
		Router.push({ pathname: "/" });
	};

	return (
		<div className="mt-20 h-full w-full text-center sm:mt-36 sm:flex sm:items-center sm:justify-center sm:text-left">
			<div className="w-full sm:w-2/5">
				<NotFoundSVG />
			</div>
			<div className="w-full sm:w-1/3">
				<h1 className="text-8xl font-bold">404</h1>
				<p className="mt-2">当前页面不存在, 请点击返回首页按钮</p>
				<button className="q-button mt-4" onClick={toHome}>
					首页
				</button>
			</div>
		</div>
	);
};

export default NotFound;
