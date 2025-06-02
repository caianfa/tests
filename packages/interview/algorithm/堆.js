// https://github.com/sisterAn/JavaScript-Algorithms/issues/60

/**
 * 堆的概念
 *    堆一定是完全二叉树
 *    堆上的任意节点值都必须大于等于（大顶堆）或小于等于（小顶堆）其左右子节点值
 */

/**
 * 如何创建大小顶堆
 * 
 * 完全二叉树适用于数组存储法，而堆又是一个完全二叉树，使用可以直接使用数组存储法存储
 * 
 * 简单来说：堆其实可以用一个数组表示，给定一个节点的下标i (i从1开始, 第一个位置不存储值)，那么它的父节点一定为 A[i/2],
 * 左子节点为 A[2i]  右子节点为 A[2i + 1]
 * 
 * 
 * 常见的方式有两种：
 *    插入式创建：每次插入一个节点，实现一个大顶堆
 *    原地创建： 又称堆化，给定一组节点，实现一个大顶堆
 */

/**
 * 插入式建堆
 * 
 *   插入节点：
 *     将节点插入到队尾
 *     自下往上堆化： 将插入节点与其父节点比较，如果插入节点大于父节点（大顶堆）或插入节点小于父节点（小顶堆），则插入节点与父节点调整位置
 *     一直重复上一步，直到不需要交换或交换到根节点，此时插入完成。
 */

function insert(key) {
  items.push(key)

  while (i / 2 > 0 && items[i] > items[i / 2]) {
    swap(items, i, i / 2)
    i = i / 2
  }
}

function swap(arr, i, j) {
  let temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}


/**
 * 原地建堆
 *
 * 原地建堆的方法有两种：
 *    自下而上式堆化： 将节点与其父节点比较，如果节点大于父节点（大顶堆）或节点小于父节点（小顶堆），则节点与父节点调整位置
 *    自上往下式堆化 ：将节点与其左右子节点比较，如果存在左右子节点大于该节点（大顶堆）或小于该节点（小顶堆），则将子节点的最大值（大顶堆）或最小值（小顶堆）与之交换
 */


/**
 * 从前往后建 （自下而上堆化）
 */

function buildHeap(items) {
  let index = 1
  while (index < items.length) {
    index++
    heapify(items, index)
  }
}

function heapify(items, i) {
  while (Math.floor(i / 2) > 0 && items[i] > items[Math.floor(i / 2)]) {
    swap(items, i, Math.floor(i / 2))
    i = Math.floor(i / 2)
  }
}

const arr = [, 5, 2, 3, 4, 1]
buildHeap(arr)
console.log(arr);

/**
 * 从后往前建堆 （自上而下）
 * 
 * 从后往前不是从最后一个节点开始，是因为叶子节点没有子节点，只需要从最后一个子节点的父节点开始 (n / 2)
 */

function buildHeap2(items, heapSize) {
  for (let i = Math.floor(heapSize / 2); i >= 1; i--) {
    heapify2(items, heapSize, i)
  }
}

function heapify2(items, heapSize, i) {
  while (true) {
    let minIndex = i

    if (2 * i <= heapSize && items[i] > items[2 * i]) {
      minIndex = 2 * i
    }

    if (2 * i + 1 <= heapSize && items[minIndex] > items[2 * i + 1]) {
      minIndex = 2 * i + 1
    }
    if (minIndex === i) break
    swap(items, i, minIndex)
    i = minIndex
  }
}

function swap(arr, i, j) {
  let temp = arr[i]
  arr[i] = arr[j]
  arr[j] = temp
}

const arr = [, 5, 2, 3, 4, 1]
buildHeap2(arr, arr.length - 1)
console.log(arr);



/**
 * 堆排序
 * 
 * 将原序列 转换为一个大顶堆
 * 设置堆的有效长度为n
 * 将堆顶的元素 与 最后一个子元素 交换，并有效序列长度减1
 * 堆化有效序列，是其重新称为一个大顶堆
 * 重复以上2步 直至有效长度为1， 排列完成
 */

function heapSort(items) {
  buildHeap(items, items.length - 1)

  let heapSize = items.length - 1
  for (let i = items.length - 1; i > 1; i--) {
    swap(items, 1, i)
    heapSize--
    heapify(items, heapSize, 1)
  }

  return items
}

function buildHeap(items, heapSize) {
  for (let i = Math.floor(heapSize / 2); i >=1; i--) {
    heapify(items, heapSize, i)
  }
}

function heapify(items, heapSize, i) {
  while(true) {
    let maxIndex = i

    if (2 * i < heapSize && items[i] < items[2 * i]) {
      maxIndex = 2 * i
    }
    if (2 * i + 1 <= heapSize && items[maxIndex] < items[2 * i + 1]) {
      maxIndex = 2 * i + 1
    }
    if (maxIndex === i) break
    swap(items, i, maxIndex)
    i = maxIndex
  }
}

function swap(items, i, j) {
  let temp = items[i]
  items[i] = items[j]
  items[j] = temp
}

var items = [,1, 9, 2, 8, 3, 7, 4, 6, 5]
console.log(heapSort(items));