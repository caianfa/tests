// promise 三种状态 pending fulfilled rejected
class MyPromise {
  static resolve(value) {
    return new MyPromise((resolve, reject) => {
      resolve(value)
    })
  }
  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }
  constructor(executor) {
    this.status = 'pending'
    this.suceessVal = null
    this.failVal = null
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = (value) => {
      setTimeout(() => {
        if (this.status !== 'pending') return // promise状态不可逆
        this.status = 'resolve'
        this.suceessVal = value
        this.onResolvedCallbacks.forEach(fn => fn())
      })
    }

    const reject = (failVal) => {
      setTimeout(() => {
        if (this.status !== 'pending') return
        this.status =
        this.failVal = failVal
        this.onRejectedCallbacks.forEach(fn => fn())
      })
    }

    try {
      executor(resolve, reject)
    } catch(e) {
      reject(e)
    }
  }

  then(onResolved, onRejected) {
    onResolved = typeof onResolved === 'function' ? onResolved : value => value // 解决then传参数的问题 可以只传一个参数
    onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e }
    let resPromise

    switch(this.status) {
      case 'resolve':
        resPromise = new MyPromise((resolve, reject) => { // 返回新的promise 实现链式调用
          try {
            // console.log(resPromise);
            let data = onResolved(this.suceessVal) // 实现链式调用传递给下一个then
            // data可以是任何值
            // then方法可以返回任何值，当然包括Promise对象，而如果是Promise对象，我们就需要将他拆解，直到它不是一个Promise对象，取其中的值
            this.resolvePromise(resPromise, data, resolve, reject) // 传入resPromise 是为了检测是否循环引用
          } catch(e) {
            reject(e)
          }
        })
        break
      case 'reject':
        resPromise = new MyPromise((resolve, reject) => {
          try {
            let data = onRejected(this.failVal)
            this.resolvePromise(resPromise, data, resolve, reject)
          } catch(e) {
            reject(e)
          }
        })
        break
      case 'pending':
        resPromise = new Promise((resolve, reject) => {
          const resolveFunction = () => {
            try {
              let data = onResolved(this.suceessVal)
              this.resolvePromise(resPromise, data, resolve, reject)
            } catch(e) {
              reject(e)
            }
          }
          const rejectFunction = () => {
            try {
              let data = onRejected(this.failVal)
              this.resolvePromise(resPromise, data, resolve, reject)
            } catch(e) {
              reject(e)
            }
          }
          this.onResolvedCallbacks.push(resolveFunction)
          this.onRejectedCallbacks.push(rejectFunction)
        })
    }

    return resPromise
  }

  resolvePromise(resPromise, data, newResolve, newReject) {
    console.log(resPromise);
    if (data === resPromise) {
      return newReject(new TypeError('循环引用'))
    }
    if (!(data instanceof MyPromise)) {
      return newResolve(data)
    }
    try {
      let then = data.then
      const resolveFunction = (newData) => {
        this.resolvePromise(resPromise, newData, newResolve, newReject)
      }
      const rejectFunction = (err) => {
        newReject(err)
      }
      then.call(data, resolveFunction, rejectFunction)
    } catch(e) {
      newReject(e)
    }
  }

  all(promises) {

  }
}


// new MyPromise((resolve, reject)=>{
//   resolve(1);
// }).then((resp)=>{
//   console.log(resp); // 1
//   return 2;
// }).then((resp)=>{
//  console.log(resp); // 2
// })


// // 循环引用
// let testPromise = new ObjPromise((resolve, reject) => {
//   resolve(1);
// })
// let testPromiseB = testPromise.then((resp) => {
//   console.log(resp); // 1
//   return testPromiseB;
// })

// new MyPromise((resolve, reject) => {
//   resolve(1);
// }).then((resp) => {
//   console.log(resp); // 1
//   return 2
// }).then((resp) => {
//   console.log(resp); // 2
//   return new MyPromise((resolve, reject) => {
//       resolve(3)
//   })
// }).then((resp) => {
//   console.log(resp); // 3
// });

new MyPromise((resolve, reject) => {
  setTimeout(() => {
      resolve(1);
  }, 100)
}).then((resp) => {
  console.log(resp); // 1
  return 2
}).then((resp) => {
  console.log(resp); // 2
  return new MyPromise((resolve, reject) => {
      resolve(3)
  })
}).then((resp) => {
  console.log(resp); // 3
});


// const p = new Promise((resolve, reject) => {
//   if (Math.random() * 10 > 5) {
//     resolve('success')
//   } else {
//     reject('fail')
//   }
// })
// p.then(() => {} ,() => {})
// 异步promise实现
/**
 *
设置两个数组，分别存起来then()方法的回调函数onResolved和onRejected
当等到调用了resolve或者reject时，执行对应数组内存入的回调函数即可
另外为了保证执行顺序,等待当前执行栈执行完成，咱们还需要给constructor的resolve和reject函数里面使用setTimeout包裹起来，避免影响当前执行的任务。
 */
class TestPromise {
  constructor(executor) {
    this.status = 'pending'
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []
    this.suceessVal = null
    this.failVal = null

    const resolve = (value) => {
      setTimeout(() => {
        if (this.status !== 'pending') return
        this.status = 'resolve'
        this.suceessVal = value
        this.onResolvedCallbacks.forEach(fn => fn())
      }, 0);
    }
    const reject = (reason) => {
      setTimeout(() => {
        if (this.status !== 'pending') return
        this.status = 'reject'
        this.failVal = reason
        this.onRejectedCallbacks.forEach(fn => fn())
      }, 0);
    }
    try {
      executor(resolve, reject)
    } catch(e) {
      reject(e)
    }
  }
  resolvePromise(promise, data, newResolve, newReject) {
    if (promise === data) {
      newReject(new TypeError('循环引用了'))
    }
    // 如果data是promise 则执行其的then方法
    if (!(data instanceof TestPromise)) {
      return newResolve(data)
    }
    try {
      let then = data.then
      const resolveFn = (newData) => {
        this.resolvePromise(promise, newData, newResolve, newReject) // 当是promise类型时，用this.resolvePromise(newData, newResolve, newReject)来递归的调用then方法，直到data不为promise，然后resolve结果就行啦
      }
      const rejectFn = (newReason) => {
        newReject(newReason)
      }
      then.call(data, resolveFn, rejectFn)
    } catch(e) {
      newReject(e)
    }
  }
  then(onResolved, onRejected) {
    onResolved = typeof onResolved === 'function' ? onResolved : data => data
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err }
    let resPromise

    switch (this.status) {
      case 'resolve':
        resPromise = new TestPromise((resolve, reject) => {
          try {
            let data = onResolved(this.suceessVal)
            this.resolvePromise(resPromise, data, resolve, reject)
          } catch(e) {
            reject(e)
          }
        })
        break;
      case 'reject':
        resPromise = new TestPromise((resolve, reject) => {
          try {
            let data = onRejected(this.failVal)
            this.resolvePromise(resPromise, data, resolve, reject)
          } catch(e) {
            reject(e)
          }
        })
        break
      case 'pending':
        resPromise = new TestPromise((resolve, reject) => {
          const resolveFn = () => {
            try {
              let data = onResolved(this.suceessVal)
              this.resolvePromise(resPromise, data, resolve, reject)
            } catch(e) {
              reject(e)
            }
          }
          const rejectFn = () => {
            try {
              let data = onRejected(this.failVal)
              this.resolvePromise(resPromise, data, resolve, reject)
            } catch(e) {
              reject(e)
            }
          }
          this.onResolvedCallbacks.push(resolveFn)
          this.onRejectedCallbacks.push(rejectFn)
        })
        break
    }

    return resPromise
  }
}

new TestPromise((resolve, reject) => {
  setTimeout(() => {
      resolve(1);
  }, 2000)
}).then((resp) => {
  console.log(resp); // 1
  return 2
}).then((resp) => {
  console.log(resp); // 2
  return new TestPromise((resolve, reject) => {
      resolve(3)
  })
}).then((resp) => {
  console.log(resp); // 3
});