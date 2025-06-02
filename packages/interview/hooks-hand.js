/*********************************************  精简hooks实现 start *********************************************/

/**
 * 
  与React的区别
  我们用尽可能少的代码模拟了Hooks的运行，但是相比React Hooks，他还有很多不足。以下是他与React Hooks的区别：

  React Hooks没有使用isMount变量，而是在不同时机使用不同的dispatcher。换言之，mount时的useState与update时的useState不是同一个函数。

  React Hooks有中途跳过更新的优化手段。

  React Hooks有batchedUpdates，当在click中触发三次updateNum，精简React会触发三次更新，而React只会触发一次。

  React Hooks的update有优先级概念，可以跳过不高优先的update。
 */

let isMount = true;
let workInProgressHook;

const fiber = {
  memoizedState: null,
  stateNode: App
}

function schedule() {
  workInProgressHook = fiber.memoizedState
  const app = fiber.stateNode()
  isMount = false
  return app
}

function dispatchAction(queue, action) {
  // 创建update
  const update = {
    action,
    next: null
  }

  if (queue.pending === null) {
    update.next = update
  } else {
    update.next = queue.pending.next
    queue.pending.next = update
  }

  queue.pending = update

  schedule() // react调度方法
}

function useState(initialState) {
  let hook;

  if (isMount) {
    hook = {
      queue: {
        pending:  null
      },
      memoizedState: initialState,
      next: null
    }

    if (!fiber.memoizedState) {
      fiber.memoizedState = hook;
    } else {
      workInProgressHook.next = hook
    }
    workInProgressHook = hook
  } else {
    hook = workInProgressHook
    workInProgressHook = workInProgressHook.next
  }

  let baseState = hook.memoizedState

  if (hook.queue.pending) {
    let firstUpdate = hook.queue.pending.next

    do {
      const action = firstUpdate.action
      baseState = action(baseState)
      firstUpdate = firstUpdate.next
    } while (firstUpdate !== hook.queue.pending) {
      hook.queue.pending = null
    }
  }
  hook.memoizedState = baseState

  return [baseState, dispatchAction.bind(null, hook.queue)]
}

/*********************************************  精简hooks实现 end *********************************************/


/* 简易版react实现 */

let nextUnitOfWork
let workInProgressRoot

function workLoop(deadline) {
  let shouldYiedl = false
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork)
    shouldYield = deadline.timeRemaining() < 1
  }

  if (!nextUnitOfWork && workInProgressRoot) {
    console.log('render 阶段结束');
    console.log('最终形成的Fiber树为', workInProgressRoot);
    commitRoot()
  }

  requestIdleCallback(workLoop, { timeout: 500 })
}

function performUnitOfWork(currentFiber) {
  const next = beginWork()

  if (next === null) {
    completeWork()
  }
}
