import type { BytemdPlugin } from "bytemd";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";

import { message } from "@/components";

import { copyToClipboard } from "./util";

export const autolinkHeadingsPlugin = (): BytemdPlugin => {
  return {
    rehype: (processor) =>
      processor
        .use(rehypeSlug)
        // @ts-ignore
        .use(rehypeAutolinkHeadings, { behavior: "append" }),
  };
};

const createCopyDom = (text: any): HTMLElement => {
  const copyDom = document.createElement("div");
  copyDom.className =
    "q-color-primary-hover q-secondary icon-[ph--copy-bold] absolute right-2 top-2 cursor-pointer";
  copyDom.addEventListener("click", () => {
    copyToClipboard(text);
    message.info({
      title: "系统通知",
      content: "复制成功",
    });
  });
  return copyDom;
};

export const codeCopyPlugin = (): BytemdPlugin => {
  return {
    viewerEffect: ({ markdownBody }) => {
      // 获取所有code标签
      const els = markdownBody.querySelectorAll("pre>code");
      if (els.length === 0) return;

      // 往pre标签中append copy节点
      els.forEach((itm: HTMLElement) => {
        itm.parentNode.appendChild(createCopyDom(itm.innerText));
      });
    },
  };
};
