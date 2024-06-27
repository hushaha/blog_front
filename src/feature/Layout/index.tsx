import React, { FC } from "react";

import { BackTop } from "@/components";
import { isMobile } from "@/utils";

import Footer from "./Footer";
import Header from "./Header";

interface Props {
  moHiddenLayout?: boolean;
}

const LayoutWrapper: FC<Props> = ({ moHiddenLayout, children }) => {
  return isMobile() && moHiddenLayout ? (
    <div className="min-h-screen w-full">
      {children}
      <BackTop />
    </div>
  ) : (
    <div className="flex min-h-screen flex-col justify-between">
      <Header />
      <div className="container mx-auto flex-1 px-6 py-8">{children}</div>
      <Footer />
      <BackTop />
    </div>
  );
};

export default LayoutWrapper;
