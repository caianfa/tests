// 能不能手动实现一下instanceof的功能
function myInstanceof(left, right) {   // obj myInstanceof Object
  if (typeof left !== 'object' || left === null) return false
  let proto = Object.getPrototypeOf(left)

  while (true) {
    if (proto === null) return false
    if (proto === right.prototype) return true
    proto = Object.getPrototypeOf(proto)
  }
}

// Object.is和===的区别 ?
console.log(Object.is(NaN, NaN)); // true
console.log(NaN === NaN); // false

console.log(Object.is(+0, -0)); // false
console.log(+0 === -0); // true



// 继承1  原型链继承
// 缺点 1.引用类型的属性被所有实例共享  2. 在创建Child的实例时，不能向Parent传参
function Parent() {
  this.name = 'thomas'
}

Parent.prototype.getName = function () {
  return this.name
}

function Child() { }

Child.prototype = new Parent()

// 继承2 借用构造函数(经典继承)
// 优点 避免了引用类型被所有实例共享  可以在Child中向Parent传参
// 缺点 属性和方法都在构造函数中定义，每次实例化都会创建一遍方法
function Parent() {
  this.name = ['thomas', 'ying']
}

function Child() {
  Parent.call(this)
}

// 继承3  组合继承
// 缺点 组合继承最大的缺点是会调用两次父构造函数。
function Parent(name) {
  this.name = name
  this.colors = ['red', 'blue', 'green']
}

Parent.prototype.getName = function () {
  console.log(this.name);
}

function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}

Child.prototype = new Parent();
Child.prototype.constructor = Child; // 修正 Child.prototype.constructor属性，因为在上面一句表达式中constructor被置为了 Parent

// 继承4 寄生组合继承
function Parent(name) {
  this.name = name
  this.colors = ['red', 'blue', 'green']
}

Parent.prototype.getName = function() {
  console.log(this.name);
}

function Child(name, age) {
  Parent.call(this, name)
  this.age = age
}

/**
 * const F = function() {}
 * F.prototype = Parent.prototype
 * Child.prototype = new F()
 */
Child.prototype = Object.create(Parent.prototype)
Child.prototype.constructor =  Child



// flat实现
const arr = [1, [2, 3, 4], [5, 6, [7, 8]], 9]

const result = []
function flat(arr) {
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      flat(arr[i])
    } else {
      result.push(arr[i])
    }
  }
  return result
}
console.log(flat(arr));

const arr = [1, [2, 3, 4], [5, 6, [7, 8]], 9]
function flatten(arr) {
  return arr.reduce((p, c) => {
    return p.concat(Array.isArray(c) ? flatten(c) : c)
  }, [])
}
console.log(flatten(arr));


const arr = [1, [2, 3, 4], [5, 6, [7, 8]], 9]
function flattenStack(arr) {
  let stack = [...arr]
  let result = []

  while (stack.length > 0) {
    let cur = stack.pop()
    if (Array.isArray(cur)) {
      stack.push(...cur)
    } else {
      result.push(cur)
    }
  }

  return result.reverse()
}
console.log(flattenStack(arr));

function* flattenGenerator(arr) {
  for (let item of arr) {
    if (Array.isArray(item)) {
      yield* flattenGenerator(item)
    } else {
      yield item
    }
  }
}
const arr = [1, [2, 3, 4], [5, 6, [7, 8]], 9]

console.log([...flattenGenerator(arr)]);


// 实现new  const n = new P()
function newOperator(Constructor, ...args) {
  let obj = Object.create(Constructor.prototype)
  let res = Constructor.apply(obj, args)

  return typeof res === 'object' || typeof res === 'function' ? res : obj
}