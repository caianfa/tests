/*
实现一个定时器函数myTimer(fn, a, b)，
让fn执行，
第一次执行是a毫秒后，
第二次执行是a+b毫秒后，
第三次是a+2b毫秒，
第N次执行是a+Nb毫秒后

要求：
1、白板手撕
2、myTimer要有返回值，并且返回值是一个函数，调用该函数，可以让myTimer停掉
*/

let count = 0

function myTimer(fn, a, b) {
  let wait = 0;
  if (count === 0) {
    wait = a;
  } else {
    wait = a + count * b
  }
  count++;
  const timer = setTimeout(() => {
    fn()
    myTimer(fn, a, b)
  }, wait);

  const cancel = () => {
    clearTimeout(timer)
  }

  return cancel;
}

myTimer(() => { console.log('myTimer'); }, 1000, 2000)
