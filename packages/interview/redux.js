
/**
 * const store = createStore(reducer, applyMiddleware(logger, thunk, promise))
 * @param {*} reducer 
 * @param {*} enhancer applyMiddleware函数的返回是一个StoreEnhancer
 */
export function createStore(reducer, enhancer) {
  let currentState = {}
  const listeners = []

  if (typeof enhancer === 'function') {
    enhancer(createStore)(reducer)
  }

  function getState() {
    return currentState
  }

  function dispatch(action) {
    currentState = reducer(currentState, action)
    listeners.forEach(listener => listener())
    return action
  }

  dispatch({ type: '@@redux/INIT' })

  function subscribe(listener) {
    listeners.push(listener)

    return () => {
      const index = listeners.indexOf(listener)
      listeners.splice(index, 1)
    }
  }
}

/*
logger

function createLoggerMiddleware({ dispatch, getState }) {
  return next => action => {
    console.log('before', getState())
    const result = next(action)
    console.log('after', getState())
    return result
  }
}
*/

function compose(...funcs) {
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

function applyMiddleware(...middlewares) {
  return (createStore) => (reducer, ...args) => {
    const store = createStore(reducer, ...args)

    let dispatch = () => {}
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args)
    }
    let chain = middlewares.map(middleware => middleware(middlewareAPI))

    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}
