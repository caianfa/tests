// reduce + concat + isArray + recursivity

function flatDeep(arr, d = 1) {
  return d > 0
    ? arr.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatDeep(val, d - 1) : val), [])
    : arr.slice();
};
// var arr1 = [1, 2, 3, [1, 2, 3, 4, [2, 3, 4]]];
// flatDeep(arr1, 6);
// console.log(flatDeep(arr1, Infinity));


// 使用stack实现 flat

// var arr1 = [1, 2, 3, [1, 2, 3, 4, [2, 3, 4]]];
function flatten(arr) {
  const stack = [...arr]
  const res = []

  while(stack.length) {
    const next = stack.pop()

    if (Array.isArray(next)) {
      stack.push(...next)
    } else {
      res.push(next)
    }
  }

  return res.reverse()
}
// var arr1 = [1, 2, 3, [1, 2, 3, 4, [2, 3, 4]]];
// console.log(flatten(arr1))



// 使用生成器(generator)
function* flatten(arr) {
  for (const item of arr) {
    if (Array.isArray(item)) {
      yield* flatten(item)
    } else {
      yield item
    }
  }
}

var arr1 = [1, 2, 3, [1, 2, 3, 4, [2, 3, 4]]];
const it = flatten(arr1)
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
