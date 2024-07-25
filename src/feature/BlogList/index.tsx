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
			{!!list?.length ? (
				<div className="mt-6 flex flex-col gap-6">
					{(list || []).map((itm) => (
						<BlogDesc key={itm.id} item={itm} />
					))}
				</div>
			) : (
				<div className="flex h-full w-full items-center justify-center">
					暂无数据
				</div>
			)}
		</Content>
	);
};

export default memo(BlogList);
