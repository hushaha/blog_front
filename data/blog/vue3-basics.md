---
title: VUE3学习文档
createTime: 2022-05-01
updateTime: 2022-05-01
authors: hush
tag: vue3
cover: vue3-basics.jpg
---

## 前言

知道原理才能用好工具, 本文旨在帮助理解vue3响应式原理, 写的比较浅, 并不是特别标准的答案, 是笔者自己对vue3的思考, 仅供学习参考

## 响应式

回顾一下, vue3中如何创建一个响应式变量

```js
const status = reactive({
    data: [],
    loading: false,
})

const data = ref([]);
const loading = ref(false);
```

上述通过 `reactive` 和 `ref` 创建了几个变量, 其中他们有几个区别

1. `reactive` 只能代理对象
2. `reactive` 不需要 `.value`

为什么 `reactive` 只能代理对象? 

### js内存管理

先来看下js内存管理的基础知识, 下方给了个例子

```js
// eg1
let a = 1;
let b = a;
a = 2;
console.log(b); // 1
```

上方代码中, 定义了一个 `a` 变量, 将 `a` 变量赋值给 `b` , 改变 `a` 的值后, `b` 还是之前的值, 这看起来没有什么问题, 我们继续往下看

```js
// eg2
let obj = {
    a: 1
}
let obj1 = obj
obj.a = 2
console.log(obj1.a) // 2

// eg3
obj = {
    a: 3
}
console.log(obj1); // { a: 2 }
```

上方代码中, 定义了一个变量 `obj` , 再将 `obj` 赋值给 `obj1` , 改变 `obj` 的 `a` 属性后, `obj1` 的 `a` 属性也改变了
然后继续, 将obj重新赋值, 会发现obj1却还是之前的值
造成这些的差异是什么?

### 堆栈

* 基本数据类型保存在 `栈内存` 中

* 引用类数据类型保存在 `堆内存` 中, 赋值时是赋值一个指针, 指针保存在 `栈内存` 中, 数据保存在 `堆内存` 中

**解释eg1:**  
所以基本数据保存在 `栈内存` , 你对这个变量做的调整就是对这个栈内存中的数据做的处理, 所以将 `a` 变量赋值给 `b` 变量相当于把 `a` 的值复制给了 `b` , 此时栈内存中有两个变量, 只是他们的值相同

**解释eg2:**  
而对象是保存在 `堆内存` 中, 在定义这个对象时, 会将这个对象保存在 `堆内存` 中, 然后将这个对象的指针保存在 `栈内存` 中, 所以将 `obj` 赋值给 `obj1` 时是把指针复制给 `obj1` , 此时 `obj` 和 `obj1` 都是指向堆内存中的同一个对象, 所以修改 `obj` 变量 `obj1` 变量也会跟着改变

但如果将 `obj` 重新赋值, 则相当于重新建立一个数据和obj做关联, 而 `obj1` 还是指向之前的变量没有动过

### reactive

```js
let status = reactive({
    data: [],
    loading: false,
})

let loading = reactive(false) // Proxy
```

status其实就是由reactive方法接收一个参数obj, 然后返回出来的一个对象, 该对象是个proxy对象, 对内部的数据进行调整是会走响应式逻辑, 但是如果把status整个替换掉

```js
status = {
    data: [],
    loading: false
}

loading = true
```

status将会丢失响应式, 因为指针丢了  
loading就是一个例子, 直接修改loading会导致指针丢失  
因此声明 `reactive` 时用 `const` 关键字比较好, 可以避免当前变量被重新赋值
如果需要全部修改status怎么做?

```js
status.data = []
status.loading = false
```

### ref 

ref就是用来弥补上述缺点, 能代理任意类型数据  
为什么可以代理所有数据, 因为他把数据放在value里, 你不会直接访问当顶层数据, 只能通过value去获取数据

```js
const tableStatus = ref({
    data: [],
    loading: false,
    total: 0,
})

const loading = ref(false)
const data = ref([])

status.value = {
    data: [],
    loading: false,
}

loading.value = false
```

### defineProperty & proxy 代理

为什么上述的 `ref` 和 `reactive` 方法的返回值就是个响应式变量, 先来认识一下proxy

proxy是es6提出的方法, es6之前可以使用defineProperty实现代理

所谓代理, 就是一个相当于这个对象你交给proxy, 当你控制这个对象的时候是通知proxy你要做什么, 他去帮你操作

也就是你告诉他你要读某个属性, 要设置某个属性, 要新增属性等等, 他去帮你执行对应操作并把结果返回给你. 因此我们在执行这些操作时就有机可乘, 可以夹带私货进去

下方是通过proxy简单实现的一个例子

```js
const reactive = (target) => {
    return new Proxy(target, {
        get(target, key, receiver) {
            const res = Reflect.get(target, key, receiver);

            // 这里可以添加额外的日志或追踪依赖的逻辑
            console.log(`Getting ${key}: `, res);

            // 如果属性值是对象，可以递归使其也变为reactive
            if (typeof res === 'object' && res !== null) {
                return reactive(res);
            }

            return res;
        },
        set(target, key, value, receiver) {
            const oldValue = target[key];
            const result = Reflect.set(target, key, value, receiver);

            // hasChanged方法
            if (result && oldValue !== value) {
                console.log(`Setting ${key}: `, value);
            }

            return result;
        },
        deleteProperty(target, key, receiver) {
            console.log(`delete key is ${key}`);
            Reflect.deleteProperty(target, key, receiver);
        }
    });
}
```

### computed

```js
const computed = (getterOrOptions) => {
    let getter, setter;

    if (typeof getterOrOptions === 'function') {
        getter = getterOrOptions;
        setter = () => {}
    } else {
        getter = getterOrOptions.get;
        setter = getterOrOptions.set;
    }

    return new computedRef(getter, setter)
}

const a = computed(() => {
    return b.value + 1
})
```

### watch

```js
const watcherMap = new Map({});

const getSource = (source) => typeof source === 'function' ? source() : source;

const watch = (source, cb, options) => {
    let oldValue = getSource(source);

    const watcher = () => {
        const newValue = getSource(source);
        // hasChanged
        if (newValue !== oldValue) {
            cb(newValue, oldValue);
            oldValue = newValue;
        }
    }

    // 注册watcher
    const keys = Object.keys(oldValue);
    keys.forEarch((key) => {
        if (!watcherMap.has(key)) {
            watcherMap.set(key, new Set());
        }
        watcherMap.get(key).add(watcher)
    })
}

// reactive
const reactive = (target) => {
    set(target, key, value, receiver) {
        // hasChanged方法
        if (result && oldValue !== value) {
            if (watcherMap.has(key)) {
                watcherMap.get(key).forEach(cb => {
                    cb();
                })
            }
        }
    }
}
```

**疑问:**

为什么watch第一个参数有不同的写法

参考文章: [watch](https://cn.vuejs.org/guide/essentials/watchers.html)

## 规范

场景: 列表的增删改查

```vue
<template>
  <table
    :loading="tableStatus.loading"
    :data="tableStatus.data"
    :total="tableStatus.total"
  />
</template>

<script setup lang="ts">
  const tableStatus = ref<{
    loading: boolean;
    data: any[];
  	total: number;
  }>({
    loading: false,
    data: [],
    total: 0
  })
  
  const checkTableList = computed(() => {
    return tableStatus.value.data.filter(i => i.checked);
  })

  const getTableList = async (id: string) => {
    tableStatus.value.loading = true;
    const { data, total } = await getTableData(id);
    tableStatus = {
      loading: false,
      data,
      total
    };
  }
  
  // 有待商榷
  watch(
    () => props.id,
    (newVal) => {
    	getTableList(newVal);
  	}, {
      immediate: true
    }
  )
</script>

<style scoped lang="scss">
</style>
```
