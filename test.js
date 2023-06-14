












function compose(...funcs) {
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

function deepCopy(obj, map = new WeakMap()) {
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)

  if (obj !== null && typeof obj !== 'object') return obj
  if (map.has(obj)) return map.get(obj)

  const t = new obj.constructor()
  map.set(obj, t)

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      t[key] = deepCopy(obj[key], map)
    }
  }

  return t;
}


Promise.prototype.all = function (promises) {
  return new Promise((resolve, reject) => {
    let count = 0
    let res = []
    let curPromise

    for (let i = 0; i < promises.length; i++) {
      curPromise = promises[i]

      curPromise.then(data => {
        if (count < promises.length) {
          res[i] = data
          count++;
        } else {
          resolve(res)
        }
      }).catch(error => {
        reject(error)
      })
    }
  })
}


Promise.prototype.race = function (promises) {
  return new Promise((resolve, reject) => {
    let curPromise;

    for (let i = 0; i < promises.length; i++) {
      curPromise = promises[i]

      curPromise.then(data => {
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    }
  })
}

Promise.prototype.allSettled = function (promises) {
  return Promise.all(
    promises.map(p => {
      return p
        .then(data => ({ status: 'resolved', value: data }))
        .catch(error => ({ status: 'rejected', reason: error }))
    })
  )
}


/*
JS实现一个带并发限制的异步调度器Scheduler，保证同时运行的任务最多有两个。完善下面代码的Scheduler类，使以下程序能够正常输出：
class Scheduler {
  add(promiseCreator) { ... }
  // ...
}

const timeout = time => {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  }
})

const scheduler = new Scheduler()

const addTask = (time,order) => {
  scheduler.add(() => timeout(time).then(()=>console.log(order)))
}

addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')

// output: 2 3 1 4
整个的完整执行流程：

起始1、2两个任务开始执行
500ms时，2任务执行完毕，输出2，任务3开始执行
800ms时，3任务执行完毕，输出3，任务4开始执行
1000ms时，1任务执行完毕，输出1，此时只剩下4任务在执行
1200ms时，4任务执行完毕，输出4
*/
class Scheduler {
  constructor() {
    this.tasks = []
    this.maxCount = 2
    this.runCount = 0
  }

  add(promiseCreator) {
    this.tasks.push(promiseCreator);
    this.runTask()
  }

  runTask() {
    if (this.tasks.length > 0 && this.runCount < this.maxCount) {
      const task = this.tasks.shift()
      this.runCount += 1;

      task().then(res => {
        this.runCount -= 1;
        this.runTask()
      })
    }
  }
}

const timeout = time => {
  return new Promise(resolve => {
    setTimeout(resolve, time)
  })
}

const scheduler = new Scheduler()

const addTask = (time,order) => {
  scheduler.add(() => timeout(time).then(()=>console.log(order)))
}

addTask(1000, '1')
addTask(1500, '2')
addTask(3000, '3')
addTask(4000, '4')


// Least Recently Used  最近最少使用


/*
特点分析：
  我们需要一块有限的存储空间，因为无限的化就没必要使用 LRU 算发删除数据了。
  我们这块存储空间里面存储的数据需要是有序的，因为我们必须要顺序来删除数据，所以可以考虑使用 Array、Map 数据结构来存储，不能使用 Object，因为它是无序的。
  我们能够删除或者添加以及获取到这块存储空间中的指定数据。
  存储空间存满之后，在添加数据时，会自动删除时间最久远的那条数据。
*/

class LRUCache {
  constructor(length) {
    this.cache = new Map();
    this.length = length;
  }

  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key)
      // 取值后需要更新位置（删除再重新插入）
      this.cache.delete(key)
      this.cache.set(key, value)
      return value
    }

    return -1
  }

  put(key, value) {
    // 已经存在的情况下，更新其位置到”最新“即可
    // 先删除，后插入
    if (this.cache.has(key)) {
      this.cache.delete(key)
    } else {
      if (this.cache.size >= this.length) {
        this.cache.delete(this.cache.keys().next().value)
      }
    }

    this.cache.set(key, value)
  }
}

var list = [
  { id: 1, parentId: 0, name: "root" },
  { id: 2, parentId: 1, name: "node1" },
  { id: 3, parentId: 1, name: "node2" },
  { id: 4, parentId: 2, name: "node1.1" },
  { id: 5, parentId: 2, name: "node1.2" },
  { id: 6, parentId: 4, name: "node1.1.1" }
];

function listToTree(list) {
  const result = [];
  const temp = {}

  for (let i = 0; i < list.length; i++) {
    temp[list[i].id] = list[i]
  }

  for (const key in temp) {
    let node = temp[key]
    if (node.parentId !== 0) {
      if (!temp[node.parentId].children) {
        temp[node.parentId].children = []
      }
      temp[node.parentId].children.push(node)
    } else {
      result.push(node)
    }
  }

  return result
}

const res = listToTree(list)
// console.log(JSON.stringify(res, null, 4));

// for (const a of arr) {  }
function forOf(obj, cb) {
  if (typeof obj[Symbol.iterator] !== 'function') throw new Error('error');

  const iterator = obj[Symbol.iterator]();
  let result = iterator();

  while(!result.done) {
    cb(result.value)
    result = iterator.next();
  }
}


function run(gen) {
  return new Promise((resolve, reject) => {
    const iterator = gen()

    function next(data) {
      const { value, done } = iterator.next()

      if (!done) {
        Promise.resolve(value).then(data => {
          next(data)
        }, reject)
      }
      resolve(value)
    }

    next()
  })
}

/*
  flex: flex-grow flex-shrink flex-basic
  默认 0 1 auto
  flex: 1 代表 1 1 0 表示容器排布为自由伸缩模式
  flex: none  代表 flex: 0 0 auto
*/

class LRUCache {
  constructor(length) {
    this.length = length;
    this.cache = new Map();
  }

  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key)
      this.cache.delete(key)
      this.cache.set(key, value)
      return value
    }

    return -1
  }

  put(key, value) {
    if (this.cache.size >= this.length) {
      if (this.cache.has(key)) {
        this.cache.delete(key)
        this.cache.set(key, value)
      } else {
        const key = this.cache.keys().next().value;
        this.cache.delete(key)
        this.cache.set(key, value)
      }
    }
    this.cache.set(key, value)
  }
}

/*
浏览器进程分为：

主进程 负责界面显示、前进后退等
渲染进程
GPU进程
插件进程
网络进程
*/

/*
性能优化的相关策略：
  浏览器相关
    HTTP2.0改造
  运行时相关
    优化加载顺序
    DNS预解析：静态资源域名、请求域名做 dns-prefetching
    preconnect: 预连接
      在慢速网络中建立连接通常需要消耗大量时间，尤其是在涉及安全连接时
      因为它可能涉及到 DNS 查找、重定向以及用于处理用户请求而与最终服务器的多次往返
    预加载 preload
    预请求 prefetch
    异步加载 async defer
    静态资源走cdn
    重复接口、接口合并、串行接口、前置接口的优化
    缓存
    动态导入
    可见性导入
    交互性导入
    长列表使用虚拟列表
    react运行时优化(减少组件渲染次数)：
      传递不可变数据
      精细化渲染
      函数组件：memo useMemo useCallback做函数缓存
              Context导致的子组件不必要重复渲染的问题：重写默认的Provider，通过useRef创建 contextValue，
              保证value的引用不发生变化,value 可以存储值和函数
      class组件： pureComponent memo shouldComponentUpdate
  编译时相关
    Tree Shaking
    基于Bundle做代码分割
*/

/*
https://juejin.cn/post/6847902222349500430#heading-7
页面渲染流程：
*/

/*
https://juejin.cn/post/6844903795776815117
HTTPS原理:
*/

/*
浏览器垃圾回收机制
*/

/*
Webpack
  loader plugin tapable
*/

/*
nest相关
*/
