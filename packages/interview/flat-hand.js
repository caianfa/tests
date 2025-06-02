// reduce + concat + isArray + recursivity

function flatDeep(arr, d = 1) {
  return d > 0
    ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), [])
    : arr.slice();
};
// var arr1 = [1, 2, 3, [1, 2, 3, 4, [2, 3, 4]]];
// flatDeep(arr1, 6);
// console.log(flatDeep(arr1, Infinity));


// 使用stack实现 flat

// var arr1 = [1, 2, 3, [1, 2, 3, 4, [2, 3, 4]]];
function flatten(arr) {
  const stack = [...arr]
  const res = []

  while (stack.length) {
    const next = stack.pop()

    if (Array.isArray(next)) {
      stack.push(...next)
    } else {
      res.push(next)
    }
  }

  return res.reverse()
}
// var arr1 = [1, 2, 3, [1, 2, 3, 4, [2, 3, 4]]];
// console.log(flatten(arr1))



// 使用生成器(generator)
function* flatten(arr) {
  for (const item of arr) {
    if (Array.isArray(item)) {
      yield* flatten(item)
    } else {
      yield item
    }
  }
}

var arr1 = [1, 2, 3, [1, 2, 3, 4, [2, 3, 4]]];
const it = flatten(arr1)
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());





/* var arr1 = [1, 2, 3, [1, 2, 3, 4, [2, 3, 4]]];

function flatten(arr, deep = 1) {
  return deep > 0
    ? arr.reduce((acc, cur) => acc.concat(Array.isArray(cur) ? flatten(cur, deep - 1) : cur), [])
    : arr.slice()
} */

/* var arr1 = [1, 2, 3, [1, 2, 3, 4, [2, 3, 4]]];

function flatten(arr) {
  const stack = [...arr]
  const result = []

  while(stack.length > 0) {
    let cur = stack.pop()

    if (Array.isArray(cur)) {
      stack.push(...cur)
    } else {
      result.unshift(cur)
    }
  }

  return result
}

console.log(flatten(arr1)); */

var arr1 = [1, 2, 3, [1, 2, 3, 4, [2, 3, 4]]];

function* flatten(arr) {
  for (const item of arr) {
    if (Array.isArray(item)) {
      yield* flatten(item)
    } else {
      yield item
    }
  }
}

const it = flatten(arr1)
console.log(...it);



// 使用reduce实现map
Array.prototype._map = function (callback) {
  if (typeof callback === 'function') {
    return this.reduce((prev, cur, index, arr) => {
      prev.push(callback(cur, index, arr))
      return prev
    }, [])
  }
}


// 实现new的效果
// 实例可以访问构造函数原型(constructor.prototype)所在原型链上的属性
// 如果构造函数返回的结果不是引用数据类型 则返回执行结果的返回值 否则返回实例对象
function newOperator(constructor, ...args) {
  let obj = Object.create(constructor.prototype)
  let res = constructor.apply(obj, args)
  if (res !== null && (typeof res === 'object' || typeof res === 'function')) {
    return res
  }
  return obj
}

// 实现bind
// 对于普通函数，绑定this指向
// 对于构造函数，要保证原函数的原型对象上的属性不能丢失(构造函数优先)
// let fn1 = fn.bind(this, 'a', 'b')
Function.prototype.bind2 = function (context, ...args1) {
  let self = this

  let fNop = function () { }
  let fBound = function (...args2) {
    self.apply(this instanceof fBound ? this : context, args1.concat(args2))
  }
  fNop.prototype = this.prototype
  fBound.prototype = new fNop()

  return fBound
}