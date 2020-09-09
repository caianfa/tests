const shallowClone = (obj) => Object.assign({}, obj)

const deepClone = (obj) => {
  if (obj === null) return null
  let clone = Object.assign({}, obj)

  Object.keys(clone).forEach(key => {
    clone[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key]
  })

  return Array.isArray(obj) && obj.length ? (clone.length = obj.length) && Array.from(clone) : clone
}

/**
 * 手写深拷贝需要注意的几个点
 * JSON.stringfy 不能处理函数和正则 处理之后变为null 并且无法处理循环引用的情况
 * 处理循环引用的问题
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