// react中简易的处理方法
useEffect(() => {
  let didCancel = false

  fetch('/api/user').then(res => res.json()).then(data => {
    if (!didCancel) {
      setState(data)
    }
  })

  return () => {
    didCancel = true
  }
}, [])


// 使用id标记的方法
let lastFetchId = 0

function fetchUser() {
  lastFetchId += 1
  let fetchId = lastFetchId

  fetch('/api/user').then(res => res.json()).then(data => {
    if (fetchId !== lastFetchId) return
    setState(data)
  })
}


// 封装对比请求的promise是否一直的 处理方法
class RaceConditionGuard {
  lastPromise = null

  getGuardPromise(promise) {
    this.lastPromise = promise
    const currentPromise = this.lastPromise

    return this.lastPromise.then((response) => {
      if (currentPromise !== this.lastPromise) return 
      return response
    })
  }
}