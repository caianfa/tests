## XMLHttpRequest

withCredentials 属性是一个Boolean类型

**不同域下的XmlHttpRequest 响应，不论其Access-Control- header 设置什么值，都无法为它自身站点设置cookie值，除非它在请求之前将withCredentials 设为true**

## fetch

发送带凭据的请求 为了让浏览器发送包含凭据的请求（即使是跨域源），要将credentials: 'include'

- credentials属性: include same-origin omit

  - include 发送包含cookie的请求 即使是跨域
  - same-origin 与请求url同一起源时发送cookie
  - omit 不在请求中包含凭据

- cache属性：
  - default — 浏览器从HTTP缓存中寻找匹配的请求。
      如果缓存匹配上并且有效（ fresh）, 它将直接从缓存中返回资源。
      如果缓存匹配上但已经过期 ，浏览器将会使用传统（ conditional request ）的请求方式去访问远程服务器 。如果服务器端显示资源没有改动，它将从缓存中返回资源。否则，如果服务器显示资源变动，那么重新从服务器下载资源更新缓存。
      如果缓存没有匹配，浏览器将会以普通方式请求，并且更新已经下载的资源缓存。
  - no-store — 浏览器直接从远程服务器获取资源，不查看缓存，并且不会使用下载的资源更新缓存。
  - reload — 浏览器直接从远程服务器获取资源，不查看缓存，然后使用下载的资源更新缓存。
  - no-cache — 浏览器在其HTTP缓存中寻找匹配的请求。
      如果有匹配，无论是新的还是陈旧的，浏览器都会向远程服务器发出条件请求。如果服务器指示资源没有更改，则将从缓存中返回该资源。否则，将从服务器下载资源并更新缓存。
      如果没有匹配，浏览器将发出正常请求，并使用下载的资源更新缓存。
  - force-cache — 浏览器在其HTTP缓存中寻找匹配的请求。
      如果有匹配项，不管是新匹配项还是旧匹配项，都将从缓存中返回。
      如果没有匹配，浏览器将发出正常请求，并使用下载的资源更新缓存。
  - only-if-cached — 浏览器在其HTTP缓存中寻找匹配的请求。
      如果有匹配项(新的或旧的)，则从缓存中返回。
      如果没有匹配，浏览器将返回一个错误

## AbortController

- AbortController接口代表一个控制器对象，允许你在需要时中止一个或多个Web(网络)请求。
- AbortController.signal 返回一个AbortSignal对象实例，它可以用来 with/abort 一个Web(网络)请求。
- AbortController.abort() 中止一个尚未完成的Web(网络)请求。这能够中止fetch 请求，任何响应Body的消费者和流。

```js 示例
  const controller = new AbortController()
  const signal = controller.signal

  const abortBtn = document.querySelector('.abort')

  abortBtn.addEventListener('click', () => {
    controller.abort()
    console.log('download aborted')
  })

  fetch('http://www.baidu.com', {
    signal
  }).then((res) => {
    console.log(res)
  })
```
