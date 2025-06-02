import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// MIME 类型映射
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.wav': 'audio/wav',
  '.mp4': 'video/mp4',
  '.woff': 'application/font-woff',
  '.ttf': 'application/font-ttf',
  '.eot': 'application/vnd.ms-fontobject',
  '.otf': 'application/font-otf',
  '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

  // 处理 SSE 端点
  if (req.url === '/sse') {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Cache-Control');

    let count = 0;
    const interval = setInterval(() => {
      if (count > 20) {
        clearInterval(interval);
        res.write(`event: close\n`);
        res.write(`data: 连接即将关闭\n\n`);
        res.end();
      } else {
        res.write(`data: 计数器: ${count++}\n\n`);
      }
    }, 100);

    req.on('close', () => {
      clearInterval(interval);
      console.log('客户端断开连接');
    });

    return;
  }

  // 处理静态文件
  let filePath = path.join(__dirname, req.url === '/' ? 'client.html' : req.url);

  // 安全检查：防止目录遍历攻击
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        res.writeHead(404);
        res.end('文件未找到');
      } else {
        res.writeHead(500);
        res.end('服务器内部错误: ' + error.code);
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
  console.log(`📱 访问 http://localhost:${PORT} 查看 SSE 测试客户端`);
  console.log(`🔗 SSE 端点: http://localhost:${PORT}/sse`);
});
