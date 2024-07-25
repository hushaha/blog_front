import { SEO } from "@/components";
const My = () => {
	const skillList = [
		"React",
		"Vue3",
		"TS",
		"Vite",
		"webpack",
		"Nginx",
		"uniapp",
		"flutter",
	];
	return (
		<div className="mx-auto max-w-4xl">
			<SEO title="关于我" />
			<div className="q-card divide-y">
				<div className="pb-4 text-xl font-bold sm:text-2xl">关于我</div>
				<div className="prose w-full pt-4">
					<ul>
						<li>昵称: hush</li>
						<li>年龄: 25</li>
						<li>学历: 本科</li>
						<li>
							能力:
							{skillList.map((itm) => (
								<span className="q-tag ml-2" key={itm}>
									{itm}
								</span>
							))}
						</li>
						<li>坐标: 北京、武汉</li>
						<li>对研究低码平台、代码规范、代码思想、最佳实践、脚手架等有浓厚兴趣</li>
					</ul>
				</div>
			</div>
		</div>
	);
};

export default My;
