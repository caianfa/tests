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