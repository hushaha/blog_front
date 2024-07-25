import type { BytemdPlugin } from "bytemd";
import rehypeHighlightCodeLines from "rehype-highlight-code-lines";
import rehypeSlug from "rehype-slug";

import { message } from "@/components";

import { copyToClipboard } from "./util";

/**
 * 自动生成标题Link
 * @returns BytemdPlugin
 */
export const autolinkHeadingsPlugin = (): BytemdPlugin => {
	return {
		rehype: (processor) => processor.use(rehypeSlug),
	};
};

/**
 * 代码复制
 * @returns BytemdPlugin
 */
export const codeCopyPlugin = (): BytemdPlugin => {
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

	return {
		viewerEffect: ({ markdownBody }) => {
			// 获取所有code标签
			const els = markdownBody.querySelectorAll("pre>code");
			if (els.length === 0) return;

			// 往pre标签中append copy节点
			els.forEach((itm: HTMLElement) => {
				// 只有code一个子节点，如果有多个子节点证明已经存在copy节点
				if (itm.parentNode.childNodes.length === 1) {
					itm.parentNode.appendChild(createCopyDom(itm.innerText));
				}
			});
		},
	};
};

/**
 * 添加代码行号
 * @returns BytemdPlugin
 */
export const highlightCodeLinesPlugin = (): BytemdPlugin => {
	return {
		rehype: (processor) =>
			processor
				// @ts-ignore
				// 添加代码行号
				.use(rehypeHighlightCodeLines, {
					showLineNumbers: true,
					lineContainerTagName: "div",
				}),
	};
};

/**
 * 添加target=_blank
 * @returns BytemdPlugin
 */
export const targetBlankLink = (): BytemdPlugin => {
	return {
		viewerEffect: ({ markdownBody }) => {
			// 获取所有code标签
			const els = markdownBody.querySelectorAll("a");
			if (els.length === 0) return;

			// 往pre标签中append copy节点
			els.forEach((itm: HTMLElement) => {
				// 非锚点链接
				if (itm.getAttribute("href")[0] !== "#") {
					itm.setAttribute("target", "_blank");
					itm.setAttribute("rel", "noopener noreferrer");
				}
			});
		},
	};
};
