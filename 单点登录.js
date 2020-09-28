/**
 * Session相当于在服务器中建立了一份“客户明细表”
 * 其实Session是依据Cookie来识别是否是同一个用户。
 * 
 * 一般我们实现登录系统会这样做：
 *    登录： 将用户信息保存在session对象中
 *    注销(退出登录)： 从Session中删除用户的信息
 *    记住我： 配合cookie来用
 * 
 * 
 * 多点登录的问题
 *    单系统登录功能主要是用Session保存用户信息来实现的，但我们清楚的是：多系统即可能有多个Tomcat，
 *    而Session是依赖当前系统的Tomcat，所以系统A的Session和系统B的Session是不共享的。
 * 
 * 
 * 解决系统之间Session不共享问题有一下几种方案：
 *    Tomcat集群Session全局复制（集群内每个tomcat的session完全同步）【会影响集群的性能呢，不建议】
 *    根据请求的IP进行Hash映射到对应的机器上（这就相当于请求的IP一直会访问同一个服务器）【如果服务器宕机了，会丢失了一大部分Session的数据，不建议】
 *    把Session数据放在Redis中（使用Redis模拟Session）【建议】
 *   
 * 改造为单点登录系统：
 *  将登陆功能抽取为一个系统（SSO），其他系统请求SSO进行登录 （SSO相当于一个 CAS(中央认证服务)）
 *  本来将用户信息存到Session，现在将用户信息存到Redis
 * 
 * Cookie跨域的问题解决方案：
 *    服务端将Cookie写到客户端后，客户端对Cookie进行解析，将Token解析出来，此后请求都把这个Token带上就行了
 *    多个域名共享Cookie，在写到客户端的时候设置Cookie的domain。
 *    将Token保存在localStorage中（不依赖Cookie就没有跨域的问题了）
 */

 /**
  * https://zhuanlan.zhihu.com/p/86937325
  * http://www.zhufengpeixun.com/jg-vue/node/cookie-session.html#_1-%E4%BB%80%E4%B9%88%E6%98%AFjwt%EF%BC%9F
  * 
  * JWT (JSON Web Token) 是目前最流行的跨域身份验证解决方案
  * 
  * 解决问题：session不支持分布式架构，无法支持横向扩展，只能通过数据库来保存会话数据实现共享。如果持久层失败会出现认证失败。
  * 优点：服务器不保存任何会话数据，即服务器变为无状态，使其更容易扩展
  * 
  * JSON Web Token由三部分组成，它们之间用圆点(.)连接。这三部分分别是：
  *     Header        { "alg": "HS256", "typ": "JWT" }   type(token的类型) alg(算法名称)
        Payload       JWT 规定了7个官方字段 iss (issuer)：签发人 exp (expiration time)：过期时间 sub (subject)：主题 aud (audience)：受众 nbf (Not Before)：生效时间 iat (Issued At)：签发时间
        Signature     对前两部分的签名，防止数据篡改
    因此，一个典型的JWT看起来是这个样子的：
        xxxxx.yyyyy.zzzzz


    使用方式：
        HTTP 请求的头信息Authorization字段里面
        Authorization: Bearer <token>

        通过url传输
        http://www.xxx.com/pwa?token=xxxxx

        如果是post请求也可以放在请求体中
  */


  /**
   * JWT与Session的差异 相同点是，它们都是存储用户信息；然而，Session是在服务器端的，而JWT是在客户端的。
   * 
   * Session方式存储用户信息的最大问题在于要占用大量服务器内存，增加服务器的开销。而JWT方式将用户状态分散到了客户端中，可以明显减轻服务端的内存压力。
   * 
   * Session的状态是存储在服务器端，客户端只有session id；而Token的状态是存储在客户端。
   */

   // todo
   // https://cloud.tencent.com/developer/article/1166255 ()

