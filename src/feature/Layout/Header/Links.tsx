import Link from "next/link";
import { FC } from "react";

import { ThemeChange } from "@/components";

interface Props {
	onClick?: (type?: string) => void;
}

const Links: FC<Props> = ({ onClick = () => {} }) => {
	return (
		<div className="flex items-center">
			<Link href="/blog">
				<a
					className="q-color-primary-hover mx-4 font-bold"
					onClick={() => onClick("blog")}
				>
					博客
				</a>
			</Link>
			<Link href="/tags">
				<a
					className="q-color-primary-hover mx-4 font-bold"
					onClick={() => onClick("tags")}
				>
					标签
				</a>
			</Link>
			<Link href="/about">
				<a
					className="q-color-primary-hover mx-4 font-bold"
					onClick={() => onClick("about")}
				>
					关于
				</a>
			</Link>
			<span className="q-color-primary-hover mx-4 flex items-center">
				<ThemeChange />
			</span>
		</div>
	);
};

export default Links;
