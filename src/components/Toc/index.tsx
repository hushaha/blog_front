import { createContext, FC, memo, useContext, useMemo } from "react";

import { TocTree } from "@/types";
import { getTocTree, useTocScroll } from "@/utils";

interface Props {
	value: string;
	className?: string;
}

const TocContext = createContext(null);

const LoopTocTree: FC<{ treeList: TocTree }> = ({ treeList }) => {
	const context = useContext(TocContext);

	const activeClassName = "q-color-primary";

	const defaultClassName = "q-secondary";
	return (
		<div className="ml-2 text-sm">
			{treeList.map((item, idx) => (
				<div key={idx} className="flex flex-col">
					<a
						className={`q-color-primary-hover truncate leading-6 hover:underline ${context.activeKey === item.value ? activeClassName : defaultClassName}`}
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

	const { activeKey } = useTocScroll(treeList);

	return (
		<TocContext.Provider value={{ activeKey }}>
			<div className={`${className}`}>
				<LoopTocTree treeList={treeList} />
			</div>
		</TocContext.Provider>
	);
};

export default memo(Toc);
