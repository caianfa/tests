function createStore(reducer, enhancer) {
  let currentState = {}
  const listeners = []

  if (enhancer && typeof enhancer === 'function') {
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

function combineReducers(reducers) {
  return function(state, action) {
    const nextState = {}

    for (const key in reducers) {
      const reducer = reducers[key]
      const previousStateForKey = state[key]
      const nextStateForKey = reducer(previousStateForKey, action)
      nextState[key] = nextStateForKey
    }

    return nextState
  }
}

function compose(...funcs) {
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

function applyMiddleware(...middlewares) {
  return (createStore) => {
    return (reducer) => {
      const store = createStore(reducer)
      let dispatch = () => {}

      const middlewareAPI = {
        dispath: (action, ...args) => dispatch(action, ...args),
        getState: store.getState
      }

      const chain = middlewares.map(middleware > middleware(middlewareAPI))
      dispatch = compose(...chain)(store.dispatch)

      return {
        ...store,
        dispatch
      }
    }
  }
}


function logger ({ dispatch, getState }) {
  return (next) => {
    return (action) => {
      console.log('before');
      next(action)
    }
  }
}