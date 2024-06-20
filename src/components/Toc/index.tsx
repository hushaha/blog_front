import { FC, memo, useMemo } from "react";

import { TocTree } from "@/types";
import { getTocTree } from "@/utils";

interface Props {
  value: string;
  className?: string;
}

const LoopTocTree: FC<{ treeList: TocTree }> = ({ treeList }) => {
  return (
    <div className="ml-2 text-sm">
      {treeList.map((item, idx) => (
        <div key={idx} className="flex flex-col">
          <a
            className="q-color-primary-hover q-secondary cursor-pointer truncate leading-6"
            href={`#${item.value.toLocaleLowerCase()}`}
          >
            {item.value}
          </a>
          {!!item.children?.length && <LoopTocTree treeList={item.children} />}
        </div>
      ))}
    </div>
  );
};

const Toc: FC<Props> = ({ value, className }) => {
  const treeList = useMemo<TocTree>(() => getTocTree(value), [value]);
  return (
    <div
      className={`${className} sticky right-0 top-10 h-1/2`}
    >
      <div className="toc-title border-b pb-1 pl-2 font-medium">目录</div>
      <div className="toc-content">
        <LoopTocTree treeList={treeList} />
      </div>
    </div>
  );
};

export default memo(Toc);
