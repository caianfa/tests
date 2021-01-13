
// compose
export default function compose(...funcs) {
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}


// curry 
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args)
    } else {
      return function (...args2) {
        return curried.apply(this, args.concat(args2))
      }
    }
  }
}

function add(a, b, c) {
  return a + b + c
}

const addCurry = curry(add)
console.log(addCurry(1, 2)(4));

/**
 函数柯里化，要求实现
    add(1,2,3).sumof()     //6
    add(1)(2)(3).sumof()  //6
    add(1,2)(3).sumof()   //6
 */

function add(...args) {
  const addFn = () => args.reduce((p, c) => p + c, 0)

  const fn = (...args2) => {
    return add(...args, ...args2)
  }

  fn.sumof = () => {
    console.log(addFn(args));
  }

  return fn
}

add(1,2,3).sumof()
add(1)(2,3).sumof()
add(1,2,3,4)(5)(6)(7).sumof()