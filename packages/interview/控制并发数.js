/**
 * 控制并发数
 */
//let Semaphore = require('semaphore');
class Semaphore {
  constructor(available) {
    this._available = available;
    this.waiters = [];
    //this._continue = this._continue.bind(this);
  }
  //接收任务
  take(task) {
    if (this._available > 0) {
      this._available--;
      task();
    } else {
      this.waiters.push(task);
    }
  }
  leave() {
    /* this._available++;//释放可用的资源，可用资源数+1
    this._continue(); */
    this._available++;
    let task = this.waiters.shift();
    if (task) this.take(task);
  }
  /*  _continue() {
       if (this._available > 0) {
           if (this.waiters.length > 0) {
               this._available--;
               this.waiters.shift()();
           }
       }
   } */
}
let semaphore = new Semaphore(2);
console.time('cost');
semaphore.take(() => {
  setTimeout(() => {
    console.log(1);
    semaphore.leave();
  }, 1000);
});
semaphore.take(() => {
  setTimeout(() => {
    console.log(2);
    semaphore.leave();
  }, 2000);
});
semaphore.take(() => {
  setTimeout(() => {
    semaphore.leave();
    console.log(3);
    console.timeEnd('cost');
  }, 3000);
});



/**
 * 请实现如下的函数，可以批量请求数据，所有的 URL 地址在 urls 参数中，同时可以通过 max 参数，
 * 控制请求的并发度，实现max个请求执行完之后再执行下max个请求，当所有请求结束之后，需要执行 callback 回调函数
 */


function limitRequest(tasks, max) {
  return new Promise((resolve, reject) => {
    let index = 0, start = 0, finish = 0, res = [];

    function run() {
      if (finish === tasks.length) {
        return resolve(res)
      }
      while (start < max && index < tasks.length) {
        start++;
        let cur = index;

        tasks[index++]().then(val => {
          res[cur] = val;
          start--;
          finish++;
          run();
        })
      }
    }
    run();
  })
}


var urls = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

function limitRequest2(urls, max, cb) {
  let asyncList = []

  function request(urls) {
    const url = urls.shift()

    if (url) {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(`当前发送：${url}`);
          resolve(url)
        }, 1000)
      }).finally(() => {
        if (urls.length > 0) {
          return request(urls)
        }
      })
    }
  }

  while (max--) {
    asyncList.push(request(urls))
  }

  return Promise.all(asyncList).then(cb)
}


limitRequest2(
  urls,
  3,
  () => {
    console.log('complete');
  }
)


class Scheduler {
  constructor(maxCount) {
    this.waitQueue = []
    this.count = 0
    this.maxCount = maxCount
  }

  add(promiseCreator) {
    if (this.count < this.maxCount) {
      this.count += 1
      return this.run(promiseCreator)
    } else {
      this.waitQueue.push(() => promiseCreator())
    }
  }

  run(promiseCreator) {
    promiseCreator().then(() => {
      this.count -= 1
      if (this.waitQueue.length > 0) {
        this.run(this.waitQueue.shift())
      }
    })
  }
}

const timeout = time => new Promise(resolve => setTimeout(resolve, time))
const scheduler = new Scheduler(2)
const addTask = (time, order) => {
  scheduler.add(() => timeout(time).then(() => console.log(order)))
}

addTask(1000, '1')
addTask(500, '2')
addTask(300, '3')
addTask(400, '4')
