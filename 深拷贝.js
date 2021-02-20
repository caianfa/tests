const shallowClone = (obj) => Object.assign({}, obj)

const deepClone = (obj) => {
  if (obj === null) return null
  let clone = Object.assign({}, obj)

  Object.keys(clone).forEach(key => {
    clone[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key]
  })

  return Array.isArray(obj) && obj.length ? (clone.length = obj.length) && Array.from(clone) : clone
}

// MessageChannel实现深拷贝、 可以拷贝undefined和循环引用的对象 但是无法处理函数对象
// MessageChannel 通常用来 webworker兄弟线程间通信 iframe兄弟通信
let obj = {
  a: 1,
  b: {
    c: 2,
    d: 3,
  },
  f: undefined
}
function deepCopy(obj) {
  return new Promise(resolve => {
    const { port1, port2 } = new MessageChannel() // MessageChannel是异步的
    port2.onmessage = e => resolve(e.data)
    port1.postMessage(obj)
  })
}

deepCopy(obj).then(copy => {
  console.log(copy)
})


// https://juejin.cn/post/6844903929705136141
/**
 * 手写深拷贝需要注意的几个点
 * JSON.stringfy 不能处理函数和正则 处理之后变为null 切会忽略undefined 并且无法处理循环引用的情况
 * 处理循环引用的问题 （新开辟一个空间来存储当前对象和拷贝对象的对应关系）
 * 处理多种类型 Date RegExp String Number Symbol Error 等内置对象的拷贝
 * 通用遍历性能 while for...in  for   (while性能最高 其次是for)
 * 拷贝函数
 */

function deepClone(obj, hash = new WeakMap()) {
  if (obj === null) return obj
  if (obj instanceof Date) return new Date(obj)
  if (obj instanceof RegExp) return new RegExp(obj)
  if (obj instanceof Symbol) return Object.prototype.valueOf.call(obj)
  if (typeof obj !== 'object') return obj

  if (hash.get(obj)) return hash.get(obj)
  let cloneObj = new obj.constructor()
  hash.set(obj, cloneObj)

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloneObj[key] = deepClone(obj[key], hash)
    }
  }

  return cloneObj
}








const target = {
  field1: 1,
  field2: undefined,
  field3: {
      child: 'child'
  },
  field4: [2, 4, 8]
};
target.target = target; // 测试循环引用


function clone(target) {
  if (target === null) return target
  if (typeof target !== 'object') return target
  let cloneObj = Array.isArray(target) ? [] : {}
  for (const key in target) {
    cloneObj[key] = clone(target[key])
  }
  return cloneObj
}
