// 观察者

class Observer {
  // 观察者需要提供对外的更新方法
  constructor(fn) {
    this.update = fn
  }
}


// 被观察者

class Subject {
  // 如果被观察者发生变化 则需要通知所有的观者者
  constructor() {
    this.observers = []
  }

  subscribe(observer) {
    this.observers.push(observer)
  }

  notify() {
    this.observers.forEach(observer => observer.update())
  }

  unsubscribe(observer) {
    let index = this.observers.findIndex(item => item === observer)
    if (index !== -1) {
      this.observers.splice(index, 1)
    }
  }
}