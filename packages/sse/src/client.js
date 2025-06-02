class SSEClient {
    constructor() {
        this.eventSource = null;
        this.connectBtn = document.getElementById('connectBtn');
        this.disconnectBtn = document.getElementById('disconnectBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.status = document.getElementById('status');
        this.messages = document.getElementById('messages');

        this.initEventListeners();
    }

    initEventListeners() {
        this.connectBtn.addEventListener('click', () => this.connect());
        this.disconnectBtn.addEventListener('click', () => this.disconnect());
        this.clearBtn.addEventListener('click', () => this.clearMessages());
    }

    connect() {
        if (this.eventSource) {
            this.disconnect();
        }

        this.addMessage('正在连接到服务器...', 'info');

        this.eventSource = new EventSource('http://localhost:3000/sse');

        this.eventSource.onopen = (event) => {
            this.updateStatus('已连接', 'connected');
            this.connectBtn.disabled = true;
            this.disconnectBtn.disabled = false;
            this.addMessage('连接成功！', 'event');
        };

        this.eventSource.onmessage = (event) => {
            this.addMessage(`收到数据: ${event.data}`, 'message');
        };

        this.eventSource.addEventListener('close', (event) => {
            this.addMessage('服务器关闭了连接', 'event');
            this.disconnect();
        });

        this.eventSource.onerror = (event) => {
            this.addMessage('连接错误', 'error');
            this.updateStatus('连接错误', 'disconnected');
            this.disconnect();
        };
    }

    disconnect() {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }

        this.updateStatus('未连接', 'disconnected');
        this.connectBtn.disabled = false;
        this.disconnectBtn.disabled = true;
        this.addMessage('连接已断开', 'info');
    }

    updateStatus(text, className) {
        this.status.textContent = text;
        this.status.className = `status ${className}`;
    }

    addMessage(text, type = 'message') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;

        this.messages.appendChild(messageDiv);
        this.messages.scrollTop = this.messages.scrollHeight;
    }

    clearMessages() {
        this.messages.innerHTML = '';
    }
}

// 初始化客户端
document.addEventListener('DOMContentLoaded', () => {
    new SSEClient();
});
