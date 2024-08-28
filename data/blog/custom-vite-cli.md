---
title: 自定义脚手架开发
createTime: 2024-08-23
updateTime: 2024-08-23
authors: hush
tag: cli, vite
cover: custom-vite-cli.jpg
---

## 前言

有时候想写一下对需求的分析以及最后落地的过程, 这个处理需求的思路也是可以和大家交流一下的

因为自己有想做一些小demo项目, 在技术选型上的调整会导致每次都要初始化一个脚手架, 之前写过一个脚手架, 但是那个是基于vite、react、antd的场景, 很多其他场景可能技术栈并不一致

因此想做一个基于vite的上层 `轻量` 应用脚手架, 希望支持如下需求:

* 适用于react、vue、next项目

* 适用于monorepo、单应用项目

* 开发配置默认包含 eslint、prettier、lint-staged、husky 等常用配置

* 应用配置默认包含router、store、ts、组件库等

* 支持命令行初始化项目

* 易扩展, 后续对接新技术栈

配置如下:

| 技术栈          | 内置模块               | 可选模块                   |
| --------------- | ---------------------- | -------------------------- |
| monorepo、react | react-router、mobx、ts | antd、tailwindcss          |
| react           | react-router、mobx、ts | antd、tailwindcss          |
| monorepo、vue3  | vue-router、pinia、ts  | antd、element、tailwindcss |
| vue3            | vue-router、pinia、ts  | antd、element、tailwindcss |
| next            | ts                     | antd、tailwindcss          |

其实这个场景和 `create-vite` 一模一样, 因此也借这个机会学习一下 vite 怎么做的

## 初始化脚手架仓库

### vite脚手架

vite仓库是 `monorepo` 格式, 主要结构如下:

```bash
├── playground
|   ├── xxx			# 测试vite的工程
├── packages
|   ├── create-vite	# 初始化vite脚手架工程
|   ├── vite		# vite主要工程
```

具体看 `create-vite` 结构如下:

```bash
├── src
|   ├── index.ts    	# 入口文件
├── templates    		# 提供的vite模板集合
|   ├── template-react
├── package.json    	# 配置文件
```

使用到的依赖大致如下:

| 工具        | 作用               |
| ----------- | ------------------ |
| unbuild     | 打包工具           |
| cross-spawn | 跨平台执行node命令 |
| kolorist    | 命令行颜色输出     |
| minimist    | 解析命令行         |
| prompts     | 命令行交互         |

### hush-cli脚手架

下方参照vite脚手架的代码结构

首先创建这个脚手架仓库, 先命名为 `hush-cli` , 因为我这里不涉及多个仓库, 所以把 `create-hush-cli` 放在根目录, 目录结构如下

```bash
├── playground
|   ├── hush-cli  	# 测试脚手架项目
├── create-hush-cli	# 初始化脚手架工程
```

create-hush-cli 目录结构如下

```bash
├── index.js
├── templates
├── src
|   ├── index.ts
```

根目录安装 ts, create-hush-cli 目录中安装上述vite中的依赖

```bash
pnpm add typescript -D -w

pnpm add unbuild kolorist minimist prompts @types/minimist @types/prompts -F create-hush-cli
```

在 `create-hush-cli/package.json` 写下如下命令:

```json
{
	"bin": {
		"create-hush-cli": "index.js",
		"chc": "index.js"
	},
	"files": ["index.js", "templates", "dist"],
	"scripts": {
		"dev": "unbuild --stub",
		"build": "unbuild",
		"typecheck": "tsc --noEmit"
	}
}
```

unbuild 的 `stub` 配置会开启 stub 模式, 构建产物里将会使用 jiti 来做链接, 这样构建一次其他引用的地方会引用到最新代码, 相当于 `watch` 模式, 所以这里没有用 `tsc` 去运行 src/index.ts, 这里 `dev` 命令直接打包, 在 `playground` 中测试

在 `create-hush-cli/src/index.ts` 中写入如下内容

```ts
const getVersion = () => {
	console.log("version", "1.0.0");
};

getVersion();
```

执行 `pnpm dev` 命令, 会发现 create-hush-cli 根目录产生了一个dist文件夹, 这就是stub模式下打包的产物

![](/images/custom-vite-cli/vite-cli-2.png)

在 `playground` 目录中创建一个 hush-cli 文件夹, 用来测试初始化仓库, 执行如下命令:

```bash
pnpm add create-hush-cli

# 因为上述 bin 配置, 所以可以执行 chc
pnpm exec chc
```

会发现控制台打印出来了 `"version", "1.0.0"`

这里穿插介绍一下 `exec` , vite 初始化仓库命令为 `npm create vite`

```bash
npm create xxx
# 等同如下
npm exec create-xxx
```

当我们执行 create 命令时，会先补全包名为 create-xxx, 然后转换为 exec 命令执行，即 npm exec create-xxx; 接着执行包对应的 create-xxx 命令(package.json 的 bin 字段指定的命令)

所以我们需要发布一个 `create-hush-cli` 的npm包, 然后package.json中bin里边要提供 `create-hush-cli` 方法. 发布后即可通过如下方式安装

```bash
pnpm create hush-cli
```

了解 [pnpm exec](https://pnpm.io/zh/cli/exec/)

![](/images/custom-vite-cli/vite-cli-1.png)

修改一下 `getVersion` 方法返回值, 不用执行dev或者build命令, 直接继续执行 `pnpm exec chva` 会发现打印的是修改后的内容, 证明热更新成功

以上我的脚手架仓库创建好了, 后续开发流程为在 `create-hush-cli` 中添加脚手架模板, 执行 `pnpm dev` , 在 `playground` 中测试

## 命令行初始化项目

主要功能写在 `/src/index.ts` 中, 大致流程应该是:

1. 询问一些基本信息, 项目名、框架、依赖等

2. 根据用户选择的框架, 复制自己对应的项目模板过去

3. 修改项目模板中的依赖、配置等

### 命令行交互

因此开始我们的 `index.ts` 的编写

首先看下vite脚手架初始化时是什么流程:

在控制台输入 `pnpm create vite` , 展示如下一些信息

![](/images/custom-vite-cli/vite-cli-3.png)

提示让我们填写项目名, 且直接回车会填写默认值 `vite-project` , 继续往下, 发现一共是询问如下几个信息

![](/images/custom-vite-cli/vite-cli-4.png)

1. 询问项目名
2. 询问框架
3. 询问配置, (ts, swc等)

这里使用 `prompts` 插件完成交互, 用 `kolorist` 做样式输出

因此我们的 `index.ts` 代码如下(做下简化, 以防代码量太大):

```ts
import prompts from "prompts";
import { blue, cyan, green, magenta, red, reset, yellow } from "kolorist";

const init = () => {
	let result: prompts.Answers<
		| "projectName"
		| "overwrite"
		| "packageName"
		| "framework"
		| "cliType"
		| "variant"
	>;

	try {
		result = await prompts(
			[
				{
					type: "text",
					name: "projectName",
					message: reset("Project name:"),
					initial: "hush-project",
				},
				{
					type: "select",
					name: "framework",
					message: reset("Select a framework:"),
					initial: 0,
					choices: [
						{
							title: 'React',
							value: 'react'
						},
						{
							title: 'Vue',
							value: 'vue'
						}
					]
				},
			],
			{
				onCancel: () => {
					throw new Error(red("✖") + " Operation cancelled");
				},
			},
		)
	} catch (cancelled: any) {
		console.log(cancelled.message);
		return;
	}
}

init();
```

实际代码中这里会更加完善, 这里不做完整代码展示

1. 如果 `projectName` 文件夹名称已存在则提示文件夹已存在, 是删除原文件夹继续还是退出还是将之前Ignore掉再继续

2. 若 `projectName` 不符合 `package.json` 的name规范, 则需要输入package name

3. 选择对应的框架时后续展示的分支会有所不同, react中才有swc选项

因此上述第一步 `prompts` 流程完毕后, 我们获取到 `result` 信息, 接下来即可执行第二步初始化项目仓库了

### 初始化项目仓库

我们的模板都放在 `templates` 文件夹下, 该文件夹结构如下

```bash
├── templates    		# 提供的vite模板集合
|   ├── template-react
|   ├── template-react-mo
|   ├── template-vue
|   ├── template-vue-mo
|   ├── template-next
```

因此我们要根据用户选择的框架, 获取对应的模板文件夹, 然后复制到 `projectName` 文件夹中, 实现如下(简化版):

```ts
import path from "node:path";
import { fileURLToPath } from "node:url";

const cwd = process.cwd();

const root = path.join(cwd, result.projectName);

// 创建文件夹
fs.mkdirSync(root, { recursive: true });

// 获取目标路径
const targetPath = path.join(root);

// 获取模板文件夹(需要确保templates下已经存在该模板)
const templateDir = path.resolve(
	fileURLToPath(import.meta.url),
	"../../templates/",
	`template-${framework.name}`,
);

// 复制模板到目标路径
copy(templateDir, targetPath);
```

其中 copy 辅助方法如下:

```ts
function copyDir(srcDir: string, destDir: string) {
	fs.mkdirSync(destDir, { recursive: true });
	for (const file of fs.readdirSync(srcDir)) {
		const srcFile = path.resolve(srcDir, file);
		const destFile = path.resolve(destDir, file);
		copy(srcFile, destFile);
	}
}

function copy(src: string, dest: string) {
	const stat = fs.statSync(src);
	if (stat.isDirectory()) {
		copyDir(src, dest);
	} else {
		fs.copyFileSync(src, dest);
	}
}
```

测试一下, 建立一个 `templates/template-react` , 里边写入一个 `index.ts` 测试文件

再去 `playground/hush-cli` 下执行 `pnpm exec chc` , 该仓库上述已经建立过, 已经安装了 `create-hush-cli` , 所以可以直接执行 `pnpm exec chc`

效果如下:

1. 输入项目名
   ![](/images/custom-vite-cli/vite-cli-5.png)

2. 选择技术栈
   ![](/images/custom-vite-cli/vite-cli-6.png)

3. 选择仓库类型
   ![](/images/custom-vite-cli/vite-cli-7.png)

4. 选择依赖
   ![](/images/custom-vite-cli/vite-cli-8.png)

完成后会在 `playground/hush-cli` 下生成一个 `hush-project` 文件夹, 里边有 `index.ts` 文件

![](/images/custom-vite-cli/vite-cli-9.png)

至此通过命令行初始化项目可以了, 接下来做第三步修改项目模板中的一些配置等

### 修改项目模板配置信息

修改 `package.json` 中的项目名:

```ts
const targetPath = path.join(root);
const pkgPath = path.join(targetPath, `package.json`);
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

pkg.name = result.packageName || result.projectName;

fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");
```

接下来我们需要完善 `templates` 下的脚手架仓库

这里拿react脚手架做示例, 我们需要预安装如下插件:

| 插件名称         | 作用                |
| ---------------- | ------------------- |
| initialize-css   | 样式初始化          |
| mobx             | 状态管理            |
| tailwindcss      | 样式框架            |
| eslint           | 代码校验工具        |
| prettier         | 代码格式化工具      |
| lint-staged      | 暂存区代码处理工具  |
| husky            | git hook 工具       |
| commitlint       | git提交命令校验工具 |
| @hushaha/request | 请求工具            |

因此我们需要依次安装此些插件

代码目录结构如下:

```bash
|-- src
    |-- assets  	# 样式以及图片
    |-- components  # 基础组件
    |-- config      # 公共配置
    |-- features    # 业务组件
    |-- pages       # 路由对应页面
    |-- routers   	# 路由配置
    |-- stores      # 全局状态
    |-- types       # types
    |-- utils       # 工具库
    |-- App.tsx		# 主组件
    |-- main.tsx	# 入口文件
```

`@hushaha/request` 库的使用方法可以查看这篇文章:
[q-request](https://blog.hushaha.top/blog/q-request)

## 链接

[create-hush-cli](https://github.com/hushaha/hush-cli.git)

[vite-git仓库](https://github.com/vitejs/vite.git)

[prompts官网](https://chinabigpan.github.io/prompts_docs_cn/)

[博客地址](https://blog.hushaha.top)

[q-request](https://blog.hushaha.top/blog/q-request)
