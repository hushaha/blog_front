import { FC, memo } from "react";

import { Content } from "@/components/Layout";
import BlogDesc from "@/feature/BlogDesc";
import { BlogItem } from "@/types";

interface Props {
  title: string;
  list: BlogItem[];
  onSearch: (s: string) => void;
}

const BlogList: FC<Props> = ({ title, list, onSearch }) => {
  return (
    <Content title={title} onSearch={onSearch}>
      <ul className="mt-6 flex flex-col gap-6">
        {(list || []).map((itm) => (
          <li key={itm.id}>
            <BlogDesc item={itm} />
          </li>
        ))}
      </ul>
    </Content>
  );
};

export default memo(BlogList);
