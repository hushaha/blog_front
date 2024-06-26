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
            className="q-color-primary-hover q-secondary truncate leading-6 hover:underline"
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
    <div className={`${className}`}>
      <LoopTocTree treeList={treeList} />
    </div>
  );
};

export default memo(Toc);
