function promisfy(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, function(err, data) {
        if (err) reject()
        resolve(data)
      })
    })
  }
}