import "bytemd/dist/index.min.css";
import "highlight.js/styles/atom-one-dark.min.css";

import footnotes from "@bytemd/plugin-footnotes";
import frontmatter from "@bytemd/plugin-frontmatter";
import gemoji from "@bytemd/plugin-gemoji";
import gfm from "@bytemd/plugin-gfm";
import highlight from "@bytemd/plugin-highlight-ssr";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import mermaid from "@bytemd/plugin-mermaid";
import { Editor, Viewer } from "@bytemd/react";
import zhHans from "bytemd/locales/zh_Hans.json";
import {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

import { Toc } from "@/components";
import { autolinkHeadingsPlugin } from "@/utils";

const plugins = [
  footnotes(),
  frontmatter(),
  gemoji(),
  highlight(),
  mediumZoom(),
  mermaid(),
  gfm(),
  autolinkHeadingsPlugin(),
];

type EditorProps = {
  onlyRead?: boolean;
  value?: string;
  onChange?: (e: string) => void;
};

const EditorMD = (
  { onlyRead = false, value: defaultValue, onChange }: EditorProps,
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
    <>
      {onlyRead ? (
        <div className="custom-markdown-body flex w-auto gap-4">
          <Viewer plugins={plugins} value={value} />
          <Toc value={value} className="max-w-64 hidden sm:block" />
        </div>
      ) : (
        <div className="custom-markdown-body">
          <Editor
            locale={zhHans}
            plugins={plugins}
            value={value}
            onChange={onValueChange}
            uploadImages={onUploadImages}
          />
        </div>
      )}
    </>
  );
};

export default forwardRef(EditorMD);
