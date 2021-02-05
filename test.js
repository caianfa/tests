









function dispatchAction(queue, action) {
  const update = {
    action,
    next: null
  }

  // 环状单向链表操作
  if (queue.penging === null) {
    update.next = update
  }
}






function jsonp({ url, param, cb }) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    const arr = []
    param = { ...param, cb }

    for (const key in param) {
      arr.push(`${key}=${param[key]}`)
    }
    script.src = `${url}?${arr.join('&')}`
    document.body.appendChild(script)

    window[cb] = function() {
      resolve(param)
      document.body.removeChild(script)
    }
  })
}






















