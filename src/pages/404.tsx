import Router from "next/router";

import NotFoundSVG from "@/assets/imgs/404.svg";

export default function FourZeroFour() {
  const toHome = () => {
    Router.push({ pathname: "/" });
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="w-2/5">
        <NotFoundSVG />
      </div>
      <div className="w-2/5">
        <h1 className="text-8xl font-bold">404</h1>
        <p className="mt-2">当前页面不存在, 请点击返回首页按钮</p>
        <button className="mt-4" onClick={toHome}>
          首页
        </button>
      </div>
    </div>
  );
}
