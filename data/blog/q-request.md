---
title: axios二次封装
createTime: 2023-04-03
updateTime: 2023-04-03
authors: hush
tag: js
cover: q-request.jpg
---

## 前言

正常情况下其实没必要封装axios, 他本身就是对xhr的封装, 使用上已经足够方便了, 没必要做过多的处理.

不过工具方便是因为工具做的好, 但你没办法让用的人能写的好代码, 所以需要有一套规范来统一, 统一什么呢. 请求嘛, 无非需要确认好的就是请求的参数和响应的参数, 以及和后端对接的请求结构体

这里我想实现一个功能, 能够配置请求的入参和出参格式, 配合ts在使用时直接可以看到数据结构. 那又有人要问了, 我这样写不就可以了

```ts
interface GetUserRequest {
    id: string;
}

interface GetUserResponse {
    name: string;
    age: number;
}

const getUser = (params: GetUserRequest): GetUserResponse => {
    return request.get('/user')
}
```

这样是实现了, 但是要写很多的重复代码以及类型定义, 那你又要问了, 那我把类型定义写到方法上呢

```ts
interface GetUserRequest {
    id: string;
}

interface GetUserResponse {
    name: string;
    age: number;
}

const getUser = (params: {
     id: string;
}): {
    name: string;
    age: number;
} => {
    return request.get('/user')
}
```

这不是不好看嘛, 而且也不好将类型定义复用, 而且即使这些都不是问题, 那么每个请求最起码也有下边一行

```ts
const getUser = () => request.get('/user')
```

那么这里不是每次你都还需要写 request.get 嘛. 其实这里问题不大, 没必要省代码省到很离谱的地步, 这里纠结的问题也不是为了省多少代码, 这只是其中一小部分, 更多的还是类型定义方面

因此有一天我在github上看到了一个对axios的二次封装的项目 [axits](https://github.com/kinglisky/axits)

因此基于这个思路我也封装了一个, 使用示例如下:

## 示例

`apiList` 是个对象, 里面包含了你注册的所有请求, 使用如下

```ts
const res = await apiList.getUser({
    id: ''
});

const res = await apiList.checkToken({
    token: 'xxx'
});
```

使用时你只需要找到 `apiList` 里对应的方法, 提供入参即可

注册请求示例如下:

```ts
import { createRequest } from '@hushaha/request';
import type { APISchemaResponse, ApiSchemas } from '@hushaha/request';

interface APISchemaRes extends APISchemaResponse {
	getUser: {
		request: {
			petId: string;
		};
		response: {
			name: string;
		};
	};
}

const apisScheams: ApiSchemas<APISchemaRes> = {
	getUser: {
		path: 'GET pet/:petId',
		headers: {
			'Content-Type': 'application/json'
		}
	}
};

const { apiList } = createRequest<APISchemaRes>(
	{
		baseURL: '/api'
	},
	apisScheams
);

export { apiList };
```

这里我注册了一个 `getUser` 方法

在 `apisScheams` 里进行地址, 请求类型, 自定义请求头的配置

在 `APISchemaRes` 里进行出入参的类型定义

因为有 `APISchemaResponse, ApiSchemas` 的约束, 这里必须是一一对应, 每个请求都有类型定义和配置定义

效果如下:

![](/images/q-request/request-1.png)

这个请求配置的结构我只是觉得也不错, 所以沿用了, 如果你不喜欢, 改一下 apisScheams 的结构即可

## 解析

说下我做这个事情的整体流程, 我会一步步的实现, 讲述我平常实现需求的思路

先分析下我的需求

我希望能提供一个 `create` 方法, 我执行完这个方法给我返回一个对象 `apiList` , 这个对象包含所有请求, 使用示例如上

然后执行 create 方法时我需要传入接口配置和类型定义, 因此我们先画个壳出来

### 初步开发

我定义这个 `create` 方法叫 `createRequest` , 需要接收 axios 的默认配置以及我们定义的接口配置

我希望的定义接口样式如下:

```ts
const apisScheams = {
    getUser: {
		path: 'GET pet/:petId',
	}
}
```

因此apis的ts类型应该长这个样子:

```ts
import type { AxiosRequestConfig } from 'axios';

export type ApiSchemas = {
	[string]: AxiosRequestConfig & {
		path: string;
	};
};
```

那我们开始编写 `createRequest` 方法:

```ts
import axios, type { AxiosRequestConfig, CreateAxiosDefaults } from 'axios';

export const createRequest = (requestConfig: CreateAxiosDefaults, apiSchema: ApiSchemas) => {
    const client = axios.create(requestConfig);

    const apiList = attachApiList(client, apiSchema);

    return { apiList, client }
}
```

这个 `attachApiList` 方法就应该组装出上述的 `apiList` 对象出来, 那个对象的类型应该是这样的:

```ts
type ApiList = {
	[string]: (params: any) => Promise<any>;
};
```

因此 `attachApiList` 方法如下(简化一下处理path的部分):

```ts
import type { AxiosInstance } from 'axios';

const attachApiList = (client: AxiosInstance, apiSchema: ApiSchemas) => {
	const apiList: ApiList = Object.create(null);
	
	for (const apiName in apiSchema) {
		const apiConfig = apiSchema[apiName];

		apiList[apiName] = (params) => {
			const _params = { ...(params || {}) };
			const { path, ...config } = apiConfig;

			// 这里处理apiConfig, 解析出path中的请求类型和url,以及url上的参数

			const requestParams = USE_DATA_METHODS.includes(method)
				? { data: _params }
				: { params: _params };

			return client.request({
				url,
				method: method.toLowerCase(),
				...requestParams,
				...config
			});
        }
    }

    return apiList;
}
```

到这里核心逻辑已经实现丸辣, 开始补充 ts

### 补充ts

首先需要在外部定义好请求的入出参类型定义, 而这个是在外边定义的再接进我们的方法里, 所以需要用到泛型. 我们定义外部提供的接口类型定义如下:

```ts
export type APISchemaResponse = Record<
	string,
	{
		request: Record<string, any> | void;
		response: Record<string, any> | any;
	}
>;
```

因此 `createRequest` 方法改造后如下:

```ts
const createRequest = <T extends APISchemaResponse>(
    requestConfig: CreateAxiosDefaults,
    apisScheams: ApiSchemas<T>
) => {
    const client = axios.create(requestConfig);

    const apiList = attachApiList<T>(client, apiSchema);

    return { apiList, client };
};
```

这里将泛型 `T` 传给 `attachApiList` , 目的是因为我们要根据传入的 `APISchemaResponse` 取出他的 key 作为枚举类型

继续调整 `attachApiList` 的类型定义:

```ts
type ApiList<T extends APISchemaResponse> = {
	[K in keyof T]: (params: T[K]['request']) => Promise<T[K]['response']>;
};

const attachApiList = <T extends APISchemaResponse>(
	client: AxiosInstance,
	apiSchema: ApiSchemas<T>
): ApiList<T> => {
    const apiList: ApiList<T> = Object.create(null);

    // ...

    return client.request({
        url,
        method: method.toLowerCase(),
        ...requestParams,
        ...config
    });
}
```

此时 `attachApiList` 返回的 `apiList` 的类型应该定义成了 key 是传入的 `APISchemaResponse` 的 key, value 是一个函数, 这个函数的入参是 `APISchemaResponse` 的 value 的 `request` 类型, 返回值是 `response` 类型

完事了, 接下来只需要完善一些额外逻辑, 加上 cancel 功能, 提供 client 出去支持自定义拦截器, 默认我也提供一套拦截器规则

### cancel功能

这里用类实现, 主要创建一个Map, 往里添加 `abortController` , 然后在每次请求时把 `abortController` 存起来, 在打开 cancel 的请求中根据当前 key 取出Map中的abortController 执行 abort 方法即可

具体实现如下:

```ts
class AbortHttp {
	private cancelMaps = new Map();

	getAbortKey(url: string) {
		return url.split('?')[0];
	}

	setAbortController(key: string, controller: AbortController) {
		this.cancelMaps.set(key, controller);
	}

	abort(key: string, type: 'check' | 'remove' = 'check') {
		switch (type) {
			case 'remove':
				this.cancelMaps.delete(key);
				break;
			case 'check':
			default:
				if (this.cancelMaps.has(key)) {
					this.cancelMaps.get(key).abort();
				}
				break;
		}
	}

	clear() {
		this.cancelMaps.clear();
	}
}

export default new AbortHttp();
```

接入到请求中应该是这样, 调整下 `createRequest` 入参

```ts
export const createRequest = <T extends APISchemaResponse>(
	requestConfig: CreateAxiosDefaults,
	apisScheams: ApiSchemas<T>,
	{
		interceptorsRequest,
		interceptorsResponse
	}: {
		interceptorsRequest?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig;
		interceptorsResponse?: (res: any) => any;
	} = {}
) => {
    client.interceptors.request.use(
		(
			config: InternalAxiosRequestConfig & {
				isCancel?: boolean;
			}
		) => {
			try {
				const { isCancel } = config;
				const key = abortHttp.getAbortKey(config.url!);

				if (isCancel) {
					abortHttp.abort(key);
				}

				const controller = new AbortController();
				config.signal = controller.signal;
				abortHttp.setAbortController(key, controller);
			} catch (e) {
				throw new Error(`接口报错:${e}`);
			}

			if (interceptorsRequest) {
				config = interceptorsRequest(config);
			}

			return config;
		}
	);
}
```

### 总结

上面说过, 这个封装对我来说确实起到了规范作用, 有时候写的时候嫌麻烦就不想定义类型, 用的时候 any 一把梭, 如果用这个方式还是很容易管控起来.

说过其中定义请求参数的地方是可以自定义修改的, 所以如果你不喜欢 `GET /url` 的方式, 你可以拿下我的代码修改这一部分逻辑即可

## 链接

[axits](https://github.com/kinglisky/axits)

[我封装的请求源码](https://github.com/hushaha/h-request)

[我的博客地址](https://blog.hushaha.top)

[自定义脚手架开发](https://blog.hushaha.top/blog/custom-vite-cli)
