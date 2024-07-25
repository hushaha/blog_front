import Link from "next/link";
import { FC } from "react";

import type { TagItem } from "@/types";

interface Props {
	tagList: TagItem[];
}

const Blog: FC<Props> = ({ tagList = [] }) => {
	return (
		<div>
			<div className="mt-3 text-xl font-bold">Tags</div>
			<div className="q-card mt-8" style={{ padding: "1.5rem" }}>
				<div className="max-h-64 overflow-y-auto">
					{tagList.map((tag, idx) => (
						<Link key={idx} href={`/tags/${tag.name}`} passHref>
							<a className="q-color-primary-hover mx-1 my-2 flex justify-between font-bold hover:underline">
								<span>- {tag.name}</span>
								<span className="text-sm font-light">
									Created {tag.count} Posts
								</span>
							</a>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};

export default Blog;
