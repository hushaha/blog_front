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
        <a className="mt-2 inline-block text-2xl font-bold hover:underline">
          {item.title}
        </a>
      </Link>
      <div className="q-secondary mt-2 line-clamp-2 text-sm">{item.desc}</div>
      <div className="mt-4 flex items-center justify-between">
        <Link href="/blog/[id]" as={`/blog/${item.id}`} passHref>
          <a className="q-color-primary inline-block hover:underline">
            查看详情
          </a>
        </Link>
        <div className="mt-2 flex flex-wrap gap-2">
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
