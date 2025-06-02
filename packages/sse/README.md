# MCP Server-Sent Events 演示

这是一个简单的 Server-Sent Events (SSE) 演示项目，包含服务器端和客户端代码。

## 功能特性

- ✅ SSE 服务器实现
- ✅ 静态文件服务
- ✅ 现代化的 Web 客户端界面
- ✅ 实时数据推送演示
- ✅ 连接状态管理
- ✅ 错误处理

## 项目结构

```
packages/mcp/
├── src/
│   ├── server.js      # Node.js SSE 服务器
│   ├── client.html    # Web 客户端界面
│   └── client.js      # 客户端 JavaScript 代码
├── package.json       # 包配置文件
└── README.md         # 项目说明文档
```

## 快速开始

### 1. 启动服务器

在项目根目录运行：

```bash
# 方式一：使用根目录脚本
pnpm run start:mcp

# 方式二：直接在 mcp 包目录运行
cd packages/mcp
pnpm start
```

### 2. 访问客户端

服务器启动后，在浏览器中访问：

```
http://localhost:3000
```

### 3. 测试 SSE 功能

1. 点击"连接"按钮建立 SSE 连接
2. 观察实时数据推送（每秒一次计数器更新）
3. 20 秒后服务器会自动关闭连接
4. 可以点击"断开连接"手动断开
5. 使用"清空消息"清理消息历史

## API 端点

- `GET /` - 客户端界面
- `GET /sse` - Server-Sent Events 数据流
- `GET /client.js` - 客户端 JavaScript 文件

## 技术栈

- **后端**: Node.js (ES6 模块)
- **前端**: 原生 HTML/CSS/JavaScript
- **协议**: Server-Sent Events (SSE)

## 开发说明

### 服务器特性

- 使用 ES6 模块语法
- 支持 CORS 跨域请求
- 自动处理客户端断开连接
- 静态文件服务功能
- 安全的文件路径处理

### 客户端特性

- 现代化的响应式界面
- 实时连接状态显示
- 消息历史记录
- 错误处理和重连机制

## 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 检查端口占用
   lsof -i :3000
   # 或者修改 server.js 中的 PORT 变量
   ```

2. **模块导入错误**
   - 确保 `package.json` 中包含 `"type": "module"`

3. **CORS 错误**
   - 服务器已配置 CORS 头，如果仍有问题请检查浏览器控制台

## 扩展建议

- 添加用户认证
- 实现多房间/频道功能
- 添加消息持久化
- 集成 WebSocket 作为备选方案
- 添加服务器集群支持

## 许可证

ISC