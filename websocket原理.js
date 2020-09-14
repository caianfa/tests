/**
 * websocket复用了http协议的握手通道
 * 
 * websocket握手
 *  GET /chat HTTP/1.1
    Host: server.example.com
    Upgrade: websocket    表示要升级到websocket协议
    Connection: Upgrade   表示要升级协议
    Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw==   浏览器随机生成，与后面服务端响应首部的Sec-WebSocket-Accept是配套的，提供基本的防护，比如恶意的连接，或者无意的连接。
    Sec-WebSocket-Protocol: chat, superchat
    Sec-WebSocket-Version: 13   表示websocket的版本
    Origin: http://example.com
 */

 /**
  * --------------------------------------------------------------------------------------------------------
  * 关于websocket几个重要的总结：
  * Websocket 是一种应用层协议，是为了提供 Web 应用程序和服务端全双工通信而专门制定的；
  * WebSocket 和 HTTP 都是基于 TCP 协议实现的；
  * WebSocket和 HTTP 的唯一关联就是 HTTP 服务器需要发送一个 “Upgrade” 请求，即 101 Switching Protocol 到 HTTP 服务器，然后由服务器进行协议转换。
  * WebSocket使用 HTTP 来建立连接，但是定义了一系列新的 header 域，这些域在 HTTP 中并不会使用；
  * WebSocket 可以和 HTTP Server 共享同一 port
  * 
  * --------------------------------------------------------------------------------------------------------
  * websocket和http是什么关系？
  * 
  * HTTP、WebSocket 等应用层协议，都是基于 TCP 协议来传输数据的 
  * 对于 WebSocket 来说，它必须依赖 HTTP 协议进行一次握手 ，握手成功后，数据就直接从 TCP 通道传输，与 HTTP 无关了。
  * 
  * --------------------------------------------------------------------------------------------------------
  * websocket的readyState状态码含义
  * 0: 表示正在链接
  * 1: 表示连接成功 可以通信了
  * 2: 表示连接正在关闭
  * 3: 表示连接已经关闭，或者打开连接失败
  * 
  * --------------------------------------------------------------------------------------------------------
  */

  /**
   * --------------------------------------------------------------------------------------------------------
   * 在websocket出现之前 实时通信一般采用 轮询 长轮询 iframe流的方式去实现
   * 
   * 轮询
   *    轮询是客户端和服务器之间会一直进行连接，每隔一段时间就询问一次
   *    这种方式连接数会很多，一个接受，一个发送。而且每次发送请求都会有Http的Header，会很耗流量，也会消耗CPU的利用率长轮询
   * 长轮询
   *    长轮询是对轮询的改进版，客户端发送HTTP给服务器之后，看有没有新消息，如果没有新消息，就一直等待
   *    当有新消息的时候，才会返回给客户端。在某种程度上减小了网络带宽和CPU利用率等问题。
   * iframe流
   *    通过在HTML页面里嵌入一个隐藏的iframe,然后将这个iframe的src属性设为对一个长连接的请求,服务器端就能源源不断地往客户推送数据
   * EventSource流
   *    // 浏览器端
   *      浏览器端，需要创建一个EventSource对象，并且传入一个服务端的接口URI作为参
   *      默认EventSource对象通过侦听message事件获取服务端传来的消息
   *      open事件则在http连接建立后触发
   *      error事件会在通信错误（连接中断、服务端返回数据失败）的情况下触发
   *      同时EventSource规范允许服务端指定自定义事件，客户端侦听该事件即可   
   *    // 服务端
   *      事件流的对应MIME格式为text/event-stream，而且其基于HTTP长连接
   *      event-source必须编码成utf-8的格式，消息的每个字段使用"\n"来做分割，并且需要下面4个规范定义好的字段：
   *        Event: 事件类型  Data: 发送的数据  ID: 每一条事件流的ID
   *        Retry： 告知浏览器在所有的连接丢失之后重新开启新的连接等待的时间，在自动重新连接的过程中，之前收到的最后一个事件流ID会被发送到
   */

   /**
    * iframe流方式实现
    * --------------------------------------------------------------------------------------------------------
    * // server.js
    * const express = require('express')
    * const app = express()
    * app.get('/clock', function(req, res) {
    *   setInterval(() => {
    *     res.write(`
    *       <script>
    *         parent.document.getElementById('clock').innerHTML = ${new Date().toLocaleTimeString()}
    *       </script>
    *     `)
    *   }, 1000)
    * })
    * // client.html
    *   <div id="clock"></div>
    *   <iframe src="/clock" style="display: none" />
    * 
    * --------------------------------------------------------------------------------------------------------
    * 
    * EventSource方式实现
    * // client
    * const eventSource = new EventSource('/eventSource')
    * eventSource.onmessage = function(e) { console.log(e.data) }
    * eventSource.onerror = function(err) { console.log(err) }
    * 
    * // server
    * app.get('/eventSource', function(req, res) {
    *   res.header('Content-Type', 'text/event-stream')
    *   setInterval(() => {
    *     res.write(`event: `)
    *   }, 1000)
    * })
    */

    /**
     * websocket实现 监听消息、消息发送、心跳检测、断线重连
     */
    class WS {
      constructor(config) {
        this.url = config.url || 'localhost'
        this.port = config.port || 8080
        this.protocol = config.protocol || 'ws'
      }
      create() {
        this.ws = new WebSocket(`${this.protocol}://${this.url}:${this.port}`)
        this.ws.onopen = this.onOpen
        this.ws.onmessage = this.onMessage
        this.ws.onclose = this.onClose
        this.ws.onerror = this.onError
      }
      onOpen() {
        this.ws.send(JSON.stringify({ type: 'auth', data: getLocal('token') }))
      }
      onClose() {
        this.ws.close()
      }
      onMessage(e) {
        const { type, data } = JSON.parse(e.data)
        switch(type) {
          case 'heartCheck':
            this.checkServer()
            this.ws.send(JSON.stringify({ type: 'heartCheck' }))
            break
        }
      }
      onError() {
        setTimeout(() => {
          this.create()
        }, 1000)
      }
      checkServer() {
        clearTimeout(this.handle)
        this.handle = setTimeout(() => {
          this.onClose()
          this.onError()
        }, 1000)
      }
      send(msg) {
        this.ws.send(JSON.stringify(msg))
      }
    }
