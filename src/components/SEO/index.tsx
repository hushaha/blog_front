import Head from "next/head";
import { FC } from "react";

interface Props {
  title: string;
  keywords?: string;
  description?: string;
}

const SEO: FC<Props> = ({ title, keywords, description }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="keywords" content={keywords} />
      <meta name="description" content={description} />
    </Head>
  );
};

export default SEO;
