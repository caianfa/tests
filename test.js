







function co(gen) {
  const it = gen()

  return new Promise((resolve, reject) => {
    function next(data) {
      const { value, done } = it.next()

      if (!done) {
        value.then(data => {
          next(data)
        }, reject)
      } else {
        resolve(value)
      }
    }

    next()
  })
}