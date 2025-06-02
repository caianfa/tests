class Task {
  constructor(){
      this.queue = []
      Promise.resolve().then(async () => {
        // let sequence = Promise.resolve();
        // this.queue.forEach((item) => {
        //   sequence = sequence.then(item)
        // })
        for (const task of this.queue) {
          await task();
        }
      })
  }
  log(text) {
      this.queue.push(() => console.log(text))
      return this
  }
  wait(time) {
      this.queue.push(() => {
        return new Promise((resolve) => {
          setTimeout(() => {
              console.log('resolve');
              resolve()
          }, time * 1000)
        })
      })
      return this
  }
}
const t = new Task()
t
  .log(1)
  .log(2)
  .wait(3)
  .log(4)
  .wait(2)
  .wait(3)
  .log(6)