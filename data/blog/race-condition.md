---
title: 如何解决前端竞态问题
createTime: 2024-06-04
updateTime: 2024-06-04
authors: hush
tag: js
---

## 什么是竞态

竞态条件, 旨在描述一个系统或者进程的输出依赖于不受控制的事件出现顺序或者出现时机. 此词源自于两个信号试着彼此竞争, 来影响谁先输出.

举例来说, 如果计算机中的两个进程同时试图修改一个共享内存的内容, 在没有并发控制的情况下, 最后的结果依赖于两个进程的执行顺序与时机. 而且如果发生了并发访问冲突, 则最后的结果是不正确的.

举个🌰:

分页列表查询, 点击分页按钮进行分页查询, 具体实现逻辑应该如下:

1. 点击分页按钮
2. 设置loading状态, 发送请求
3. 接受数据并渲染, 设置loading状态为false

其中可能出现一个bug, 若快速点击分页按钮, 则会发出多个请求, 假设从当前第1页快速依次点击到第3页, 若第2页比第3页后返回数据, 则会导致当前时第3页, 但是渲染的是第2页的数据

这就是前端对应的竞态问题, 常在同请求快速多次发起时出现

## 解决方案

解决方案很多, 这里大致都介绍一下:

### loading状态

若只是当前页面的多次重复请求, 可以根据loading状态直接解决

```js
const status = {
    loading: false,
    data: [],
};

const fetchData = async () => {
    if (status.loading === true) {
        return false;
    }

    status.loading = true;
    const res = await fetch();
    status.data = res.data;
    status.loading = false;
};
```

这里可以扩展成请求时不允许再次点击按钮

### 取消请求

顾名思义在下一次请求时取消上一次的请求, 让上一个请求不返回数据即可

#### xhr

如果是原生的请求, 可以使用 `abort` 方法取消请求

```js
const xhr = new XMLHttpRequest();

xhr.open("GET", "url");
xhr.send();

xhr.abort(); // 取消请求
```

#### axios

axios是对xhr的封装, 因此内部提供了 `cancelToken` 来取消请求, 具体实现如下:

```js
const source = axios.CancelToken.source();

axios.get(url, {
    cancelToken: source.token;
}).catch(function(thrown) {
    if (axios.isCancel(thrown)) {
        console.log('Request canceled', thrown.message);
    } else {
        // 处理错误
    }
});

// 取消请求（message 参数是可选的）
source.cancel('Operation canceled by the user.');
```

`isCancel` 可以用来判断是否为手动取消的行为

> Axios 的 cancel token API 是基于被撤销 cancelable promises proposal  
> 此 API 从 v0.22.0 开始已被弃用，不应在新项目中使用

从 v0.22.0 开始，Axios 支持以 fetch API 方式—— AbortController 取消请求

```js
const controller = new AbortController();

axios.get(url, {
        signal: controller.signal,
    })
    .then(function(response) {
        //...
    })
    .catch(function(thrown) {
        if (axios.isCancel(thrown)) {
            console.log("Request canceled", thrown.message);
        } else {
            // 处理错误
        }
    });

// 取消请求
controller.abort();
```

axios实则为对xhr封装的promise版本, 因此在cancel时执行了xhr.about() 和 promise.reject()

请求过多时可能会因为浏览器限制而等待发送, 在请求未发送时 cancel 调则后台不会接收到请求, 因此当前方案是叫取消请求

#### 封装示例

```ts
export type RequestConfig = InternalAxiosRequestConfig & {
	isCancel?: boolean;
};

/**
 * 取消请求的函数的缓存Map
 */
const cancelFns = new Map();

// 可以对url做其他处理, 主要生成单个接口类型的唯一值, 取消时会按照接口的唯一值取消
const getCancelToken = (config: RequestConfig): string => {
	return config.url;
};

/** 
 * 缓存取消请求的函数
*/
const setCancelToken = (config: RequestConfig): CancelToken => {
    const key = getCancelToken(config);
    const abort = new AbortController();
    cancelFns.set(key, abort);
	return about;
};

/**
 * 执行取消操作
*/
export const cancelAjax = (
	type: "check" | "remove" | "removeAll",
	key: string,
) => {
	switch (type) {
		// 取消接口
		case "check":
			cancelFns.get(key) && cancelFns.get(key).abort();
			cancelAjax("remove", key);
			break;
		// 缓存中删除接口
		case "remove":
			cancelFns.delete(key);
			break;
		// 取消所有接口
		case "removeAll":
			cancelFns.forEach((fn, k) => {
				fn.abort();
				cancelFns.delete(k);
			});
			break;
		default:
			throw new Error("无效的取消类型");
	}
};

const useAjax = (config?: CreateAxiosDefaults) => {
    const client = axios.create({
		baseURL: config.baseURL,
		headers: config.headers,
	});

    client.interceptors.request.use((config: RequestConfig) => {
        // 设置cancelToken
        const { isCancel } = config;
        config.signal = setCancelToken(config).signal;

        if (isCancel) {
            cancelAjax("check", key);
        }

        return config;
	});

    client.interceptors.response.use(
		(res) => {
			// 接口请求完毕删除队列中的cancelToken
			const key = getCancelToken(res.config);
			if (key) cancelAjax("remove", key);
            return res.data;
		},
	);

    return client;
}

const ajax = useAjax();

ajax.get("/xxx", { isCancel: true })
```

### react18

在波神那里看到一个使用示例, React 18 结合 Suspense 也在竞态问题上, 提出了一个自己的解决方案. 这里做一个引导, 提供一个新思路

需求如下:

点击一个按钮, 调一个接口获取返回值往列表底部插入一条数据, 接口未返回时插入的数据应是loading状态

可能存在的问题:  
若多次点击, 有可能上一次的接口比下一次的返回值后返回, 导致列表顺序出错

下方会用到一些 react 特性 `use` 和 `Suspense` , 在这里先解释一下:

* **use**

use 是一个 React API，它可以让你读取类似于 Promise 或 context 的资源的值。

```js
const getApi = async (url) => {
    const res = await fetch(url);
    return res.json();
};

const data = getApi("xxx");

const value = use(data);
```

* **Suspense**

<Suspense> 允许在子组件完成加载前展示后备方案。

```tsx
<Suspense fallback={<Loading />}>
    <SomeComponent />
</Suspense>
```

下方先简化一下使用示例代码

```tsx
import { use, Suspense, useState } from "react";

const getApi = async () => {
	const res = await fetch("xxx");
	return res.json();
};

export default function Index() {
	const [list, setList] = useState([]);

	function onAddData() {
		list.push(getApi());
		setList([...list]);
	}

	return (
		<div>
			<button onClick={onAddData}>新增数据</button>
			<div className="content">
				<div className="list">
					{list.map((item, index) => (
						<div className="item" key={index}>
							<Suspense fallback={<div>loading...</div>}>
								<Item api={item} />
							</Suspense>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

const Item = ({ api }) => {
	const joke = api ? use(api) : { value: "nothing" };
	return <div>{joke.value}</div>;
};
```

这里父组件 `Index` 中定义 `list` , 在每次执行 `onAddData` 新增时会往list中 push一个 `promise` 数据, 然后通过这个 `list` 渲染 `Suspense` 包裹的 `Item` 组件并把这个 `promise` 状态的数据传入 `Item`

`Item` 组件中通过 `use` 读取 `api` 的值, 若 `api` 没有值则返回默认值, 若有值则读取 `api` 的值

示例结束, 分析一下:

整体方案就是父组件每次新增数据时是把数据请求的 `promise` 丢给子组件, 渲染子组件时用 `Suspense` 包裹子组件通过 `use` 读取 `api` 的值, 而不是由父组件收集promise数据再丢给子组件去渲染, 这样就已经规避了竞态问题, 不存在所谓的多进程同时更改一个状态的问题

且这是个异步操作, 点击即会发送请求, 即会渲染对应的组件, 不用担心瀑布式渲染的情况

这个方案不针对于 react, 更可以认为是一种思路, 即使不是react, 我们也可以把promise丢给子组件, 封装一个辅助函数用以解析该promise, 再自行渲染数据, loading状态自己维护即可, 上述场景的 `suspense` 在此处并没有必要性, 只是减少自己处理loading状态罢了

## 总结

其实解决方式不止这些，像 React Query，GraphQL，rxjs 等都有竞态处理，感兴趣的同学可以再继续深入了解。

## 相关链接

[React 19 出手解决了异步请求的竞态问题，是好事还是坏事？](https://mp.weixin.qq.com/s/3cHVJkJekEv7k5_QYbMCsw)

[上一个案例，更优雅的解决方案](https://mp.weixin.qq.com/s/Rqajo94tM9U5Fqfwf4vTpg)

[react suspense](https://zh-hans.react.dev/reference/react/Suspense)

[react use](https://zh-hans.react.dev/reference/react/use#streaming-data-from-server-to-client)
