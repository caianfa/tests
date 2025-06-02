/*
https://github.com/chyingp/nodejs-learning-guide/blob/master/%E6%A8%A1%E5%9D%97/cluster.md

cluster模块概览
node实例是单线程作业的。在服务端编程中，通常会创建多个node实例来处理客户端的请求，以此提升系统的吞吐率。对这样多个node实例，我们称之为cluster（集群）。

借助node的cluster模块，开发者可以在几乎不修改原有项目代码的前提下，获得集群服务带来的好处。

集群有以下两种常见的实现方案，而node自带的cluster模块，采用了方案二。

方案一：多个node实例+多个端口
集群内的node实例，各自监听不同的端口，再由反向代理实现请求到多个端口的分发。

优点：实现简单，各实例相对独立，这对服务稳定性有好处。
缺点：增加端口占用，进程之间通信比较麻烦。
方案二：主进程向子进程转发请求
集群内，创建一个主进程(master)，以及若干个子进程(worker)。由master监听客户端连接请求，并根据特定的策略，转发给worker。

优点：通常只占用一个端口，通信相对简单，转发策略更灵活。
缺点：实现相对复杂，对主进程的稳定性要求较高。
*/

/*
cluster.isMaster 是否是主进程


*/

const cluster = require('cluster');
const cpuNums = require('os').cpus().length;
const http = require('http')

if (cluster.isMaster) {
  for (let i = 0; i < cpuNums; i++) {
    cluster.fork()
  }
} else {
  http.createServer((req, res) => {
    res.end(`response from worker ${process.pid}`)
  }).listen(3000, () => {
    console.log(`Worker ${process.pid} started`);
  })
}
