import "@/assets/styles/index.css";

import type { AppProps } from "next/app";
import type { FC } from "react";

import { Layout } from "@/feature";
import { Login } from "@/feature";
import { LoginProvider } from "@/provider";

type CustomAppProps = {
  Component: AppProps["Component"] & {
    hiddenLayout?: boolean; // 是否隐藏layout
  };
  pageProps: AppProps["pageProps"];
};

const MyApp: FC<CustomAppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <LoginProvider>
        {Component.hiddenLayout ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}

        <Login />
      </LoginProvider>
    </>
  );
};

export default MyApp;
