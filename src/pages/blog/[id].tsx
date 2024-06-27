import { GetStaticProps, InferGetStaticPropsType } from "next";
import Link from "next/link";
import { FC } from "react";

import { EditorMD, SEO, Toc } from "@/components";
import type { BlogItem } from "@/types";
import sHttp from "@/utils/getStaticData";

type Props = {
  id: string;
};

export const getStaticPaths = async () => {
  const paths = sHttp.getBlogList().map((itm) => `/blog/${itm.id}`);
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps<{
  detail: BlogItem;
}> = ({ params }: { params: Props }) => {
  const detail = sHttp.getBlogDetailById(params.id) || {
    id: params.id,
    title: "",
    content: "",
    desc: "",
    createTime: "",
    updateTime: "",
  };
  return { props: { detail } };
};

const Blog: FC<InferGetStaticPropsType<typeof getStaticProps>> & {
  moHiddenLayout: boolean;
} = ({ detail }) => {
  return (
    <div className="flex justify-center gap-10">
      <SEO
        title={detail?.title}
        keywords={detail?.tag}
        description={detail?.desc}
      />
      <div className="q-card w-full lg:w-3/5">
        <div>
          <h1 className="text-3xl font-extrabold leading-9 tracking-tight">
            {detail?.title}
          </h1>
          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm">
            <span>{detail?.authors}</span>
            <span>{detail?.createTime}</span>
            {detail?.tag && (
              <span className="flex flex-wrap gap-2">
                {detail.tag.split(",").map((itm) => (
                  <Link key={itm} href={`/tags/${itm}`} passHref>
                    <a className="q-tag">{itm}</a>
                  </Link>
                ))}
              </span>
            )}
          </div>
        </div>
        <EditorMD onlyRead value={detail?.content} />
      </div>
      <div className="sticky top-6 hidden h-fit w-80 shrink-0 lg:block">
        <div className="q-card">
          <div className="border-b pb-2 font-bold">目录</div>
          <Toc
            value={detail?.content}
            className="mt-2 hidden max-h-80 max-w-64 overflow-auto sm:block"
          />
        </div>
      </div>
    </div>
  );
};

Blog.moHiddenLayout = true;

export default Blog;
