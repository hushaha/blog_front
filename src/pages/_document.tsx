import Document, { Head, Html, Main, NextScript } from "next/document";

import { BASE_CONFIG } from "@/config";

const { description, keywords, title } = BASE_CONFIG;

class MyDocument extends Document {
  render() {
    return (
      <Html lang="zh-CN" className="scroll-smooth focus:scroll-auto">
        <Head>
          <meta name="description" content={description} />
          <meta name="keywords" content={keywords} />
          <meta property="og:title" content={title} key="title" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
