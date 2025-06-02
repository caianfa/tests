// 语法

/**
 * target.addEventListener(type, listener, options);  新版浏览器都支持且使用这种模式
 * target.addEventListener(type, listener, useCapture);
 */

 /**
  * options参数
  *   capture: Boolean 表示listener会在该类型的事件捕获阶段传播到该 EventTarget时触发
  *   once: Boolean 表示listener在添加之后最多调用一次 如果是true listener会在其调用之后自动移除
  *   passive: Boolean(默认false) 设置为true时 表示listener永远不会调用 preventDefault() 如果listener仍然调用了这个函数 客户端会忽略、】
  *            并抛出一个控制台警告
  */

  /**
   * 使用 passive改善 滚动性能
   *    根据规范，passive 选项的默认值始终为false。但是，这引入了处理某些触摸事件（以及其他）
   *    的事件监听器在尝试处理滚动时阻止浏览器的主线程的可能性，从而导致滚动处理期间性能可能大大降低。
   * 
   *    为防止出现此问题，某些浏览器（特别是Chrome和Firefox）
   *    已将文档级节点 Window，Document和Document.body的touchstart和touchmove事件的passive选项的默认值更改为true。
   *    这可以防止调用事件监听器，因此在用户滚动时无法阻止页面呈现。
   */