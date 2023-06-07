/**
 * get({ a: null }, 'a.b.c', 3)
 * get({ a: undefined }, 'a', 3)
 * get({ a: null }, 'a', 3)
 * get({ a: [{ b: 1 }]}, 'a[0].b', 3)
 */
// a[0].b => a.0.b
function get(obj, path, defaultValue = undefined) {
  const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.')
  console.log(paths);
  let result = obj

  for (const p of paths) {
    result = (result)[p]
    if (result === undefined) {
      return defaultValue
    }
  }

  return result
}

console.log(get({ a: [{ b: 321 }]}, 'a[0].b', 3));


 // ----------------------


console.log(get({ a: [{ b: 321 }]}, 'a[0].b', 3));

function get2(obj, path, defaultValue) {
  // /\[(\d+)\]/g
  const arr = path.replace(/\[(\d+)\]/g, '$1').split('.')
}