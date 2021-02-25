const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

class MyPromise {
  static resolve(value) {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  static reject(reason) {
    return new Promise((resolve, reject) => {
      reject()
    })
  }

  constructor(exectuor) {
    this.status = ''
    this.successVal = ''
    this.failedVal = ''
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = (value) => {
      setTimeout(() => {
        if (this.status !== PENDING) return
        this.status = FULFILLED
        this.successVal = value
        this.onResolvedCallbacks.forEach(fn => fn())
      })
    }

    const reject = (reason) => {
      setTimeout(() => {
        if (this.status !== PENDING) return
        this.status = REJECTED
        this.failedVal = reason
        this.onRejectedCallbacks.forEach(fn => fn())
      })
    }

    try {
      exectuor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(resolvedFn, rejectedFn) {
    resolvedFn = typeof resolvedFn === 'function' ? resolvedFn : val => val
    rejectedFn = typeof rejectedFn === 'function' ? rejectedFn : err => { throw err }
    let resPromise

    switch (this.status) {
      case FULFILLED:
        resPromise = new MyPromise((resolve, reject) => {
          try {
            let data = resolvedFn(this.successVal)
            this.resolvePromise(resPromise, data, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
        break;
      case REJECTED:
        resPromise = new MyPromise((resolve, reject) => {
          try {
            let data = rejectedFn(this.failedVal)
            this.resolvePromise(resPromise, data, resolve, reject)
          } catch (e) {
            reject(e)
          }
        })
      case PENDING:
        resPromise = new MyPromise((resolve, reject) => {
          const resolveFunction = () => {
            try {
              let data = resolve(this.successVal)
              this.resolvePromise(resPromise, data, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }
          const rejectFunction = () => {
            try {
              let data = reject(this.failedVal)
              this.resolvePromise(resPromise, data, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }
          this.onResolvedCallbacks.push(resolveFunction)
          this.onRejectedCallbacks.push(rejectFunction)
        })
      default:
        break;
    }

    return resPromise
  }

  catch(onRejected) {
    this.then(null, onRejected)
  }

  resolvePromise(resPromise, data, resolve, reject) {
    if (resPromise === data) {
      throw new TypeError('循环引用')
    }
    if (!(data instanceof MyPromise)) {
      return resolve(data)
    }
    try {
      let then = data.then
      const resolveFunction = (newData) => {
        this.resolvePromise(resPromise, newData, resolve, reject)
      }
      const rejectFunction = (err) => {
        reject(err)
      }
      then.call(data, resolveFunction, rejectFunction)
    } catch (e) {
      reject(e)
    }
  }

  all(promises) {
    return new MyPromise((resolve, reject) => {
      const res = new Array(promises.length)
      let count = 0

      for (let i = 0; i < promises.length; i++) {
        let curPromise = promises[i]
        curPromise.then(data => {
          res[i] = data
          count++
          if (count === promises.length) {
            resolve(res)
          }
        }, reject)
      }
    })
  }

  allSettled(promises) {
    return MyPromise.all(
      promises.map((promise, index) =>
        promise
        .then(value => ({ status: 'fulfilled', value })
        .catch(reason => ({ status: 'rejected', reason }))
      ))
    )
  }

  race(promises) {
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        let curPromise = promises[i]
        if (!(curPromise instanceof MyPromise)) {
          return reject(new TypeError('必须为MyPromise类型'))
        }
        curPromise.then(resolve, reject)
      }
    })
  }
}
