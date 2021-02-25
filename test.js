const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'
const PENDING = 'pending'

class NewPromise {
  static resolve(value) {
    return new NewPromise((resolve) => {
      resolve(value)
    })
  }
  static reject(reason) {
    return new NewPromise((resolve, reject) => {
      reject(reason)
    })
  }
  constructor(executor) {
    this.successVal = null
    this.failVal = null
    this.status = PENDING
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = (value) => {
      setTimeout(() => {
        if (this.status === PENDING) {
          this.status = FULFILLED
          this.successVal = value
          this.onResolvedCallbacks.forEach(fn => fn())
        }
      })
    }
    const reject = (value) => {
      setTimeout(() => {
        if (this.status === PENDING) {
          this.status = REJECTED
          this.failVal = value
          this.onRejectedCallbacks.forEach(fn => fn())
        }
      });
    }

    try {
      executor(resolve, reject)
    } catch(e) {
      reject(e)
    }
  }
  then(onResolve, onReject) {
    typeof onResolve === 'function' ? onResolve : data => data
    typeof onReject === 'function' ? onReject : err => { throw err }

    let resPromise

    switch (this.status) {
      case FULFILLED:
        resPromise = new NewPromise((resolve, reject) => {
          try {
            let data = onResolve(this.successVal)
            this.resolvePromise(resPromise, data, resolve, reject)
          } catch(e) {
            reject(e)
          }
        })
        break;
      case REJECTED:
        resPromise = new NewPromise((resolve, reject) => {
          try {
            let data = onReject(this.failVal)
            this.resolvePromise(resPromise, data, resolve, reject)
          } catch(e) {
            reject(e)
          }
        })
      case PENDING:
        resPromise = new NewPromise((resolve, reject) => {
          const resolveFn = () => {
            try {
              let data = onResolve(this.successVal)
              this.resolvePromise(resPromise, data, resolve, reject)
            } catch(e) {
              reject(e)
            }
          }
          const rejectFn = () => {
            try {
              let data = onReject(this.failVal)
              this.resolvePromise(resPromise, data, resolve, reject)
            } catch(e) {
              reject(e)
            }
          }
          this.onResolvedCallbacks.push(resolveFn)
          this.onRejectedCallbacks.push(rejectFn)
        })
    }

    return resPromise
  }
  resolvePromise(resPromise, data, newResolve, newReject) {
    if (resPromise === data) {
      return newReject(new TypeError('循环引用了'))
    }
    if (!(data instanceof NewPromise)) {
      return newResolve(data)
    }
    let then = data.then
    const resolveFn = (newData) => {
      return this.resolvePromise(resPromise, newData, newResolve, newReject)
    }
    const rejectFn = (reason) => {
      return newReject(reason)
    }
    try {
      then.call(data, resolveFn, rejectFn)
    } catch(e) {
      newReject(e)
    }
  }
  all(promises) {
    return new NewPromise((resolve, reject) => {
      let doneCount = 0
      let res = []

      for (let i = 0; i < promises.length; i++) {
        let curPromise = promises[i]
        curPromise.then((value) => {
          doneCount++
          res[i] = value
          if (doneCount === promises.length) {
            resolve(res)
          }
        }).catch(err => {
          reject(err)
        })
      }
    })
  }
  race(promises) {
    return new NewPromise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        let curPromise = promises[i]
        curPromise.then(res => {
          resolve(res)
        }, reject)
      }
    })
  }
  finally(callback) {
    return this.then(
      value => NewPromise.resolve(callback()).then(() => value),
      reason => NewPromise.resolve(callback()).then(() => { throw reason })
    )
  }
}

let p = new NewPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功')
  }, 2000)
})
p.then(val => {
  console.log(val);
  return new NewPromise((resolve, reject) => {
    resolve('红红火火')
  })
}).then(val => {
  console.log(val);
})
