import { useRef } from "react";

import { EditorMD, message } from "@/components";
import { http } from "@/utils";

const Editor = () => {
  const titleRef = useRef<HTMLInputElement>(null);
  const editorRef = useRef(null);

  const onSave = async (type: "drafts" | "save") => {
    const title = titleRef.current.value;
    const content = editorRef.current.getValue();

    const res = await http.addBlog({
      title,
      content,
      isDrafts: type === "drafts",
    });
    if (!res.error) {
      message.success("保存成功");
    }
  };

  const onReturn = () => {
    window.history.back();
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-16 items-center justify-between p-2">
        <input
          type="text"
          ref={titleRef}
          className="input-border-none flex-1 text-xl font-medium sm:text-2xl"
          placeholder="输入文章标题..."
        />
        <div>
          <button
            onClick={() => {
              onSave("drafts");
            }}
          >
            存草稿
          </button>
          <button
            onClick={() => {
              onSave("save");
            }}
          >
            发布
          </button>
          <button onClick={onReturn}>返回</button>
        </div>
      </header>
      <EditorMD ref={editorRef} />
    </div>
  );
};

export default Editor;

Editor.hiddenLayout = true;
