class EventEmitter {
  constructor() {
    this.events = {}
  }

  isValidListener(listener) {
    if (typeof listener === 'function') {
      return true
    } else if (listener && typeof listener === 'object') {
      this.isValidListener(listener.listener)
    } else {
      return false
    }
  }

  on(type, listener) {
    if (!this.isValidListener(listener)) {
      throw new TypeError('listener shoule be a funciton')
    }
    const listeners = this.events[type] || []
    const listenerFn = typeof listener === 'function' ? listener : listener.listener
    if (!listeners.includes(listenerFn)) {
      listeners.push({
        listener: listenerFn,
        once: false
      })
    }
  }

  once(type, listener) {
    this.on(type, {
      listener,
      once: true
    })
  }

  off(type, listener) {
    const listeners = this.events[type]
    const index = listeners.findIndex(item => item.listener === listener)
    if (index > -1) {
      listeners.splice(index, 1)
    }
  }

  emit(type) {
    const listeners = this.events[type] || []

    listeners.forEach(listener => {
      listener.listener()
      if (listener.once) {
        this.off(type, listener.listener)
      }
    })
  }
}
