// Least Recently Used  最近最少使用


/*
特点分析：
  我们需要一块有限的存储空间，因为无限的化就没必要使用 LRU 算发删除数据了。
  我们这块存储空间里面存储的数据需要是有序的，因为我们必须要顺序来删除数据，所以可以考虑使用 Array、Map 数据结构来存储，不能使用 Object，因为它是无序的。
  我们能够删除或者添加以及获取到这块存储空间中的指定数据。
  存储空间存满之后，在添加数据时，会自动删除时间最久远的那条数据。
*/

class LRUCache {
  constructor(length) {
    this.length = length; // 存储长度
    this.data = new Map() // 存储数据
  }

  get(key) {
    const data = this.data;
    if (!data.has(key)) {
      return null;
    } else {
      const value = data.get(key); // 获取元素
      data.delete(key) // 删除元素
      data.set(key, value) // 重新插入元素
    }
  }

  set(key, value) {
    const data = this.data;
    if (data.has(key)) {
      // 如果存在则删除该数据，后面会重新插入
      data.delete(key)
    }
    data.set(key, value)
    // 如果超出了容量，则需要删除最久的数据
    if (data.size > this.length) {
      const delKey = data.keys().next().value;
      data.delete(delKey)
    }
  }
}