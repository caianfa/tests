/**
 *
Semantic Versioning 是一个前端通用的版本定义规范。格式为“{MAJOR}.{MINOR}.{PATCH}-{alpha|beta|rc}.{number}”，
要求实现 compare(a, b) 方法，比较 a, b 两个版本大小。（讲了下思路，写了一半，改了个写法然后被提醒那样有问题，
然后就没有了，继续问问题，整个过程13分钟左右）
当 a > b 是返回 1；
当 a = b 是返回 0；
当 a < b 是返回 -1；
其中，rc > beta > alpha，major > minor > patch；
例子，1.2.3 < 1.2.4 < 1.3.0.alpha.1 < 1.3.0.alpha.2 < 1.3.0.beta.1 < 1.3.0.rc.1 < 1.3.0
 */

function compare(a, b) {
  let a1 = a.replace('rc', '2').replace('beta', '1').replace('alpha', '0').split('.')
  let a2 = b.replace('rc', '2').replace('beta', '1').replace('alpha', '0').split('.')

  let index = 0

  while(index < a1.length && index < a2.length) {
    if (a1[index] !==  a2[index]) return a1[index] > a2[index] ? 1 : -1
    index ++
    if (index === a1.length && index !== a2.length) {
      return a2.slice(a1.length).some(item => Number(item) !== 0) ? -1 : 1
    }
    if (index === a2.length && index !== a1.length) {
      return a1.slice(a2.length).some(item => Number(item) !== 0) ? 1: -1
    }
  }

  return 0
}

console.log(compare('1.3.0.alpha.1', '1.3.0.rc.0'));