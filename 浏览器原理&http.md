## http 相关

从输入url到页面加载完成到过程？

  1. 构建请求
      首先，浏览器构建请求行信息 构建好后 浏览器发起网络请求  GET /index.html HTTP1.1
  2. 查找缓存
  3. 准备ip地址和端口
    - 获取ip DNS查询，首先会从浏览器的DNS缓存中查找，如果查不到，会去DNS服务器中查找(DNS服务器的IP地址，有可能是动态的，每次上网时由网关分配，这叫做DHCP机制；也有可能是事先指定的固定地址)
    - 端口号 默认80 除非特别指定
  4. 等待TCP队列
    - chrome规定 同一个域名最多同时建立6个TCP连接
  5. 建立TCP连接
  6. 发送http请求
  7. 服务器端处理并返回请求
  8. 断开链接

------------------------------

举例来说，www.example.com真正的域名是www.example.com.root，简写为www.example.com.。因为，根域名.root对于所有域名都是一样的，所以平时是省略的。

根域名的下一级，叫做"顶级域名"（top-level domain，缩写为TLD），比如.com、.net；再下一级叫做"次级域名"（second-level domain，缩写为SLD），比如www.example.com里面的.example，这一级域名是用户可以注册的；再下一级是主机名（host），比如www.example.com里面的www，又称为"三级域名"，这是用户在自己的域里面为服务器分配的名称，是用户可以任意分配的。

------------------------------

[浏览器原理](https://juejin.im/post/6847902222349500430#heading-6)

## 浏览器内核(渲染进程)

- GUI渲染线程：GUI 渲染线程负责渲染浏览器界面，解析 HTML，CSS，构建 DOM 树和 RenderObject 树，布局和绘制等。当界面需要重绘（Repaint）或由于某种操作引发回流（Reflow）时，该线程就会执行。
- JavaScript引擎线程: JavaScript 引擎线程主要负责解析 JavaScript 脚本并运行相关代码。 JavaScript 引擎在一个Tab页（Renderer 进程）中无论什么时候都只有一个 JavaScript 线程在运行 JavaScript 程序。需要提起一点就是，GUI线程与JavaScript引擎线程是互斥的，这也是就是为什么JavaScript操作时间过长，会造成页面渲染不连贯，导致页面出现阻塞的原理。
- 事件触发线程：当一个事件被触发时该线程会把事件添加到待处理队列的队尾，等待 JavaScript 引擎的处理。 通常JavaScript引擎是单线程的，所以这些事件都会排队等待JS执行。
- 定时器触发线程： 我们日常使用的setInterval 和 setTimeout 就在该线程中，原因可能就是：由于JS引擎是单线程的，如果处于阻塞线程状态就会影响记时的准确，所以需要通过单独的线程来记时并触发响应的事件这样子更为合理。
- Http请求线程： 在 XMLHttpRequest 在连接后是通过浏览器新开一个线程请求，这个线程就Http请求线程，它 将检测到状态变更时，如果设置有回调函数，异步线程就产生状态变更事件放到 JavaScript 引擎的处理队列中等待处理。

## 渲染机制

1. 构建DOM树
2. 样式计算
3. 布局阶段
4. 分层
5. 绘制
6. 分块
7. 光栅化
8. 合成

![渲染流程](https://user-gold-cdn.xitu.io/2020/7/8/1732ec3500972dcc?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## 回流 重绘 合成

- 回流
    另外一个叫法是重排，回流触发的条件就是:对 DOM 结构的修改引发 DOM 几何尺寸变化的时候,会发生回流过程。
    具体一点，有以下的操作会触发回流:
      1. 一个 DOM 元素的几何属性变化，常见的几何属性有width、height、padding、margin、left、top、border 等等, 这个很好理解
      2. 使 DOM 节点发生增减或者移动。
      3. 读写 offset族、scroll族和client族属性的时候，浏览器为了获取这些值，需要进行回流操作。
      4. 调用 window.getComputedStyle 方法。

    一些常用且会导致回流的属性和方法：
      - clientWidth、clientHeight、clientTop、clientLeft
      - offsetWidth、offsetHeight、offsetTop、offsetLeft
      - scrollWidth、scrollHeight、scrollTop、scrollLeft
      - scrollIntoView()、scrollIntoViewIfNeeded()
      - getComputedStyle()
      - getBoundingClientRect()
      - scrollTo()

    依照上面的渲染流水线，触发回流的时候，如果 DOM 结构发生改变，则重新渲染 DOM 树，然后将后面的流程(包括主线程之外的任务)全部走一遍。
    ![回流流程](https://user-gold-cdn.xitu.io/2020/7/8/1732ec388e85bd2d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

- 重绘
    当页面中元素样式的改变并不影响它在文档流中的位置时（例如：color、background-color、visibility等），浏览器会将新样式赋予给元素并重新绘制它，这个过程称为重绘。
    根据概念，我们知道由于没有导致 DOM 几何属性的变化，因此元素的位置信息不需要更新，从而省去布局的过程，流程如下：
    ![重绘流程](https://user-gold-cdn.xitu.io/2020/7/8/1732ec3b24ec43c9?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

    跳过了布局树和建图层树,直接去绘制列表，然后在去分块,生成位图等一系列操作。

    可以看到，重绘不一定导致回流，但回流一定发生了重绘。

- 合成
    还有一种情况：就是**更改了一个既不要布局也不要绘制**的属性，那么渲染引擎会跳过布局和绘制，直接执行后续的合成操作，这个过程就叫合成。

    举个例子：比如使用CSS的transform来实现动画效果，**避免了回流跟重绘**，直接在非主线程中执行合成动画操作。显然这样子的效率更高，毕竟这个是在非主线程上合成的，没有占用主线程资源，另外也避开了布局和绘制两个子阶段，所以**相对于重绘和重排，合成能大大提升绘制效率**。

    利用这一点好处:
      - 合成层的位图，会交由 GPU 合成，比 CPU 处理要快
      - 当需要 repaint 时，只需要 repaint 本身，不会影响到其他的层
      - 对于 transform 和 opacity 效果，不会触发 layout 和 paint

    提升合成层的最好方式是使用 CSS 的 will-change 属性

### GPU加速原因

比如利用 CSS3 的transform、opacity、filter这些属性就可以实现合成的效果，也就是大家常说的GPU加速。

- 在合成的情况下，直接跳过布局和绘制流程，进入非主线程处理部分，即直接交给合成线程处理。
- 充分发挥GPU优势，合成线程生成位图的过程中会调用线程池，并在其中使用GPU进行加速生成，而GPU 是擅长处理位图数据的。
- 没有占用主线程的资源，即使主线程卡住了，效果依然流畅展示。
  
### 实践意义

- 使用createDocumentFragment进行批量的 DOM 操作
- 对于 resize、scroll 等进行防抖/节流处理。
- 动画使用transform或者opacity实现
- 将元素的will-change 设置为 opacity、transform、top、left、bottom、right 。这样子渲染引擎会为其单独实现一个图层，当这些变换发生时，仅仅只是利用合成线程去处理这些变换，而不牵扯到主线程，大大提高渲染效率。
- 对于不支持will-change 属性的浏览器，使用一个3D transform属性来强制提升为合成 transform: translateZ(0);
- rAF优化等等
