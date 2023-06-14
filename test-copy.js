class Task {
  constructor(){
      this.queue = []
      Promise.resolve().then(() => {
        let sequence = Promise.resolve();
        this.queue.forEach((item) => {
          sequence = sequence.then(item)
        })
      })
  }
  log(text) {
      this.queue.push(async () => await console.log(text))
      return this
  }
  async sleep(time) {
      new Promise((resolve) => {
          setTimeout(() => {
              // console.log('resolve');
              resolve()
          }, time * 1000)
      })
  }
  wait(time) {
      this.queue.push(async () => {
        await new Promise((resolve) => {
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