---
title: VUE3学习文档
createTime: 2022-05-01
updateTime: 2022-05-01
authors: hush
tag: vue3
---

## 前言

`vue3` 提出 `setup` 语法糖，将组合式API风格发扬出来，更符合react-coder编码风格，因此按照组合式文档学习, 笔者之前接触 `React` 开发, 现需要使用 `vue3` , 因此写个基础知识笔记

### 创建vue实例

```typescript
import { createApp } from "vue";

const app = createApp({
  /* 根组件选项 */
});
```

我们传入 `createApp` 的对象实际上是一个组件，每个应用都需要一个 `根组件` ，其他组件将作为其子组件。

容易理解，前端项目本就以树状展示，都基于一个根组件扩展渲染

```typescript
# main.ts
import { createApp } from 'vue'
// 从一个单文件组件中导入根组件
import App from './App.vue'

const app = createApp(App)
```

#### 挂载实例

应用实例必须在调用了 `.mount()` 方法后才会渲染出来。该方法接收一个 `容器` 参数，可以是一个实际的 `DOM 元素` 或是一个 CSS 选择器字符串：

```typescript
app.mount("#main");
```

#### 应用配置

应用实例会暴露一个 `.config` 对象允许我们配置一些应用级的选项，例如定义一个应用级的错误处理器，它将捕获所有由子组件上抛而未被处理的错误：

```typescript
app.config.errorHandler = (err) => {
  /* 处理错误 */
};
```

应用实例还提供了一些方法来注册应用范围内可用的资源，例如注册一个组件：

```typescript
app.component("TodoDeleteButton", TodoDeleteButton);
```

这使得 `TodoDeleteButton` 在应用的任何地方都是可用的

#### 基础语法

##### 响应式状态

* 在`react`中可以通过 `useState` 定义一个状态，组件会根据该状态值是否改变而进行 **render**，改变该状态使用的是`setState`方法。

* 在**mobx**中通过**observable**将一个变量定义为可观察变量，在后续方法中通过**reaction**等方法在其中调整变量值，即可在组件中感知到且reRender

vue中通过 `reactive()` 或 `ref()` 定义一个变量

##### reactive

```tsx
const obj = reactive({ count: 0 })

const handleClick = () => {
  obj++
}

<div>{{ obj.count }}</div>
<button @click="handleClick">add</button>
<button @click="obj++">add</button>
```

##### reactive的局限性

* 仅对对象类型有效（对象、数组和 `Map`、`Set` 这样的[集合类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects#使用键的集合对象)），而对 `string`、`number` 和 `boolean` 这样的 [原始类型](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive) 无效。

* 因为 Vue 的响应式系统是通过`属性访问`进行追踪的，因此我们必须始终保持对该响应式对象的相同引用

这意味着我们不可以随意地**替换**一个响应式对象，因为这将导致对初始引用的响应性连接丢失：

```tsx
let state = reactive({ count: 0 });

// 上面的引用 ({ count: 0 }) 将不再被追踪（响应性连接已丢失！）
state = reactive({ count: 1 });
```

同时这也意味着当我们将响应式对象的属性赋值或解构至本地变量时，或是将该属性传入一个函数时，我们会失去响应性

```tsx
const state = reactive({ count: 0 });

// n 是一个局部变量，同 state.count
// 失去响应性连接
let n = state.count;
// 不影响原始的 state
n++;

// count 也和 state.count 失去了响应性连接
let { count } = state;
// 不会影响原始的 state
count++;

// 该函数接收一个普通数字，并且
// 将无法跟踪 state.count 的变化
callSomeFunction(state.count);
```

换言之，若变量为对象，则应该访问和调整时直接在对象上调整，而不能结构或替换

重点理解 `Vue 的响应式系统是通过属性访问进行追踪的` 这句话，必须从对象上访问属性才可追踪

##### ref

综上，Vue 提供了一个 [ `ref()` ](https://cn.vuejs.org/api/reactivity-core.html#ref) 方法来允许我们创建可以使用任何值类型的响应式 **ref**

```tsx
import { ref } from "vue";

const count = ref(0);
```

`ref()` 将传入参数的值包装为一个带 `.value` 属性的 ref 对象：

```tsx
const count = ref(0);

console.log(count); // { value: 0 }
console.log(count.value); // 0

count.value++;
console.log(count.value); // 1
```

##### ref解包

因为ref是会被包装成带有 `.value` 属性的ref对象，因此在获取该对象值时需要 `count.value` 这样去获取

但是在 `template` 中，ref 是模板渲染上下文的顶层属性时会自动解包(不需要 `.value` 即可获取到value值)

```tsx
const object = { foo: ref(1) }

const { foo } = object

<div>{{ object.foo + 1 }}</div> // 不能解包
<div>{{ object.foo }}</div> // 可以解包
<div>{{ foo + 1 }}</div>	// 可以解包
```

自行体会一下， `ref必须为顶层属性时才会自动解包`

#### reactive和ref区别

`ref` 是在 `reactive` 上封装形成的，用于解决 `reactive` 对象新命名等情况下**vue**无法跟踪问题

因此，对于 `json` 格式应该用 `reactive` ，对于基础类型及 `Array` 用 `ref`

其实可以全部 `ref` 一把梭

#### 文本插值

```tsx
<span>Message: {{ msg }}</span>
```

#### v-html

```tsx
<span v-html="rawHtml"></span></p>
```

`rawHtml` 为一个变量，定义的一个html便签

Vue 不是一个基于字符串的模板引擎。在使用 Vue 时，应当使用组件作为 UI 重用和组合的基本单元，而尽量不要使用 `v-html` 进行拼接，也容易出现 `XSS漏洞` ，类似 react 的 `dangerouslySetInnerHTML`

#### v-bind

如果需要响应式地绑定一个 attribute，则使用如下语法

```tsx
<div :id="dynamicId"></div>
<button :disabled="isButtonDisabled"></button>
```

`dynamicId` 、 `isButtonDisabled ` 、 `handleClick` 会被视为变量去查找

#### v-on

如果需要响应式绑定一个dom监听事件

```tsx
<button @click="handleClick"></button>

const handleClick = (e) => {
  // e为该dom原生对象
}
```

vue内置提供了一些原生方法调用

```tsx
<!-- 单击事件将停止传递 -->
<a @click.stop="doThis"></a>

<!-- 提交事件将不再重新加载页面 -->
<form @submit.prevent="onSubmit"></form>

<!-- 修饰语可以使用链式书写 -->
<a @click.stop.prevent="doThat"></a>

<!-- 也可以只有修饰符 -->
<form @submit.prevent></form>

<!-- 仅当 event.target 是元素本身时才会触发事件处理器 -->
<!-- 例如：事件处理器不来自子元素 -->
<div @click.self="doThat">...</div>
```

按键修饰符不展开了，在文档中自行查阅

#### v-if

```tsx
<h1 v-if="awesome">Vue is awesome!</h1>
```

`awesome` 为真值时才被渲染

你也可以使用 `v-else` 为 `v-if` 添加一个“else 区块”。

```tsx
<button @click="awesome++">Toggle</button>

<h1 v-if="awesome === 1">奇数</h1>
<h1 v-if="awesome === 2">偶数</h1>
<h1 v-else>Oh no 😢</h1>
```

一个 `v-else` 元素必须跟在一个 `v-if` 或者 `v-else-if` 元素后面，否则它将不会被识别。

#### v-show

```tsx
<h1 v-show="ok">Hello!</h1>
```

`v-show` 和 `v-if` 不同之处在于 `v-show` 会在 DOM 渲染中保留该元素； `v-show` 仅切换了该元素上名为 `display` 的 CSS 属性。

`v-if` 是“真实的”按条件渲染，因为它确保了在切换时，条件区块内的事件监听器和子组件都会被销毁与重建。

`v-if` 也是**惰性**的：如果在初次渲染时条件值为 false，则不会做任何事。条件区块只有当条件首次变为 true 时才被渲染。

`v-show` 简单许多，元素无论初始条件如何，始终会被渲染，只有 CSS `display` 属性会被切换。

#### v-for

若迭代对象为 `Array`

```tsx
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])

<li v-for="({message}, index) in items">
  {{ message }}
</li>
```

若迭代对象为 `json`

```tsx
const myObject = reactive({
  title: 'How to do lists in Vue',
  author: 'Jane Doe',
  publishedAt: '2016-04-10'
})

<ul>
  <li v-for="(value, key, index) in myObject">	// value为属性值，key为属性名，index为索引
    {{ value }}
  </li>
</ul>
```

若迭代对象为 `number`

```tsx
<span v-for="n in 10">{{ n }}</span>
```

注意此处 `n` 的初值是从 `1` 开始而非 `0` 。

# v-for与v-if

官方文档不推荐 `v-for` 和 `v-if` 同时在一个标签中使用，说实话按理来说也不存在这种情况

官方示例：

```tsx
<template v-for="todo in todos" :key="item.id">
  <li v-if="!todo.isComplete">
    {{ todo.name }}
  </li>
</template>
```

or

```tsx
<template v-if="!todo.isComplete">
  <ul v-for="todo in todos" :key="item.id">
    <li>{{ todo.name }}</li>
  </ul>
</template>
```

[推荐](https://cn.vuejs.org/style-guide/#keyed-v-for-essential)在任何可行的时候为 `v-for` 提供一个 `key` attribute，除非所迭代的 DOM 内容非常简单 (例如：不包含组件或有状态的 DOM 元素)，或者你想有意采用默认行为来提高性能。

Vue 能够侦听响应式数组的变更方法，并在它们被调用时触发相关的更新

所以执行类似 `push()` 等直接修改原数组的方法可被Vue监听到

若需要用到类似 `filter()` 等返回新数组的方法，则需要将数组进行替换

```tsx
todos.value = todos.value.filter((itm) => itm.isShow);
```

#### 计算属性

同react中的 `useMemo` , 当 `computed` 中的监听变量变化时，该计算属性会改变。主要用以需要缓存的数据

```tsx
// 一个计算属性 ref
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? "Yes" : "No";
});
```

#### 可写计算属性

vue官方也说了， `只在某些特殊场景中你可能才需要用到“可写”的属性`

你可以通过同时提供 getter 和 setter 来创建一个可以调整的计算属性

```tsx
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  // getter
  get() {
    return firstName.value + ' ' + lastName.value
  },
  // setter
  set(newValue) {
    // 注意：我们这里使用的是解构赋值语法
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
</script>
```

现在当你再运行 `fullName.value = 'John Doe'` 时，setter 会被调用而 `firstName` 和 `lastName` 会随之更新。

调整 `fullName` 时会改变 `firstName` 和 `lastName` 的值，其实是带来了副作用，代码量过大吼，可能对这两个值引用地方过多，会导致代码难以维护

### 侦听器

#### watch

同react中的 `useEffect` ，[ `watch` 函数](https://cn.vuejs.org/api/reactivity-core.html#watch)在每次响应式状态发生变化时触发回调函数

```tsx
watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.indexOf("?") > -1) {
    answer.value = "Thinking...";
    try {
      const res = await fetch("https://yesno.wtf/api");
      answer.value = (await res.json()).answer;
    } catch (error) {
      answer.value = "Error! Could not reach the API. " + error;
    }
  }
});
```

`watch` 的第一个参数可以是不同形式的“数据源”：它可以是一个 ref (包括计算属性)、一个响应式对象、一个 getter 函数、或多个数据源组成的数组.

注意，你不能直接侦听响应式对象的属性值，例如:

```tsx
const obj = reactive({ count: 0 });

// 错误，因为 watch() 得到的参数是一个 number
watch(obj.count, (count) => {
  console.log(`count is: ${count}`);
});
```

这里需要用一个返回该属性的 getter 函数：

```tsx
// 提供一个 getter 函数
watch(
  () => obj.count,
  (count) => {
    console.log(`count is: ${count}`);
  },
);
```

直接给 `watch()` 传入一个响应式对象，会隐式地创建一个深层侦听器——该回调函数在所有嵌套的变更时都会被触发

相比之下，一个返回响应式对象的 getter 函数，只有在返回不同的对象时，才会触发回调

#### watchEffect

watch是懒执行，当依赖变化时才会执行。

但在某些场景中，我们希望在创建侦听器时，立即执行一遍回调。

```tsx
// watch
const url = "https://...";
const params = reactive({});
const data = ref(null);

async function fetchData() {
  const response = await fetch(url, params);
  data.value = await response.json();
}

// 立即获取
fetchData();
// ...再侦听 data 变化
watch(data, fetchData);

// watchEffect
watchEffect(async () => {
  const response = await fetch(url, params);
  data.value = await response.json();
});
```

* `watch` 只追踪明确侦听的数据源。它不会追踪任何在回调中访问到的东西。另外，仅在数据源确实改变时才会触发回调。`watch` 会避免在发生副作用时追踪依赖，因此，我们能更加精确地控制回调函数的触发时机。
* `watchEffect`，则会在副作用发生期间追踪依赖。它会在同步执行过程中，自动追踪所有能访问到的响应式属性。这更方便，而且代码往往更简洁，但有时其响应性依赖关系会不那么明确。

##### 回调的触发时机

> https://cn.vuejs.org/guide/essentials/watchers.html#watcheffect

##### 停止侦听器

用同步语句创建的侦听器，会自动绑定到宿主组件实例上，并且会在宿主组件卸载时自动停止

如果用异步回调创建一个侦听器，那么它不会绑定到当前组件上，你必须手动停止它，以防内存泄漏

```tsx
import { watchEffect } from "vue";

// 它会自动停止
watchEffect(() => {});

// ...这个则不会！
setTimeout(() => {
  watchEffect(() => {});
}, 100);
```

要手动停止一个侦听器，请调用 `watch` 或 `watchEffect` 返回的函数：

```tsx
const unwatch = watchEffect(() => {});

// ...当该侦听器不再需要时
unwatch();
```
