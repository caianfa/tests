const PENDING = Symbol('PENDING')
const FULFILLED = Symbol('FULFILLED')
const REJECTED = Symbol('REJECTED')

class TestPromise {
  static resolve(value) {
    return new TestPromise((resolve) => {
      resolve(value)
    })
  }

  static reject(reason) {
    return new TestPromise((_resolve, reject) => {
      reject(reason)
    })
  }

  static all(promises) {
    return new TestPromise((resolve, reject) => {
      let count = 0
      let res = []

      for (let i = 0; i < promises.length; i++) {
        let curPromise = promises[i]
        curPromise.then((value) => {
          if (count < promises.length) {
            count++
            res[i] = value
          } else {
            resolve(res)
          }
        }, reject)
      }
    })
  }

  static allSettled(promises) {
    return TestPromise.all(
      promises.map(promise => {
        promise
          .then(value => ({ status: 'fulfilled', value }))
          .catch(reason => ({ status: 'rejected', reason }))
      })
    )
  }

  static race(promises) {
    return new TestPromise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        let curPromise = promises[i]
        curPromise.then(resolve, reject)
      }
    })
  }

  constructor(executor) {
    this.status = ''
    this.successVal = ''
    this.failVal = ''
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

    const reject = (reason) => {
      setTimeout(() => {
        if (this.status === PENDING) {
          this.status = REJECTED
          this.failVal = reason
          this.onRejectedCallbacks.forEach(fn => fn())
        }
      })
    }

    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onResolved, onRejected) {
    let resPromise

    switch (this.status) {
      case FULFILLED:
        resPromise = new TestPromise((resolve, reject) => {
          try {
            let data = onResolved(this.successVal)
            this.resolvePromise(resPromise, data, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
        break;
      case REJECTED:
        resPromise = new TestPromise((resolve, reject) => {
          try {
            let data = onRejected(this.failVal)
            this.resolvePromise(resPromise, data, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
        break;
      case PENDING:
        resPromise = new TestPromise((resolve, reject) => {
          const resolveFn = (value) => {
            try {
              let data = onResolved(this.successVal)
              this.resolvePromise(resPromise, data, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }

          const rejectFn = (reason) => {
            try {
              let data = onRejected(this.failVal)
              this.resolvePromise(resPromise, data, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }

          this.onResolvedCallbacks.push(resolveFn)
          this.onRejectedCallbacks.push(rejectFn)
        })
      default:
        break;
    }

    return resPromise
  }

  resolvePromise(resPromise, data, resolve, reject) {
    if (resPromise === data) {
      throw new TypeError('循环引用')
    }
    if (!(data instanceof TestPromise) && !(typeof data === 'object' && data.then)) {
      return resolve(data)
    }

    try {
      const then = data.then
      const resolveFn = (newData) => {
        this.resolvePromise(resPromise, newData, resolve, reject)
      }
      const rejectFn = (newData) => {
        this.resolvePromise(resPromise, newData, resolve, reject)
      }
      then.call(data, resolveFn, rejectFn)
    } catch (e) {
      reject(e)
    }
  }

  catch(onRejected) {
    this.then(null, onRejected)
  }

  finally(callback) { // 无论当前 Promise 是成功还是失败，调用finally之后都会执行 finally 中传入的函数，并且将值透传下去
    this.then(
      value => Promise.resolve(callback()).then(() => value),
      reason => Promise.resolve(callback()).then(() => { throw reason })
    )
  }
}