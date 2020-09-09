// https://segmentfault.com/a/1190000018811476
/**
 * Mixin 混入 
 * 是一种通过扩展收集功能的方式 本质上是将一个对象的属性拷贝到另一个对象上 
 * 不过你可以拷贝任意多个对象的任意个方法到一个新对象上去，这是继承所不能实现的。它的出现主要就是为了解决代码复用问题。
 * 
 * Mixin的危害
 * Mixin 可能会相互依赖，相互耦合，不利于代码维护
 * 不同的 Mixin 中的方法可能会相互冲突
 * Mixin非常多时，组件是可以感知到的，甚至还要为其做相关处理，这样会给代码造成滚雪球式的复杂性
 */

 /**
  * Hoc 高阶组件
  * 高阶组件可以看作React对装饰模式的一种实现，高阶组件就是一个函数，且该函数接受一个组件作为参数，并返回一个新的组件。
  */

// React高阶组件

/** 属性代理
 * 对比原生组件增强的项
 *  可操作所有传入的props
 *  可操作组件的生命周期
 *  可操作组件的static方法
 *  获取refs
 */
function proxyHOC(WrappedComponent) {
  return class extends React.component {
    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}


/**  反向继承
 *  对比原生组件增强的项
 *    可操作所有传入的props
 *    可操作组件的生命周期
 *    可操作组件的static方法
 *    获取refs
 *    可操作state
 *    可以渲染劫持
 */
function inheritHOC(WrappedComponent) {
  return class extends WrappedComponent {
    render() {
      return super.render()
    }
  }
}

// 反向代理实现的渲染劫持
// 直接增强原组件render函数产生的React元素
function hijackHOC(WrappedComponent) {
  return class extends WrappedComponent {
    render() {
      const tree = super.render()
      let newProps = { isHijack: true }
      let oldProps = tree.props
      let props = Object.assign({}, oldProps, newProps)

      const newTree = React.cloneElement(tree, props, tree.props.children)
      return newTree
    }
  }
}

// 一个组件被多个HOC增强时候，可以使用compose函数组合

/**
 * 使用HOC注意事项
 *    告诫—静态属性拷贝
 *    告诫—传递refs
 *    告诫—不要在render方法内创建高阶组件
 *    约定-不要改变原始组件
 *    约定-透传不相关的props
 *    约定-displayName
 */

/**
 * HOC缺陷
 *    HOC需要在原组件上进行包裹或者嵌套，如果大量使用HOC，将会产生非常多的嵌套，这让调试变得非常困难
 *    HOC可以劫持props，在不遵守约定的情况下也可能造成冲突。
 */


/**
 * 使用Hook的动机
 * 
 * 减少状态逻辑复用的风险
 *    Hook和Mixin在用法上有一定的相似之处，但是Mixin引入的逻辑和状态是可以相互覆盖的，
 *    而多个Hook之间互不影响，这让我们不需要在把一部分精力放在防止避免逻辑复用的冲突上。
 *    在不遵守约定的情况下使用HOC也有可能带来一定冲突，比如props覆盖等等，使用Hook则可以避免这些问题。
 * 避免地狱式嵌套
 *    大量使用HOC的情况下让我们的代码变得嵌套层级非常深，使用HOC，我们可以实现扁平式的状态逻辑复用，而避免了大量的组件嵌套
 * 让组件更容易理解
 *    在使用class组件构建我们的程序时，他们各自拥有自己的状态，业务逻辑的复杂使这些组件变得越来越庞大，
 *    各个生命周期中会调用越来越多的逻辑，越来越难以维护。使用Hook，可以让你更大限度的将公用逻辑抽离，
 *    将一个组件分割成更小的函数，而不是强制基于生命周期方法进行分割。
 * 使用函数代替class
 *    相比函数，编写一个class可能需要掌握更多的知识，需要注意的点也越多，比如this指向、绑定事件等等。
 *    另外，计算机理解一个函数比理解一个class更快。Hooks让你可以在classes之外使用更多React的新特性。
 */
