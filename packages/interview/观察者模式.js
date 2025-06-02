class Observer { // 观察者
  constructor(fn) {
    this.update = fn
  }
}

class Subject { // 被观察者
  constructor() {
    this.observers = []
  }

  add(observer) {
    this.observers.push(observer)
  }

  notify() {
    this.observers.forEach(observer => observer.update())
  }
}