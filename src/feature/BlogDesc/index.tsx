import Link from "next/link";
import React, { FC, memo, useMemo } from "react";

import type { BlogItem } from "@/types";
import { getImageUrl } from "@/utils";

interface Props {
	item: BlogItem;
}

const BlogDesc: FC<Props> = ({ item }) => {
	const tags = useMemo(() => item.tag?.split(",") || [], [item.tag]);

	const coverImg = useMemo(
		() => (item.cover ? getImageUrl(item.cover, "cover") : ""),
		[item.cover],
	);

	return (
		<div className="q-card flex flex-col gap-0 rounded-lg p-0 sm:flex-row sm:gap-8 sm:p-6 sm:px-10">
			{item.cover && (
				<div className="flex w-full shrink-0 items-center sm:w-40">
					<Link href="/blog/[id]" as={`/blog/${item.id}`} passHref>
						<div className="overflow-hidden rounded">
							<img
								src={coverImg}
								alt={item.title}
								draggable={false}
								className="q-img h-auto w-full cursor-pointer duration-200 hover:scale-125"
							/>
						</div>
					</Link>
				</div>
			)}
			<div className="p-6 pt-4 sm:p-0">
				<div className="hidden items-center justify-between sm:flex">
					<span className="q-secondary font-light">{item.createTime}</span>
				</div>
				<Link href="/blog/[id]" as={`/blog/${item.id}`} passHref>
					<a className="mt-2 inline-block text-xl font-bold hover:underline sm:text-2xl">
						{item.title}
					</a>
				</Link>
				<div className="q-secondary mt-2 line-clamp-2 text-sm">{item.desc}</div>
				<div className="mt-4 flex items-center justify-between">
					<Link href="/blog/[id]" as={`/blog/${item.id}`} passHref>
						<a className="q-color-primary inline-block flex-shrink-0 hover:underline">
							查看详情
						</a>
					</Link>
					<div className="block sm:hidden">
						<Link href={`/tags/${tags[0]}`} passHref>
							<a className="q-tag">{tags[0]}</a>
						</Link>
					</div>
					<div className="hidden gap-2 sm:flex">
						{tags.map((itm) => (
							<Link key={itm} href={`/tags/${itm}`} passHref>
								<a className="q-tag">{itm}</a>
							</Link>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(BlogDesc);
