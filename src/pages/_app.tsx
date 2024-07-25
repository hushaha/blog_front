import "@/assets/styles/index.css";

import type { AppProps } from "next/app";
import Head from "next/head";
import type { FC } from "react";

import { Layout } from "@/feature";
import { Login } from "@/feature";
import { LoginProvider } from "@/provider";

type CustomAppProps = {
	Component: AppProps["Component"] & {
		moHiddenLayout?: boolean; // 是否隐藏layout
	};
	pageProps: AppProps["pageProps"];
};

const MyApp: FC<CustomAppProps> = ({ Component, pageProps }) => {
	return (
		<>
			<Head>
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1, user-scalable=no"
				/>
			</Head>
			<LoginProvider>
				<Layout moHiddenLayout={Component.moHiddenLayout}>
					<Component {...pageProps} />
				</Layout>

				<Login />
			</LoginProvider>
		</>
	);
};

export default MyApp;
