









function dispatchAction(queue, action) {
  const update = {
    action,
    next: null
  }

  // 环状单向链表操作
  if (queue.penging === null) {
    update.next = update
  }
}
























