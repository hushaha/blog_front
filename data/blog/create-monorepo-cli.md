---
title: 使用 pnpm 创建 monorepo 脚手架
createTime: 2024-07-25
updateTime: 2024-07-25
authors: hush
tag: cli, vite
cover: create-monorepo-cli.jpg
---

## 前言

说一个场景

我们现在需要写一个组件库, 还需要写一个工具库, 而这个组件库依赖于工具库, 这两个库更新频率会比较高, 我希望这两个库可以分开发布. 因为写的是库, 所以我们还需要有一个示例仓库来放使用用例, 这个使用示例我们也需要同步更新且部署

因此问题来了, 我怎么在一个项目里边引用另一个库, 且快速更新发布对应的库

**方案1: 笨方法**

正常情况下我们只能启动一个项目, 将另外个项目作为依赖引入, 但如果依赖更新了, 这边也需要同步拉取最新的依赖, 这样会涉及到这个依赖需要一直发布, 或者一直本地替换依赖, 会比较麻烦

**方案2: 软链接**

高级些的做法可以是我们将依赖在本地通过软链接的方式连接起来, 具体操作如下:

将项目结构定为如下结构

```bash
├── packages
|   ├── components
|   ├── utils
```

在 `components` 目录下执行如下命令:

```bash
pnpm add ../utils
```

此时则会将utils的代码软链接到 `components` 的 node_modules 中, 且 package.json 中会添加如下依赖 `utils: "link:../utils"` , 此时在项目中可直接用 `utils` 提供的方法

**方案3: monorepo**

有个解决方案叫做 `monorepo` , 将多个项目或包文件放到一个git仓库来管理, 其中的依赖也是用软链接的形式进行相互依赖

`monorepo` 仓库大致如下文件夹结构:

```bash
├── apps
|   ├── docs
├── packages
|   ├── pkg1
|   ├── pkg2
├── package.json
```

文件名称可以自定义, 我这里使用的是 `apps` 下放置示例项目或者文档, `packages` 中放置组件库、工具库等, 每个pkg都是单独的一个项目

此时我们可以定义这整个仓库为一个 `monorepo` 仓库, `apps` 和 `packages` 文件夹下的项目都是该仓库下的项目

`pnpm` 默认支持 `monorepo` , 也可以使用 `lerna` 进行管理

下方介绍以pnpm进行管理

## 创建monorepo仓库

1. 创建一个空文件夹并执行如下命令

```shell
pnpm init
```

2. 调整 `package.json`

* 添加 `engines`, 指定node、pnpm最低版本

* 设置 `private` 属性为 `true`, 防止当前仓库整体被发布

* 添加 `workspaces`, 指定当前仓库为 monorepo 格式

```json
{
	"private": true,
	"engines": {
		"node": ">=16",
		"pnpm": ">=7"
	},
	"workspaces": ["packages/*", "apps/*"]
}
```

3. 根目录添加 `pnpm-workspace.yaml` 文件, 配置 `monorepo` 仓库信息

```yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

4. 根目录添加 `.npmrc` 文件, 填写如下内容

> 如不做这一步可能导致子模块安装子模块时只从远端安装, 不从本地安装依赖

```bash
link-workspace-packages = true 		# 启用工作区内部的包链接
prefer-workspace-packages = true 	# 优先选择工作区中的包
recursive-install = true 			# 递归地安装工作区中所有项目的依赖
```

## 初始化子仓库

我希望建立一个components组件库, 一个utils工具库, 一个doc文档库, 
这个doc文档库展示当前最新的组件和工具方法

这里我以如下仓库结构作为示例:

```bash
├── apps
|   ├── docs
├── packages
|   ├── components
|   ├── utils
├── package.json
```

因为用了 `monorepo` 格式, 所以证明我们应该会发布多个包, 因此应该用统一个命名前缀, 假设我们这里使用 `@hush` 作为前缀

### 初始化components

在 `packages` 目录下创建文件夹 `components` , 进入目录执行如下命令

```bash
pnpm create vite
```

创建完成后进入 `components/package.json` 文件中  
调整包名为 `@hush/components` , 删除 `devDependencies` 项中的 `typescript` , 因为 `ts` 将会在我们各个仓库中用到, 因此可以将公共依赖放到根目录安装

到根目录执行如下命令:

```bash
pnpm add typescript -D -w
```

`-w` 参数用来确认是在根目录安装该依赖

### 初始化utils

在 `packages` 目录下创建文件夹 `utils` , 进入目录执行如下命令

因为 `ts` 已经挪到根目录, 所以不需要安装 `typescript` , 可以直接用ts, 执行如下命令:

```bash
pnpm init -y

npx tsc --init
```

这个仓库我只放一些公共方法, 所以不需要什么脚手架

创建文件夹结构如下:

```bash
├── utils
|   ├── src
|   |   ├── index.ts
|   ├── test
|   ├── package.json
```

package.json文件修改如下:

```json
{
	"name": "@hush/utils",
	"version": "1.0.0",
	"private": false,
	"files": ["dist", "README.md"],
	"types": "./dist/index.d.ts",
	"main": "./dist/index.js",
	"module": "./dist/index.js",
	"exports": {
		"./*": "./*",
		".": {
			"types": "./dist/index.d.ts",
			"import": "./dist/index.js",
			"require": "./dist/index.js"
		}
	},
	"scripts": {
		"build": "tsc"
	}
}
```

`tsconfig.json` 配置文件中添加如下配置:

```json
{
	"rootDir": "./src",
	"outDir": "./dist",
	"declaration": true
}
```

配置 `src/index.ts` 添加一个示例方法

```ts
// index.ts
export const getVersion = () => {
	return 'V1.0.0'
}
```

此时即可执行 `pnpm build` 打包, 打包结果会放到 `dist` 目录下

### components使用utils包

先进入utils目录下执行命令

```bash
pnpm build
```

进入components目录下执行命令

```bash
pnpm add @hush/utils

// or 在根目录执行如下命令
pnpm add @hush/utils -F @hush/components
```

成功后可以看到 `components` 项目 `package.json` 文件中 `dependencies` 项中添加了 `"@hush/utils": "workspace:^",` , 
这个版本为 `workspace:^` 指的就是从本地取对应的依赖, 因此对应的依赖也需要先打包才行

此时可以看到 `components` 项目中的 `node_modules` 里的 `@hush/utils` 目录结构和项目代码一致, 是因为 monorepo 架构就是将本地依赖以软链接的形式引入

![](/images/create-monorepo-cli/code-catalog.png)

### 测试

在 `components` 项目中引用 `@hush/utils` 包中的方法, 按理说已经有ts类型提示, 访问页面确认方法正常执行即可

## 构建

根目录 `package.json` 添加如下命令:

```json
{
	"script": {
		"dev": "pnpm --filter=./apps/* --parallel dev",
		"dev:lib": "pnpm --filter=./packages/* --parallel dev",
		"build": "pnpm --filter=./apps/* build",
		"build:lib": "pnpm build:utils && pnpm build:components",
		"build:components": "pnpm build --filter=./packages/components",
		"build:utils": "pnpm build --filter=./packages/utils"
	}
}
```

 `--filter`

过滤出匹配到的项目

 `--parallel`

这是个推荐的标志, 用于在许多 packages上长时间运行的进程, 例如冗长的构建进程

 `build:lib`

 因为 components 依赖于 utils , 所以先打包 utils, 否则可能导致 components 打包失败

## 安装其他依赖

上述过程中已经安装 `typescript` 到根目录, 接下来就需要安装其他依赖

遵循只要是各仓库通用的依赖则可提到根目录的要求, 开发环境所需要的 `eslint` 、 `prettier` 、 `lint-staged` 、 `husky` 等依赖均可挪到根目录安装, 因此这些不在这里赘述操作, 详情可以看这里

[vite-react-ts-cli脚手架搭建](/blog/vite-react-ts-cli)

## Tips

1. 软链接和monorepo的区别

* `npm link`

**优点:**  
方便调试: 开发者可以在一个项目中修改库的代码, 然后立即在另一个项目中看到效果, 无需重新打包发布
节省时间: 不需要频繁地发布到 npm 仓库以进行测试

**缺点:**  
可能的不一致性: 如果多个项目链接到了同一个模块的不同版本, 可能会导致行为上的不一致
复杂性: 对于大型团队或项目, 跟踪哪些模块被链接以及它们的状态可能会比较困难
跨平台问题: npm link 在不同操作系统上可能有不同的表现, 尤其是在 Windows 上

* `monorepo`

**优点:**  
依赖一致性: 所有项目使用相同的依赖版本, 减少了版本冲突的可能性
易于协作: 项目之间更容易共享代码和资源, 简化了开发流程
简化依赖管理: 可以更有效地管理内部依赖关系, 减少外部依赖的使用

**缺点:**  
构建时间: 单一仓库可能导致构建时间变长, 因为所有项目都需要一起构建
复杂性: 大型 Monorepo 可能难以维护, 特别是在没有适当的工具和策略的情况下
初始设置成本: 设置 Monorepo 需要一定的前期投入, 比如选择合适的工具(如 Lerna, Yarn, Pnpm等)和配置
