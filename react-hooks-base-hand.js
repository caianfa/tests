



function sleep(delay) {
  let old = Date.now()

  while(true) {
    if (Date.now() - old > delay) break
  }
}

const works = [
  () => {
    console.log('第1个任务开始');
    sleep(20)
    console.log('第1个任务结束');
  },
  () => {
    console.log('第2个任务开始');
    sleep(20)
    console.log('第2个任务结束');
  },
  () => {
    console.log('第3个任务开始');
    sleep(20)
    console.log('第3个任务结束');
  },
]

function workLoop() {

}

window.requestIdleCallback

