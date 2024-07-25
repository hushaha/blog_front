---
title: vercel+next搭建服务端渲染博客(SSG)
createTime: 2023-09-01
updateTime: 2023-09-01
authors: hush
tag: blog, Next, TailwindCSS
cover: blog-ssg.jpg
---

## 前言

结合之前 `CSR` 提出的问题的场景, 我希望页面能够秒开, 所以选择博客页面还是由 `SSG` 方式渲染, 将阅读量、评论等功能对接后台.

## 准备工作

### SSG是什么 (静态站点生成)

SSG（Static Site Generation）是一种在构建时生成静态HTML页面的技术. 在这种模式下, 开发者会编写一些模板文件和数据文件, 然后使用构建工具（如Hugo、Gatsby等）将这些文件转换为静态的HTML页面. 这些页面可以直接部署到服务器上, 而不需要服务器进行实时渲染. 

**优点:**  
性能卓越: 由于页面是静态的, 因此无需等待服务器渲染, 直接由浏览器加载显示, 具有出色的性能.  
安全性高: 由于服务器只提供静态文件, 因此降低了遭受攻击的风险.  
适合内容型网站: 对于内容更新不频繁的内容型网站(如博客、文档网站等), SSG是一个很好的选择.

**缺点:**  
服务器压力大: 对于每个请求, 服务器都需要重新渲染页面, 这可能导致服务器压力过大.  
开发限制: SSR要求开发者在编写Vue组件时, 需要考虑到服务器端和客户端环境的差异, 不能过度依赖客户端环境.  
调试困难: SSR的调试过程相对复杂, 需要同时考虑到服务器端和客户端的日志和错误信息.

### 如何在Next中使用

主要是两个方法:
* **getStaticProps**  
该方法是用来获取静态props数据, 会在build时运行一次然后生成html页面, 所以数据是build时就定死的数据, 该数据将会传给当前根组件. 所以该方法只能用于根组件  

```tsx
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { FC } from "react";
import sHttp from "@/utils/getStaticData";

export const getStaticProps: GetStaticProps<{
  blogList: BlogItem[];
}> = () => {
  const blogList = sHttp.getBlogList();
  const tagList = sHttp.getTagList();
  return { props: { blogList } };
};

const BlogList: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ blogList }) => {
  return <div></div>;
}
```

  
* **getStaticPaths**  
该方法是用来获取动态路由的所有可能性数组.   
例如博客会有动态路由, 那动态路由的参数不同时, 页面数据也不同, 所以需要渲染出动态路由所有的页面, 因此需要使用getStaticPaths方法.

```tsx
import { GetStaticProps, InferGetStaticPropsType } from "next";
import sHttp from "@/utils/getStaticData";

export const getStaticPaths = async () => {
  const paths = sHttp.getBlogList().map((itm) => `/blog/${itm.id}`);
  return { paths, fallback: true };
};

export const getStaticProps: GetStaticProps<{
  detail: BlogItem;
}> = ({ params }: { params: Props }) => {
  const detail = sHttp.getBlogDetailById(params.id);
  return { props: { detail } };
};

const Blog: FC<InferGetStaticPropsType<typeof getStaticProps>> = ({ detail }) => {
  return <div></div>;
}
```

fallback 有 3 个值
* true  
当访问的静态页面不存在时, 该页面将表现为 fallback: 'blocking', 在后台Next会去重新做请求渲染页面.  
如果你的应用有大量依赖于数据的静态页面（例如非常大的电子商务网站）, 则 fallback: true 非常有用. 如果你想预渲染所有产品页面, 则构建将花费很长时间.  
相反, 你可以静态生成一小部分页面, 并使用 fallback: true 来处理其余部分. 当有人请求尚未生成的页面时, 用户将看到带有加载指示器或骨架组件的页面.  
不久之后, getStaticProps 完成, 页面将使用请求的数据渲染. 从现在开始, 每个请求同一页面的人都将获得静态预渲染的页面.  

* false  
未生成的页面访问 404

* blocking  
getStaticPaths 未返回的新路径将等待生成 HTML, 与 SSR 相同（因此会阻塞）, 然后缓存以供将来的请求使用, 因此每个路径仅发生一次. 

## 优化结果

1. 修改渲染方式从 CSR => SSG
2. 添加bytemd插件支持代码复制、添加目录功能
3. 添加域名代理, 国内也能访问

## 链接

[博客地址](https://blog.hushaha.top)

[前端git仓库地址](https://github.com/quechenping/blog_front)

[后端git仓库地址](https://github.com/quechenping/blog_backend)

[bytemd使用](/blog/bytemd-use)
