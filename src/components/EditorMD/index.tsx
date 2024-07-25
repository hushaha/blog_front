import "bytemd/dist/index.min.css";
import "highlight.js/styles/atom-one-dark.min.css";

import gemoji from "@bytemd/plugin-gemoji";
import gfm from "@bytemd/plugin-gfm";
import gfmZhHans from "@bytemd/plugin-gfm/locales/zh_Hans.json";
import highlightSSR from "@bytemd/plugin-highlight-ssr";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import { Editor, Viewer } from "@bytemd/react";
import zhHans from "bytemd/locales/zh_Hans.json";
import {
	forwardRef,
	Ref,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";

import {
	autolinkHeadingsPlugin,
	codeCopyPlugin,
	highlightCodeLinesPlugin,
	targetBlankLink,
} from "@/utils/bytemdPlugin";

const plugins = [
	gemoji(),
	gfm({ locale: gfmZhHans }),
	highlightSSR(),
	mediumZoom(),
	autolinkHeadingsPlugin(),
	codeCopyPlugin(),
	highlightCodeLinesPlugin(),
	targetBlankLink(),
];

type EditorProps = {
	onlyRead?: boolean;
	value?: string;
	onChange?: (e: string) => void;
	className?: string;
};

const EditorMD = (
	{ onlyRead = false, value: defaultValue, className, onChange }: EditorProps,
	ref: Ref<unknown>,
) => {
	const [value, setValue] = useState(() => defaultValue || "");

	useEffect(() => {
		setValue(defaultValue || "");
	}, [defaultValue]);

	const onValueChange = (e: string) => {
		setValue(e);
		onChange && onChange(e);
	};

	const onUploadImages = (files: File[]) => {
		return Promise.all(
			files.map(async () => ({ alt: "", title: "", url: "" })),
		);
	};

	useImperativeHandle(ref, () => ({
		getValue: () => value,
	}));

	return (
		<div className={`custom-markdown-body ${className}`}>
			{onlyRead ? (
				<Viewer plugins={plugins} value={value} />
			) : (
				<Editor
					locale={zhHans}
					plugins={plugins}
					value={value}
					onChange={onValueChange}
					uploadImages={onUploadImages}
				/>
			)}
		</div>
	);
};

export default forwardRef(EditorMD);
