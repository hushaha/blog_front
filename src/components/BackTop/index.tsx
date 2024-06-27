import { useEffect, useState } from "react";

import { throttle } from "@/utils";

const BackTop = () => {
  const [visabled, setVisabled] = useState(false);

  useEffect(() => {
    const onScroll = throttle(() => {
      if (window.scrollY < 50) {
        setVisabled(false);
      } else {
        setVisabled(true);
      }
    });

    document.addEventListener("scroll", onScroll, true);

    return () => document.removeEventListener("scroll", onScroll);
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
    >
      <span
        className="q-color-primary-hover icon-[mdi--arrow-top-circle]"
        style={{ width: "2rem", height: "2rem" }}
        onClick={scrollToTop}
      />
    </button>
  );
};

export default BackTop;
