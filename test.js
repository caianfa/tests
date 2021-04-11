




let arr = [1, 2, 3, 5, 7, 8, 10];
function transStr(arr) {
  let result = arr.reduce((prev, next, index, array) => {
    if (index > 0) {
      if (next === array[index - 1] + 1) {
        return prev + '~' + next
      } else {
        return prev + ',' + next
      }
    } else {
      return next
    }
  }, '')
  console.log('result', result);
  return (result + '').split(',').map(item => item.replace(/(\d{1,})(~\d{1,})*(~\d{1,})/, '$1$3')).join(',')
}
console.log(transStr(arr))


let arr = [1, 2, 3, 5, 7, 8, 10];

function transformStr(str) {
  let arr = str.split(',')
  let i = 0
  let ret = []
  for (let j = 1; j <= arr.length; j++) {
      if (arr[j] - arr[j - 1] !== 1) {
          ret.push(j - i === 1 ? arr[i] : `${arr[i]}~${arr[j - 1]}`)
          i = j
      }
  }
  return ret.join(',')
}
console.log(transformStr(arr.join(',')))




function deepCopy(obj, map = new WeakMap()) {
  const type = typeof obj

  if (obj === null || (type !== 'object' && type !== 'function')) return obj
  if (obj instanceof Date) return Date(obj)
  if (obj instanceof RegExp) return RegExp(obj)
  if (map.has(obj)) return map.get(obj)

  const target = type === 'function' ? eval(obj.toString()) : new obj.constructor();
  map.set(obj, target);

  [...Object.getOwnPropertyNames(obj), ...Object.getOwnPropertySymbols(obj)].forEach(key => {
    target[key] = deepCopy(obj[key], map)
  })

  return target
}


// a instanceof Array
function myInstanceOf(left, right) {
  if (left === null || typeof left !== 'object') return false
  let proto = Object.getPrototypeOf(left)

  while(true) {
    if (proto === right.prototype) return true
    if (proto === null) return false
    proto = Object.getPrototypeOf(proto)
  }
}
