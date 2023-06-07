
# flex属性

   flex-grow flex-shrink flex-basis的简写 默认值为0 1 auto 后两个属性可选

   flex-grow 设置扩展比例      子容器弹性伸展的比例，简单理解，就是把剩余的空间按比例分配给子容器

   flex-shrink 设置收缩比例    子容器弹性收缩的比例。简单理解，就是当你子容器超出的部分，会按照对应的比例给子容器减去对应的值

   flex-basis 设置基准大小
       有几个点需要注意的是
           在不伸缩的情况下，flex-basis给子容器设置大小才会覆盖(width|height)值， 否则按比例分配给子容器。
           当主轴为横向时，即(flex-direction：row | row-reverse) flex-basis设置的大小为宽度，并且会覆盖width值
           当主轴为纵向时，即(flex-direction：column | column-reverse) flex-basis设置的大小为高度，并且会覆盖height值

## flex取值

- initial 元素会根据自身宽高设置尺寸。它会缩短自身以适应 flex 容器，但不会伸长并吸收 flex 容器中的额外自由空间来适应 flex 容器 。相当于将属性设置为"flex: 0 1 auto"。
- auto 元素会根据自身的宽度与高度来确定尺寸，但是会伸长并吸收 flex 容器中额外的自由空间，也会缩短自身来适应 flex 容器。这相当于将属性设置为 "flex: 1 1 auto".
- none 元素会根据自身宽高来设置尺寸。它是完全非弹性的：既不会缩短，也不会伸长来适应 flex 容器。相当于将属性设置为"flex: 0 0 auto"。

单值语法：值必须为以下其中之一:

- 一个无单位数(number): 它会被当作flex-grow的值。
- 一个有效的宽度(width)值: 它会被当作flex-basis的值。
- 关键字none，auto或initial.

双值语法：第一个值必须为一个无单位数，并且它会被当作 flex-grow 的值。第二个值必须为以下之一：

- 一个无单位数：它会被当作 **flex-shrink** 的值
- 一个有效的宽度值: 它会被当作 **flex-basis** 的值。

**当使用一个或两个无单位数时, flex-basis会从auto变为0**
**即flex: 1 等价于 flex: 1 1 0%**
    解释flex: 1表现：
        flex: 1 1 0% 即项目初始大小为 0，所以主轴方向上的剩余空间就是容器的大小，又因为项目的 flex-grow 都为 1，所以项目等比例放大，最终表现为均匀分布在弹性盒子容器中。

三值语法:

- 第一个值必须为一个无单位数，并且它会被当作 **flex-grow** 的值。
- 第二个值必须为一个无单位数，并且它会被当作  **flex-shrink** 的值。
- 第三个值必须为一个有效的宽度值， 并且它会被当作 **flex-basis** 的值。

![flex-img](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0c5e529f03d345dab4534bf84b1cfd1d~tplv-k3u1fbpfcp-zoom-1.image?imageslim)
