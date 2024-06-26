import { GetStaticProps, InferGetStaticPropsType } from "next";
import { FC, useState } from "react";

import { SEO } from "@/components";
import BlogList from "@/feature/BlogList";
import type { BlogItem, TagItem } from "@/types";
import sHttp from "@/utils/getStaticData";

import SideBar from "./components/SideBar";

export const getStaticProps: GetStaticProps<{
  blogList: BlogItem[];
  tagList: TagItem[];
}> = () => {
  const blogList = sHttp.getBlogList();
  const tagList = sHttp.getTagList();
  return { props: { blogList, tagList } };
};

const Blog: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  blogList = [],
  tagList = [],
}) => {
  const [curList, setCurList] = useState(() => blogList || []);

  const getBlogList = ({ title }) => {
    if (!title) {
      setCurList(blogList);
      return;
    }
    const res = blogList.filter((it) =>
      it.title.toLowerCase().includes(title.toLowerCase()),
    );
    setCurList(res);
  };

  const onSearch = (s: string) => {
    getBlogList({ title: s });
  };

  return (
    <div className="container mx-auto flex justify-center gap-10">
      <SEO title="所有文章" />
      <div className="sm:w-4/5 lg:w-1/2">
        <BlogList title="Post" list={curList} onSearch={onSearch} />
      </div>
      <div className="sticky top-6 hidden h-fit w-80 max-w-sm shrink-0 lg:block">
        <SideBar tagList={tagList} />
      </div>
    </div>
  );
};

export default Blog;
