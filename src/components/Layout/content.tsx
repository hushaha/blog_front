import { FC, memo, ReactNode } from "react";

interface Props {
  title: string;
  onSearch: (s: string) => void;
  children: ReactNode;
}

const Content: FC<Props> = ({ title, onSearch, children }) => {
  const onEnter = (e: any) => {
    if (e.keyCode === 13 || e.which === 13) {
      onSearch(e.target.value);
    }
  };
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-bold sm:text-2xl">{title}</h1>
        <input
          type="text"
          className="q-input w-full sm:w-2/5"
          placeholder="请输入关键字回车搜索"
          onKeyUp={onEnter}
        />
      </div>
      {children}
    </div>
  );
};

export default memo(Content);
