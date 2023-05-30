const PENDING = Symbol('PENDING')
const FULFILLED = Symbol('FULFILLED')
const REJECTED = Symbol('REJECTED')

/*
 new Promise((resolve, reject) => {

 })
*/

class TestPromise2 {
  constructor(executor) {
    this.status = ''
    this.successVal = ''
    this.failVal = ''
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = (value) => {
      if (this.status === PENDING) {
        this.successVal = value;
        this.status = FULFILLED;
        this.onResolvedCallbacks.forEach(fn => fn())
      }
    }

    const reject = (reason) => {
      if (this.status === PENDING) {
        this.failVal = reason
        this.status = REJECTED
        this.onRejectedCallbacks(fn => fn())
      }
    }

    executor(resolve, reject)
  }

  resolvePromise(resPromise, data, resolve, reject) {
    if (resPromise === data) throw new Error('循环引用')
    if (!(data instanceof TestPromise2)) {
      return resolve(data);
    }
    try {
      let then = data.then;
      const onResolved = (value) => {
        this.resolvePromise(resPromise, value, resolve, reject);
      }
      const onRejected = (reason) => {
        reject(reason)
      }
      then.call(data, onResolved, onRejected)
    } catch (error) {
      reject(error)
    }
  }

  then(onResolved, onRejected) {
    let resPromise;
    resPromise = new TestPromise2((resolve, reject) => {
      const resolveFn = (value) => {
        try {
          let data = onResolved(value);
          this.resolvePromise(resPromise, data, resolve, reject);
        } catch (error) {
          reject(error)
        }
      }
      const rejectFn = (reason) => {
        try {
          let data = onRejected(reason)
          this.resolvePromise(resPromise, data, resolve, reject)
        } catch (error) {
          onRejected(reason)
        }
      }

      switch (this.status) {
        case PENDING:
          this.onResolvedCallbacks.push(resolveFn);
          this.onRejectedCallbacks.push(rejectFn);
          break;
        case FULFILLED:
          this.resolveFn(this.successVal);
        case REJECTED:
          this.rejectFn(this.failVal);
        default:
          break;
      }
    })

    return resPromise;
  }

  all(promises) {
    return new TestPromise2((resolve, reject) => {
      let count = 0;
      let res = []
      let curPromise;

      for(let i = 0; i < promises.length; i++) {
        curPromise = promises[i];
        curPromise.then((value) => {
          if (count < promises.length) {
            res[i] = value;
            count++;
          } else {
            resolve(res)
          }
        }).catch(error => {
          reject(error)
        })
      }
    })
  }

  allSettled(promises) {
    return TestPromise2.all(
      promises.map(p => {
        p
        .then(res => ({ status: 'fulfilled', value: res }))
        .catch(reason => ({ status: 'rejected', reason }))
      })
    )
  }

  race(promises) {
    return new TestPromise2((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        let curPromise = promises[i]
        curPromise.then(value => {
          resolve(value)
        }).catch(error => {
          reject(error)
        })
      }
    })
  }

  finally(callback) {
    // 无论当前 Promise 是成功还是失败，调用finally之后都会执行 finally 中传入的函数，并且将值透传下去
    this.then(
      value => Promise.resolve(callback()).then(value => value),
      reason => Promise.resolve(callback()).then(() => { throw reason; })
    )
  }
}