---
title: vite-react脚手架搭建
createTime: 2024-08-20
updateTime: 2024-08-20
authors: hush
tag: cli, react, typescript, vite
cover: vite-react-ts-cli.jpg
---

## 前言

找个前端规范的最佳实践, 先从脚手架开始, 该脚手架只会提供最基础的功能, 上层功能还得继续封装

该脚手架支持如下功能:

1. tailwindCSS
2. react-router、mobx
3. error-boundary
4. eslint、prettier、commitlint、lint-staged

## 创建基础脚手架模版

1. 在node安装的情况下，本文用 `pnpm` 进行安装

   先执行如下命令

```bash
   pnpm create vite
```

选择 `template` 为 `react-ts`

2. 选择使用 `pnpm` 管理包工具，执行如下命令即安装依赖且启动项目服务

```bash
   pnpm i
   pnpm dev
```

3. 删除多余文件, 只保留 `main.tsx`、`App.tsx` 文件,并移除tsx文件中引用的各项依赖

```bash
|-- src
    |-- App.tsx     # 主组件
    |-- main.tsx    # 入口文件
```

将src文件夹下添加如下文件夹

```bash
|-- src
    |-- assets      # 样式以及图片
    |-- components  # 基础组件
    |-- config      # 公共配置
    |-- features    # 业务组件
    |-- pages       # 路由对应页面
    |-- routers     # 路由配置
    |-- stores      # 全局状态
    |-- types       # types
    |-- utils       # 工具库
    |-- App.tsx     # 主组件
    |-- main.tsx    # 入口文件
```

## 集成开发插件

开发环境支持配置如下:

1. 支持别名
2. 支持接口代理
3. 集成eslint、eslint-plugin-simple-import-sort, 支持格式化导入项
4. 集成prettier
5. 集成husky、commitlint、lint-staged等
6. 集成unplugin-auto-import, 自动导入常用api

### 配置alias

先安装 `@types/node`

```bash
pnpm add -D @types/node
```

编辑 `vite.config.ts` 文件

```ts
import { resolve } from "path";

export default defineConfig({
	resolve: {
		alias: {
			"@": resolve(__dirname, "./src"),
		},
		extensions: [".js", ".json", ".ts", "tsx"],
	},
});
```

编辑 `tsconfig.json` 文件, 添加如下配置

```ts
"compilerOptions":{
  "baseUrl": ".",
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

### 配置proxy

编辑 `vite.config.ts` 文件, 这里根据自身需求来

```ts
server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8001',
        changeOrigin: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
```

### 集成eslint

vite 默认已经集成了eslint, 因此这里我先不做补充, 直接集成 `eslint-plugin-simple-import-sort`

```bash
pnpm add -D eslint-plugin-simple-import-sort
```

补充 `eslint.config.js` 文件:

```js
import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default tseslint.config({
    ignores: ["dist", "node_modules"]
}, {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
        ecmaVersion: 2020,
        globals: globals.browser,
    },
    plugins: {
        "react-hooks": reactHooks,
        "react-refresh": reactRefresh,
        "simple-import-sort": simpleImportSort,
    },
    rules: {
        ...reactHooks.configs.recommended.rules,
        "react-refresh/only-export-components": [
            "warn",
            {
                allowConstantExport: true
            },
        ],
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",
    },
}, );
```

### 集成prettier

因为这里会使用 `tailwindCSS` , 所以先把 `tailwindCSS` 插件先一并装上

```bash
pnpm add -D prettier prettier-plugin-tailwindcss
```

根目录创建 `.prettierrc` 文件, 写入如下内容, 这里的规则可以自行修改, 我只提供一个示例

```json
{
	"useTabs": true,
	"tabWidth": 2,
	"printWidth": 100,
	"singleQuote": true,
	"trailingComma": "none",
	"bracketSpacing": true,
	"semi": true,
	"plugins": ["prettier-plugin-tailwindcss"],
	"tailwindConfig": "./tailwind.config.js"
}
```

### 集成提交三件套

提交三件套为 `husky` 、 `lint-staged` 、 `commitlint` , 主要是对提交时做文件校验以及提交文案校验

此时 husky 版本来到v9

```bash
pnpm add -D husky lint-staged @commitlint/cli @commitlint/config-conventional
```

修改 `package.json` 文件如下:

```json
{
	"scripts": {
		"prepare": "husky",
		"lint": "eslint .",
		"prettier": "prettier --write **.{tsx,ts,json}",
		"lint-staged": "lint-staged"
		// ...
	},
	"lint-staged": {
		"*.{js,ts,tsx,jsx}": ["pnpm eslint"],
		"*.{js,ts,tsx,jsx,css,less,scss}": ["pnpm prettier"]
	}
}
```

执行 `pnpm prepare` 命令, 会自动生成 `.husky` 文件夹, 里边手动创建 `commit-msg` 文件写入如下内容:

```bash
npx --no -- commitlint --edit \
```

手动创建 `pre-commit` 文件，写入如下内容:

```bash
pnpm lint-staged
```

根目录添加 `commitlint.config.js` 文件

```js
export default {
    extends: ["@commitlint/config-conventional"],
    // 以下时我们自定义的规则
    rules: {
        "subject-case": [0],
        "type-enum": [
            2,
            "always",
            [
                "bug", // 此项特别针对bug号，用于向测试反馈bug列表的bug修改情况
                "feat", // 新功能（feature）
                "fix", // 修补bug
                "docs", // 文档（documentation）
                "style", // 格式（不影响代码运行的变动）
                "refactor", // 重构（即不是新增功能，也不是修改bug的代码变动）
                "test", // 增加测试
                "chore", // 构建过程或辅助工具的变动
                "revert", // feat(pencil): add ‘graphiteWidth’ option (撤销之前的commit)
                "merge", // 合并分支， 例如： merge（前端页面）： feature-xxxx修改线程地址
            ],
        ],
    },
};
```

此时完成配置, 测试一下, 提交一个错误的文件提交

![](/images/vite-react-ts-cli/vite-react-cli1.png)

上述报错阻止提交成功, 证明lint-staged 配置成功

继续测试提交一个正确的文件, 但是 commit 语句不规范, 按照 `git commit -m "123"` 提交

![](/images/vite-react-ts-cli/vite-react-cli2.png)

此时也报错, 提示没有 subject 以及 type, 因此补充完整结构再次提交, `git commit -m "feat: init"` , 此时成功提交

![](/images/vite-react-ts-cli/vite-react-cli3.png)

### 集成自动引入api

使用 `unplugin-auto-import` 插件

```bash
pnpm add -D unplugin-auto-import
```

修改 `vite.config.ts` 文件

```js
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig({
    plugins: [
        react(),
        AutoImport({
            imports: ["react", "mobx", "react-router", "react-router-dom"],
        }),
    ],
    // ...
});
```

编写 `app.tsx` 文件, 引入useState, 但不需要 import 语句, 重新 `pnpm dev`

发现根目录多了一个 `auto-imports.d.ts` 文件, 这个文件就是相当于ts类型声明文件, 将项目中用到的api类型从对应的插件中导入, 防止代码报错, 在编译时会自动引入对应的插件

这个文件需要在 `tsconfig.json` 中引入一下, 且不需要提交, 因此修改 `tsconfig.json` 文件 `include` 配置

```json
{
	"include": ["src", "src/vite-env.d.ts", "auto-imports.d.ts"]
}
```

在 `.gitignore` 中添加 `auto-imports.d.ts`

## 集成应用插件

### 集成react-router-dom

执行如下命令安装 `react-router-dom` , 此时 `react-router` 版本到了6

```bash
pnpm add react-router-dom
```

在 `routers` 文件夹下创建 `index.tsx` 文件，并写入

```tsx
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';

const Home = lazy(() => import('@/pages/Home/index.tsx'));
const About = lazy(() => import('@/pages/About/index.tsx'));
const NotFound = lazy(() => import('@/features/NotFound/index.tsx'));

const routers = [
  {
		path: '/',
		element: <Navigate to="/home" replace={true} />
	},
	{
		path: '/home',
		element: <Home />
	},
	{
		path: '/about',
		element: <About />
	},
	{
		path: '*',
		element: <NotFound />
	}
];

const browserRouter = createBrowserRouter(routers);

const Routes = () => <RouterProvider router={browserRouter} />;

export default Routes;

```

其中 `About` 和 `Home` 为在 `pages` 中定义好的组件，内容随意

### 集成react-error-boundary

`react-error-boundary` 用来捕获组件错误

编辑 `app.tsx` 文件中写入如下代码

```tsx
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import { ErrorFallback, Loading } from '@/features';

import Routes from './routers/index.tsx';

function App() {
	return (
		<>
			<Suspense fallback={<Loading />}>
				<ErrorBoundary fallback={<ErrorFallback />}>
					<Routes />
				</ErrorBoundary>
			</Suspense>
		</>
	);
}

export default App;
```

ErrorFallback, Loading 为 `features` 中的组件，具体可以自行定义内容

### 集成Mobx

引入 mobx 作为状态管理

```bash
pnpm add mobx mobx-react
```

在 `stores` 文件夹中创建 index.ts 文件 和 countStore.ts 示例文件

编写 countStore.ts 文件

```ts
import { action, makeObservable, observable } from 'mobx';

class CounterStore {
	constructor() {
		makeObservable(this, {
			count: observable,
			increment: action,
		});
	}

	count = 0;

	increment() {
		console.log(this);
		this.count++;
	}
}
export default new CounterStore();
```

在 `index.ts` 进行统一导出

```ts
import countStore from './countStore';

export { countStore };
```

### 集成tailwindcss

安装如下依赖:

```bash
pnpm add -D tailwindcss postcss autoprefixer
```

这里使用 iconify 中的 icon 组件, 因此继续安装如下两个插件, 如果你不用这个组件库可以忽略

```bash
pnpm add -D @iconify/json @iconify/tailwind
```

根目录新建文件 `tailwind.config.js` , 写入如下内容:

```js
const {
    addDynamicIconSelectors
} = require("@iconify/tailwind");

export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {},
    },
    plugins: [addDynamicIconSelectors()],
};
```

根目录新建文件 `postcss.config.js` , 写入如下内容:

```js
export default {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
    },
};
```

在 assets/styles/index.css 顶部添加如下内容:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

该css应在 `main.tsx` 中被引用

此时 tailwindcss 已经集成完毕, 在 app.tsx 中测试一下

写入一个div类名

```tsx
function App() {
	return (
		<>
			<button className="rounded-md border px-5 py-2 hover:shadow-md">
				test
			</button>
			<button className="icon-[ep--menu]" />
		</>
	);
}

export default App;
```

展示效果如下:

![](/images/vite-react-ts-cli/vite-react-cli4.png)

`icon-[ep--menu]` 为 iconify 的图标, 可以在 [iconify](https://icon-sets.iconify.design/) 中找到

### 集成请求库

我这里使用的是自己封装的 `@hushaha/request` , 如果你使用axios或者fetch则可以跳过这里

```bash
pnpm add @hushaha/request
```

在 utils/request/index.ts 中添加如下代码

```ts
import { createRequest } from '@hushaha/request';

import { apis, APISchemaRes } from './schema';

const { apiList: http } = createRequest<APISchemaRes>(
	{
		baseURL: '/api'
	},
	apis
);

export { http };
```

在 utils/request/schema.ts 中添加如下代码

```ts
import type { APISchemaResponse, ApiSchemas } from '@hushaha/request';

export interface APISchemaRes extends APISchemaResponse {
	getUser: {
		request: {
			petId: string;
		};
		response: {
			code: number;
			data: {
				id: number;
				name: string;
			};
		};
	};
}

export const apis: ApiSchemas<APISchemaRes> = {
	getUser: {
		path: 'GET pet/:petId',
		headers: {
			'Content-Type': 'application/json'
		}
	}
};
```

此时即可在组件中通过如下方式调取接口

```tsx
import { http } from '@/utils';

const getUserData = async () => {
  const res = await http.getUser({ petId: '1' })
}
```

## tips

这整篇文章代码量居多, 具体的每个插件更新迭代速度比较快, 大版本更新可能会导致使用方法有差异, 因此最好的方式是知道自己想要什么, 然后针对性去看对应文档的使用方法, 再逐步集成

主要常用的插件如上方介绍, 如果有新的好使的插件可以自行封装进去, 至于其他的技术栈脚手架, 道理都是一样的, 主要分为开发插件及应用插件, 开发插件大同小异, 应用插件按照业务场景来, 因此无论是 next、vue、monorepo仓库等, 都可以参照这个流程进行封装

这个脚手架已经集成到我的 hush-cli 脚手架中, 可以通过如下命令快速创建

```bash
pnpm create hush-cli
```

hush-cli 就是一个基于vite二次封装的脚手架库, 把常用的插件封装进去了, 后续会继续补充更多插件类型以及使用示例, 可以向我提 issues 一起维护

## 参考

[博客地址](https://blog.hushaha.top)

[q-request](https://blog.hushaha.top/blog/q-request)

[create-hush-cli](https://github.com/hushaha/hush-cli.git)

[iconify](https://icon-sets.iconify.design/)

[tailwindcss](https://www.tailwindcss.cn/)
