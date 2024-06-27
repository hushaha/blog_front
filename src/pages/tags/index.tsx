import { GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { FC, useState } from "react";

import { SEO } from "@/components";
import { Content } from "@/components/Layout";
import { TagItem } from "@/types";
import sHttp from "@/utils/getStaticData";

export const getStaticProps: GetStaticProps<{
  list: TagItem[];
}> = () => {
  const res = sHttp.getTagList();
  return { props: { list: res } };
};

const Blog: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
  list = [],
}) => {
  const [curList, setCurList] = useState(() => list || []);

  const getBlogList = ({ title }) => {
    if (!title) {
      setCurList(list);
      return;
    }
    const res = list.filter((it) =>
      it.name.toLowerCase().includes(title.toLowerCase()),
    );
    setCurList(res);
  };

  const onSearch = (s: string) => {
    getBlogList({ title: s });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <SEO title="标签" />
      <Content title="标签" onSearch={onSearch}>
        {!!curList?.length ? (
          <div className="mt-6 grid grid-cols-3 gap-8">
            {curList.map((itm) => (
              <Link
                href="/tags/[tag]"
                as={`/tags/${itm.name}`}
                key={itm.name}
                passHref
              >
                <a className="q-color-primary-hover truncate text-center">
                  {itm.name}
                  {`(${itm.count})`}
                </a>
              </Link>
            ))}
          </div>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            暂无数据
          </div>
        )}
      </Content>
    </div>
  );
};

export default Blog;
