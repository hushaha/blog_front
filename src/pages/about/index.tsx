import { GetStaticProps, InferGetStaticPropsType } from "next";
import { FC } from "react";

import { EditorMD, SEO } from "@/components";
import sHttp from "@/utils/getStaticData";

export const getStaticProps: GetStaticProps<{
	detail: string;
}> = () => {
	const detail = sHttp.getFileByName("config", "about.md");
	return { props: { detail } };
};

const About: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({
	detail,
}) => {
	return (
		<>
			<SEO title="关于我" />
			<div className="q-card mx-auto h-full max-w-4xl divide-y">
				<EditorMD onlyRead value={detail} />
			</div>
		</>
	);
};

export default About;
