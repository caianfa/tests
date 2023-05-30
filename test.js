const fs = require('fs/promises');

(async function() {
    const fileContent = await fs.readFile('./package.json', {
        encoding: 'utf-8'
    });




// compose

function compose(...fns) {
  return fns.reduce((a, b) => (...args) => a(b(...args)))
}

const a = () => {console.log('hello')}
const b = () => {console.log('world')}
const c = () => {console.log('caianfa')}

let res = compose(a, b, c)
console.log(res());


// curry

function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args)
    } else {
      return function(...args2) {
        return curried.apply(this, args.concat(args2))
      }
    }
  }
}

// 实现懒加载

function lazyLoad(dom) {
  const offsetTop = dom.offsetTop;
  const scrollTop = document.documentElement.scrollTop;
  const viewHeight = document.documentElement.clientHeight;

  if (offsetTop < scrollTop + viewHeight) {
    dom.src = dom.getAttribute('data-src')
  }
}

function lazyLoad2(dom) {
  const top = dom.getBoundingClientRect().top
  const scrollTop = document.documentElement.scrollTop
  const viewHeight = document.documentElement.clientHeight

  if (top < scrollTop + viewHeight) {
    dom.src = dom.setAttribute('data-src')
  }
}
