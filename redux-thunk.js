function createThunkMiddleware({ dispatch, getState }) { // 这里的dispatch 代表store.dispatch
  return (next) => (action) => {
    if (typeof action === 'function') {
      action(dispatch, getState)
    } else {
      next(action)  // next 代表已经被之前的中间件增强过的dispatch
    }
  }
}