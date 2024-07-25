import Link from "next/link";
import { FC } from "react";

interface Props {
	onClick?: (type?: string) => void;
}

const Links: FC<Props> = ({ onClick = () => {} }) => {
	return (
		<>
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
		</>
	);
};

export default Links;
