const { asap, async } = require("rxjs")

// 遍历器的实现
const itertorable = { 0: 'a', 1: 'b', 2: 'c', length: 3 }

itertorable[Symbol.iterator] = function() {
  let index = 0
  return {
    next: function() {
      return { value: this[index], done: index++ === this.length }
    }
  }
}


// generator函数

// Generator 函数是一个状态机，封装了多个内部状态。执行 Generator 函数会返回一个遍历器对象，
// 可以依次遍历 Generator 函数内部的每一个状态，但是只有调用next方法才会遍历下一个内部状态，
// 所以其实提供了一种可以暂停执行的函数。yield表达式就是暂停标志。

/**
 * 一个线程（或函数）执行到一半，可以暂停执行，将执行权交给另一个线程（或函数），
 * 等到稍后收回执行权的时候，再恢复执行。这种可以并行执行、交换执行权的线程（或函数），就称为协程。
 */

 /**
  * 协程是一种比线程更加轻量级的存在。普通线程是抢先式的，会争夺cpu资源，
  * 而协程是合作的，可以把协程看成是跑在线程上的任务，一个线程上可以存在多个协程，
  * 但是在线程上同时只能执行一个协程
  */

// 执行器 通常，我们把执行生成器的代码封装成一个函数，并把这个执行生成器代码的函数称为执行器,co 模块就是一个著名的执行器
// co的原理

function co(iterator) {
  return new Promise((resolve, reject) => {
    function next(data) {
      let { value, done } = iterator.next()
      if (!done) {
        Promise.resolve(value).then(data => {
          next(data)
        }, reject)
      } else {
        resolve(value)
      }
    }

    next()
  })
}


/**
 * async函数对 Generator 函数的改进，体现在以下四点：

内置执行器。Generator 函数的执行必须依靠执行器，而 async 函数自带执行器，无需手动执行 next() 方法。

更好的语义。async和await，比起星号和yield，语义更清楚了。async表示函数里有异步操作，await表示紧跟在后面的表达式需要等待结果。

更广的适用性。co模块约定，yield命令后面只能是 Thunk 函数或 Promise 对象，而async函数的await命令后面，可以是 Promise 对象和原始类型的值（数值、字符串和布尔值，但这时会自动转成立即 resolved 的 Promise 对象）。

返回值是 Promise。async 函数返回值是 Promise 对象，比 Generator 函数返回的 Iterator 对象方便，可以直接使用 then() 方法进行调用。
 */

