import Link from "next/link";
import React, { FC, memo, useMemo } from "react";

import type { BlogItem } from "@/types";

interface Props {
  item: BlogItem;
}

const BlogDesc: FC<Props> = ({ item }) => {
  const tags = useMemo(() => item.tag?.split(",") || [], [item.tag]);

  return (
    <div className="q-card">
      <div className="flex items-center justify-between">
        <span className="q-secondary font-light">{item.createTime}</span>
      </div>
      <Link href="/blog/[id]" as={`/blog/${item.id}`} passHref>
        <a className="mt-2 inline-block text-xl font-bold hover:underline sm:text-2xl">
          {item.title}
        </a>
      </Link>
      <div className="q-secondary mt-2 line-clamp-2 text-sm">{item.desc}</div>
      <div className="mt-4 flex items-center justify-between">
        <Link href="/blog/[id]" as={`/blog/${item.id}`} passHref>
          <a className="q-color-primary inline-block flex-shrink-0 hover:underline">
            查看详情
          </a>
        </Link>
        <div className="hidden gap-2 sm:flex">
          {tags.map((itm) => (
            <div key={itm}>
              <Link href={`/tags/${itm}`} passHref>
                <a className="q-tag">{itm}</a>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default memo(BlogDesc);
