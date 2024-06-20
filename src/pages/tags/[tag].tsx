import { GetStaticProps, InferGetStaticPropsType } from "next";
import { FC, useState } from "react";

import { SEO } from "@/components";
import BlogList from "@/feature/BlogList";
import { BlogItem } from "@/types";
import sHttp from "@/utils/getStaticData";

type Props = {
  tag: string;
};

export async function getStaticPaths() {
  const paths = sHttp.getTagList().map((itm) => `/tags/${itm.name}`);
  return { paths, fallback: true };
}

export const getStaticProps: GetStaticProps<{
  list: BlogItem[];
  tag: string;
}> = ({ params }: { params: Props }) => {
  const res = sHttp.getBlogList();
  const curList = res.filter((itm) => itm.tag?.includes(params.tag));
  return { props: { list: curList, tag: params.tag } };
};

const Blog: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  list = [],
  tag,
}) => {
  const [curList, setCurList] = useState(() => list || []);

  const getBlogList = ({ title }) => {
    if (!title) {
      setCurList(list);
      return;
    }

    const res = list.filter((it) =>
      it.title.toLowerCase().includes(title.toLowerCase()),
    );
    setCurList(res);
  };

  const onSearch = (s: string) => {
    getBlogList({ title: s });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <SEO title={tag} />
      <BlogList title={tag} list={curList} onSearch={onSearch} />
    </div>
  );
};

export default Blog;
