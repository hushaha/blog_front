import toc from "remark-extract-toc";
import markdown from "remark-parse";
import { unified } from "unified";

import { TocTree } from "@/types";

/**
 * 获取目录树
 * @param {string} val markdown内容
 * @returns 目录树
 */
export const getTocTree = (val: string): TocTree => {
  try {
    const processor = unified().use(markdown, { commonmark: true }).use(toc);

    const node = processor.parse(val);
    const tree = processor.runSync(node);
    return tree as unknown as TocTree;
  } catch (error) {
    return [];
  }
};
