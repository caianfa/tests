/*
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const subFlow = createFlow([() => delay(1000).then(() => log("c"))]);

createFlow([
  () => log("a"),
  () => log("b"),
  subFlow,
  [() => delay(1000).then(() => log("d")), () => log("e")],
]).run(() => {
  console.log("done");
});
需要按照 a,b,延迟1秒,c,延迟1秒,d,e, done 的顺序打印

作者：ssh_晨曦时梦见兮
链接：https://juejin.cn/post/6860646761392930830
 */


function createFlow(effects = []) {
  function fn() {
    return effects.reduce((prev, cur) => {
      return prev.then(() => {
        if (typeof cur === 'function') {
          return cur()
        } else if (Array.isArray(cur)) {
          return createFlow(cur).run()
        }
      })
    }, Promise.resolve())
  }

  fn.run = function (cb) {
    const res = fn()
    if (cb) {
      res.then(cb)
    }
    return res
  }

  return fn
}

const log = console.log;
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const subFlow = createFlow([() => delay(2000).then(() => log("c"))]);

createFlow([
  () => log("a"),
  () => log("b"),
  subFlow,
  [() => delay(3000).then(() => log("d")), () => log("e")],
]).run(() => {
  console.log("done");
});
