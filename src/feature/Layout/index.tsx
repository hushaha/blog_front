import React, { FC, ReactNode } from "react";

import Footer from "./Footer";
import Header from "./Header";

interface Props {
  children: ReactNode;
}

const LayoutWrapper: FC<Props> = ({ children }) => {
  return (
    <div className="flex h-screen flex-col justify-between overflow-x-hidden scroll-smooth">
      <Header />
      <div className="mx-auto w-full flex-1 px-6 py-8">{children}</div>
      <Footer />
    </div>
  );
};

export default LayoutWrapper;
