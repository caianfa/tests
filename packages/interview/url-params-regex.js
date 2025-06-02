/**
 * x(?=y)  先行断言 匹配'x'仅仅当'x'后面跟着'y'. 例：/Jack(?=Sprat)/会匹配到'Jack'仅当它后面跟着'Sprat'(只会匹配Jack 不会匹配Sprat) 
 * (?<=y)x 后行断言 匹配'x'仅当'x'前面是'y'.    例： /(?<=Jack)Sprat/会匹配到' Sprat '仅仅当它前面是' Jack '
 * x(?!y)  正向否定查找 仅仅当'x'后面不跟着'y'时匹配'x'.
 * (?<!y)x 反向否定查找 仅仅当'x'前面不是'y'时匹配'x'.
 */


// url参数对象转换
/* --------------------------------------------------------------------------------------------------- */
function getUrlParams(url) {
  return url.match(/([^?&=]+)(=[^&]*)/g).reduce((acc, cur) => {
    acc[cur.slice(0, cur.indexOf('='))] = cur.slice(cur.indexOf('=') + 1)
    return acc
  }, {})
}

// console.log('http://url.com/page?name=Adam&surname=Smith'.match(/([^?&=]+)(=[^&]*)/g));
// [ 'name=Adam', 'surname=Smith' ]

console.log(getUrlParams('http://url.com/page?name=Adam&surname=Smith'));

function getUrlParams(url) {
  const search = url.split('?')[1]
  const searchArr = search.split('&')

  return searchArr.reduce((acc, cur) => {
    acc[cur.slice(0, cur.indexOf('='))] = cur.slice(cur.indexOf('=') + 1)
    return acc
  }, {})
}

console.log(getUrlParams('http://url.com/page?name=Adam&surname=Smith'));
/* --------------------------------------------------------------------------------------------------- */



// 数字千分位分割
// https://juejin.im/post/6844903609029623815
/* --------------------------------------------------------------------------------------------------- */
(1232432432).toLocaleString() // 支持参数选项 'en-IN' 'de-DE' 等 详细见https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString


/**
 * \B匹配非单词边界
 * ?=(\d{3})+ 表示匹配后面有三个数字的位置  这一步匹配结果是(1|2|3|4|5|678)中划线位置
 * (?!\d)表示匹配到的位置后面不能再跟数字
 */
'12345678'.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
console.log('12345678'.replace(/\B(?=(\d{3})+(?!\d))/g, ','));






