
/*
这与 Redux 中 applyMiddleware() 的实现已经很接近了，但是有三个重要的不同之处：

它只暴露一个 store API 的子集给 middleware：dispatch(action) 和 getState()。

它用了一个非常巧妙的方式，以确保如果你在 middleware 中调用的是 store.dispatch(action) 而不是 next(action)
那么这个操作会再次遍历包含当前 middleware 在内的整个 middleware 链。这对异步的 middleware 非常有用，正如我们在之前的章节中提到的。

为了保证你只能应用 middleware 一次，它作用在 createStore() 上而不是 store 本身。
因此它的签名不是 (store, middlewares) => store， 而是 (...middlewares) => (createStore) => createStore。

由于在使用之前需要先应用方法到 createStore() 之上有些麻烦，createStore() 也接受将希望被应用的函数作为最后一个可选参数传入。
*/

function logger(store) {
  return function wrapDispatchToAddLogging(next) {
    return function dispatchAndLog(action) {
      console.log('dispatching', action)
      let result = next(action)
      console.log('next state', store.getState())
      return result
    }
  }
}


function compose(...funcs) {
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

/*
const store = createStore(reducer, applyMiddleware(logger, thunk))
*/
function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, ...args) => {
    const store = createStore(reducer, ...args)
    
    let dispatch = () => {}
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args)
    }

    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}





