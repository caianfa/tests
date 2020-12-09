// promise超时中断如何实现?

function wrapPromise(p1) {
  let abort

  let p2 = new Promise((resolve, reject) => {
    abort = () => {
      reject('失败')
    }
  })

  let p = Promise.race([p1, p2])

  p.abort = abort

  return p
}

let promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log('resolve');
    resolve()
  }, 3000)
})

let newP = wrapPromise(promise)
newP.abort()



// 利用fetch实现一个ajax方法，需要提供abort功能

function ajax(url, options) {
  return fetch()
}