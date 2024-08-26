---
title: bytemd使用
createTime: 2024-07-04
updateTime: 2024-07-04
authors: hush
tag: js
cover: bytemd-use.jpg
---

## 前言

**官方介绍如下:**
ByteMD 是一个使用 Svelte 构建的 Markdown 编辑器组件. 它也可以在其他库/框架中使用

**特性如下:**

- 轻量级且与框架无关

- 易于扩展

- 默认安全

- 兼容 SSR

因此本文介绍一下基本用法, 跟着这篇文章你能搭建出一个掘金同款md编辑器

## 基本使用

### 安装

```bash
pnpm add bytemd
```

### 用法

bytemd有两个组件: `Editor` 和 `Viewer` .
`Editor` 顾名思义，是 Markdown 编辑器; `Viewer` 通常用于显示渲染的 Markdown 结果而无需编辑.
在使用组件之前，记得导入CSS文件以确保样式正确:

```js
import "bytemd/dist/index.css";
```

### 使用示例

```tsx
import { Editor, Viewer } from "@bytemd/react";
import zhHans from "bytemd/locales/zh_Hans.json";
import "bytemd/dist/index.min.css";
import "highlight.js/styles/atom-one-dark.min.css";

const plugins = [];

type Props = {
  onlyRead?: boolean;
  defaultValue?: string;
  onChange?: (e: string) => void;
};

const EditorMD:FC<Props> = ({ onlyRead, defaultValue, onChange }) => {
	const [value, setValue] = useState(() => defaultValue || "");

  useEffect(() => {
    setValue(defaultValue || "");
  }, [defaultValue]);

  const onValueChange = (e: string) => {
    setValue(e);
    onChange && onChange(e);
  };

  return (
    {onlyRead ? (
      <Viewer plugins={plugins} value={value} />
    ) : (
      <Editor
        locale={zhHans}
        plugins={plugins}
        value={value}
        onChange={onValueChange}
      />
    )}
  )
}
```

### 风格定制

**编辑器**

ByteMD Editor 默认高度为 `300px` . 可以使用 CSS 进行覆盖:

```css
.bytemd {
	height: calc(100vh - 200px);
}
```

**渲染器**

ByteMD Viewer 默认没有内置样式, 可以使用第三方 markdown 主题
这里选择**juejin**样式, 我选择将样式文件直接down下来放本地, 样式地址https://github.com/xitu/juejin-markdown-theme-default
使用 `atom-one-dark` 作为代码样式, 使用如下

```js
import "highlight.js/styles/atom-one-dark.min.css";
```

## 插件配置

### 安装插件

官方插件列表如下:

| 插件名称                                                                                                    | 插件备注                                                             |
| ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| [@bytemd/plugin-breaks](https://github.com/bytedance/bytemd/tree/main/packages/plugin-breaks)               | 默认md渲染时硬换行需要双空格或者双回车, 该插件确保正常回车即可硬换行 |
| [@bytemd/plugin-frontmatter](https://github.com/bytedance/bytemd/tree/main/packages/plugin-frontmatter)     | 解析元数据                                                           |
| [@bytemd/plugin-gemoji](https://github.com/bytedance/bytemd/tree/main/packages/plugin-gemoji)               | 解析gemoji表情                                                       |
| [@bytemd/plugin-gfm](https://github.com/bytedance/bytemd/tree/main/packages/plugin-gfm)                     | 支持GFM(自动链接文字、删除、表格、任务列表)                          |
| [@bytemd/plugin-highlight](https://github.com/bytedance/bytemd/tree/main/packages/plugin-highlight)         | 代码高亮                                                             |
| [@bytemd/plugin-highlight-ssr](https://github.com/bytedance/bytemd/tree/main/packages/plugin-highlight-ssr) | 代码高亮ssr版本                                                      |
| [@bytemd/plugin-math](https://github.com/bytedance/bytemd/tree/main/packages/plugin-math)                   | 支持数学公式                                                         |
| [@bytemd/plugin-math-ssr](https://github.com/bytedance/bytemd/tree/main/packages/plugin-math-ssr)           | 支持数学公式ssr版本                                                  |
| [@bytemd/plugin-medium-zoom](https://github.com/bytedance/bytemd/tree/main/packages/plugin-medium-zoom)     | 支持点击图片放大预览                                                 |
| [@bytemd/plugin-mermaid](https://github.com/bytedance/bytemd/tree/main/packages/plugin-mermaid)             | 支持流程图                                                           |

### 自定义插件

**官方文档提示如下:**

ByteMD 使用 [remark](https://github.com/remarkjs/remark) 和 [rehype](https://github.com/rehypejs/rehype) 生态系统来处理 Markdown. 完整流程如下:

1. Markdown 文本被解析为[AST](https://github.com/syntax-tree/mdast)
2. Markdown AST 可以通过多种[注释插件进行操作](https://github.com/remarkjs/remark/blob/main/doc/plugins.md)
3. Markdown AST 转换为 HTML AST
4. 出于安全原因，HTML AST 已被清理
5. HTML AST 可以被多个[rehype 插件操纵](https://github.com/rehypejs/rehype/blob/main/doc/plugins.md)
6. HTML AST 被字符串化为 HTML
7. HTML 渲染后的一些额外 DOM 操作

它也可以描述为流程图:
![](/images/bytemd-use/flowchart.png)

2、5、7步骤是通过ByteMD插件API进行用户定制的.

官方文档以 `plugin-math` 作为例子解释了如何编写插件

这里我再补充几个插件:

#### 添加锚点插件

需要给md加上目录，且支持锚点跳转，因此需要做两件事情

1. 给标题添加id
2. 解析md文档提出目录列表，再自定义渲染成目录

因为bytemd底层用的是remark、rehype，因此查找rehype插件，这里用到的是[ `rehype-slug` ](https://github.com/rehypejs/rehype-slug)插件, 该插件能获取到所有标题标签并为其添加id

**代码如下:**

```ts
import type { BytemdPlugin } from "bytemd";
import rehypeSlug from "rehype-slug";

const autolinkHeadingsPlugin = (): BytemdPlugin => {
	return {
		rehype: (processor) => processor.use(rehypeSlug),
	};
};
```

上面只是给解析的md做处理, 将md生成的html标签中添加锚点, 还需要渲染出一个目录出来, 点击目录跳转到对应的锚点, 这里使用一个插件 [ `remark-extract-toc` ](https://github.com/inokawa/remark-extract-toc) 去解析获取md文档的目录数据

```ts
import toc from "remark-extract-toc";
import markdown from "remark-parse";
import { unified } from "unified";

const getTocTree = (val: string): TocTree => {
	try {
		const processor = unified().use(markdown, { commonmark: true }).use(toc);
		const node = processor.parse(val);
		const tree = processor.runSync(node);
		return tree as unknown as TocTree;
	} catch (error) {
		return [];
	}
};
```

`getTocTree` 方法会返回一个tree-list, 包含的就是目录数据, 根据这个数据自定义渲染目录即可.

#### 添加copy按钮插件

bytemd默认渲染的出来的就是最简单的html，代码块是解析成 `pre > code` 标签, 因此是不带任何额外功能的，我们希望在代码块的右上角有个copy按钮.

这个事情应当在创建好dom之后处理，因此实在effect生命周期中操作

**代码如下:**

```ts
import type { BytemdPlugin } from "bytemd";

const codeCopyPlugin = (): BytemdPlugin => {
	const createCopyDom = (text: any): HTMLElement => {
		const copyDom = document.createElement("div");
		copyDom.className =
			"icon-[ph--copy-bold] absolute right-2 top-2 cursor-pointer";
		copyDom.addEventListener("click", () => {
			copyToClipboard(text);
			message.info({
				title: "系统通知",
				content: "复制成功",
			});
		});
		return copyDom;
	};

	return {
		viewerEffect: ({ markdownBody }) => {
			// 获取所有code标签
			const els = markdownBody.querySelectorAll("pre>code");
			if (els.length === 0) return;

			// 往pre标签中append copy节点
			els.forEach((itm: HTMLElement) => {
				itm.parentNode.appendChild(createCopyDom(itm.innerText));
			});
		},
	};
};
```

#### 添加代码块行号插件

希望给代码块添加行号功能，找到[ `rehype-highlight-code-lines` ](https://github.com/ipikuka/rehype-highlight-code-lines)

**代码如下:**

```ts
import type { BytemdPlugin } from "bytemd";
import rehypeHighlightCodeLines from "rehype-highlight-code-lines";

const highlightCodeLinesPlugin = (): BytemdPlugin => {
	return {
		rehype: (processor) =>
			processor
				// @ts-ignore
				// 添加代码行号
				.use(rehypeHighlightCodeLines, {
					showLineNumbers: true,
					lineContainerTagName: "div",
				}),
	};
};
```

#### 插件使用

基于上方使用示例中plugins为空数组，使用插件时补充到该数组中即可

```ts
import breaks from "@bytemd/plugin-breaks";
import gemoji from "@bytemd/plugin-gemoji";
import gfm from "@bytemd/plugin-gfm";
import gfmZhHans from "@bytemd/plugin-gfm/locales/zh_Hans.json";
import highlightSSR from "@bytemd/plugin-highlight-ssr";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import {
	autolinkHeadingsPlugin,
	codeCopyPlugin,
	highlightCodeLinesPlugin,
} from "@/bytemd-plugins";

const plugins = [
	breaks(),
	gemoji(),
	gfm({ locale: gfmZhHans }),
	highlightSSR(),
	mediumZoom(),
	autolinkHeadingsPlugin(),
	codeCopyPlugin(),
	highlightCodeLinesPlugin(),
];
```

### Tips

1. 目录中包含特殊字符可能导致锚点跳转失效  
   这里使用的是 `rehype-slug` 给标题添加id, id源于标签内容, 但是id中不能包含特殊字符, 因此需要将特殊字符替换为另一个关键字, 因此最好避免在标题中使用特殊字符

## 链接

[官方文档](https://bytemd.js.org/#options)

[示例代码](https://github.com/hushaha/blog_front/blob/master/src/components/EditorMD/index.tsx)

[博客地址](https://blog.hushaha.top)

[rehype-slug](https://github.com/rehypejs/rehype-slug)

[remark-extract-toc](https://github.com/inokawa/remark-extract-toc)

[rehype-highlight-code-lines](https://github.com/ipikuka/rehype-highlight-code-lines)
