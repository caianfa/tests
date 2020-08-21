function reduxPromise({ dispatch, getState }) {
  return next => action => {
    if (action instanceof Promise) {
      action.then(dispatch)
    }
  }
}