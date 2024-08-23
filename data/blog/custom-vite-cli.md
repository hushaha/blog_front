---
title: 自定义脚手架开发
createTime: 2024-08-23
updateTime: 2024-08-23
authors: hush
tag: cli, vite
cover: custom-vite-cli.jpg
isDrafts: true
---

## 前言

有时候想写一下对需求的分析以及最后落地的过程, 这个处理需求的思路也是可以和大家交流一下的

因为自己有想做一些小demo项目, 在技术选型上的调整会导致每次都要初始化一个脚手架, 之前写过一个脚手架, 但是那个是基于vite、react、antd的场景, 很多其他场景可能技术栈并不一致

因此想做一个基于vite的上层 `轻量` 应用脚手架, 希望支持如下需求:

- 适用于react、vue、next项目

- 适用于monorepo、单应用项目

- 开发配置默认包含 eslint、prettier、lint-staged、husky 等常用配置

- 应用配置默认包含router、store、ts、组件库等

- 支持命令行初始化项目

- 易扩展, 后续对接新技术栈

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
|   ├── xxx			# 测试脚手架工程
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

首先创建这个脚手架仓库, 先命名为 `hush-cli` , 目录结构如下

```bash
├── playground
|   ├── hush-cli  	# 测试脚手架项目
├── create-hush-cli	# 初始化脚手架工程
```

create-hush-cli 目录结构如下

```bash
├── index.js
├── template-xxx
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
		"create-hush-vite": "index.js",
		"chva": "index.js"
	},
	"scripts": {
		"dev": "unbuild --stub",
		"build": "unbuild",
		"typecheck": "tsc --noEmit"
	}
}
```

unbuild 的 `stub` 配置会开启 stub 模式, 构建产物里将会使用 jiti 来做链接, 这样构建一次其他引用的地方会引用到最新代码, 相当于 `watch` 模式, 所以这里没有用 `tsc` 去运行 src/index.ts, 这里直接打包, 在 `playground` 中测试

在 `create-hush-cli/src/index.ts` 中写入如下内容

```ts
const getVersion = () => {
	console.log("version", "1.0.0");
};

getVersion();
```

执行 `pnpm dev` 命令, 会发现 create-hush-cli 根目录产生了一个dist文件夹, 这就是stub模式下打包的产物

在 `playground` 目录中创建一个 hush-cli 文件夹, 用来测试初始化仓库, 执行如下命令:

```bash
pnpm add create-hush-cli

# 因为上述 bin 配置, 所以可以执行 chva
pnpm exec chva
```

会发现控制台打印出来了 `"version", "1.0.0"`

这里穿插介绍一下 `exec`, vite 初始化仓库命令为 `npm create vite`

```bash
npm create xxx
# 等同如下
npm exec create-xxx
```

当我们执行 create 命令时，会先补全包名为 create-xxx, 然后转换为 exec 命令执行，即 npm exec create-xxx; 接着执行包对应的 create-xxx 命令(package.json 的 bin 字段指定的命令)

所以我们需要发布一个 `create-hush-cli` 的npm包, 然后package.json中bin里边要提供 `create-hush-vite` 方法. 发布后即可通过如下方式安装

```bash
pnpm create hush-cli
```

了解 [pnpm exec](https://pnpm.io/zh/cli/exec/)

![](/images/custom-vite-cli/vite-cli-1.png)

修改一下 `getVersion` 方法返回值, 不用执行dev或者build命令, 直接继续执行 `pnpm exec chva` 会发现打印的是修改后的内容, 证明热更新成功

## 命令行初始化项目

### 初始化仓库命令

主要功能写在 `/src/index.ts` 中, 大致流程应该是:

1. 询问一些基本信息, 项目名、框架、依赖等

2. 根据用户选择的框架, 复制自己对应的项目模板过去

3. 修改项目模板中的依赖、配置等

因此开始我们的 `index.ts` 的编写



## 链接

[vite](https://github.com/vitejs/vite.git)

[prompts](https://chinabigpan.github.io/prompts_docs_cn/)
