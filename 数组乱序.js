// https://juejin.im/post/6844903863812620296

/**
 * arr.sort(() =>Math.random() - 0.5);
 * 
 * 上面不能实现真正的乱序的原因是 v8中的 Array.sort方法使用了插入排序和快排两种方案
 * 当目标数组长度小于10时，使用插入排序 反之，使用快排
 * 
 * 
 * 真正的乱序理论上要比较 n(n-1) / 2次 也就是每个元素都需要进行两两比较 才有交换的可能
 */

 function shuffle(arr) {
   let m = arr.length
   while(m > 1) {
     let index = Math.floor(Math.random() * m--)
   }
 }