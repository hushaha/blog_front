import { useEffect, useState } from "react";
import toc from "remark-extract-toc";
import markdown from "remark-parse";
import { unified } from "unified";

import { TocTree } from "@/types";

import { flatArr, throttle } from "./util";

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

export const useTocScroll = (tocList: TocTree) => {
	const [activeKey, setActiveKey] = useState("");

	const getDomTopList = (tocList: TocTree) => {
		const flatList = flatArr(tocList, "children");

		const topList = flatList.reduce((arr, item) => {
			const el = document.getElementById(item.value.toLocaleLowerCase());
			if (el) {
				arr.push({ name: item.value, top: el.offsetTop });
			}
			return arr;
		}, []);

		return topList;
	};

	const getFirstActive = (
		scrollTop: number,
		topList: { name: string; top: number }[],
	) => {
		return (
			topList.find((item) => {
				return item.top > scrollTop;
			}) || topList[topList.length - 1]
		).name;
	};

	useEffect(() => {
		// 防止卸载后继续触发scroll事件
		let igore = false;

		const onScroll = throttle(() => {
			if (igore) {
				return;
			}

			const topList = getDomTopList(tocList);

			setActiveKey(getFirstActive(window.scrollY, topList));
		}, 300);

		document.addEventListener("scroll", onScroll, true);

		return () => {
			igore = true;
			document.removeEventListener("scroll", onScroll);
		};
	}, [tocList]);

	return { activeKey };
};
