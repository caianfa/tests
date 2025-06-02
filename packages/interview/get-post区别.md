# restful

## 幂等请求

多次调用产生的效果相同 不会产生副作用

- GET
- PUT    本质上来讲， PUT和POST极为相似，都是向服务器发送数据，但它们之间有一个重要区别，PUT通常指定了资源的存放位置，而POST则没有，POST的数据存放位置由服务器自己决定
- DELETE

## 非幂等请求

- POST
- PATCH  部分更新资源 局部替换(每次更新会有副作用 操作记录增加)  优点是缩小http传输大小

## 区别

- GET在浏览器回退时是无害的，而POST会再次提交请求
- GET产生的URL地址可以被Bookmark，而POST不可以
- GET请求会被浏览器主动cache，而POST不会，除非手动设置
- GET请求只能进行url编码，而POST支持多种编码方式
- GET请求参数会被完整保留在浏览器历史记录里，而POST中的参数不会被保留
- GET请求在URL中传送的参数是有长度限制的(浏览器的限制，不同浏览器不同 chrome大概4kb)，而POST没有
- 对参数的数据类型，GET只接受ASCII字符，而POST没有限制
- GET比POST更不安全，因为参数直接暴露在URL上，所以不能用来传递敏感信息
- GET参数通过URL传递，POST放在Request body中
