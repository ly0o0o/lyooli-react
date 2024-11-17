好的，我来补全这份 README.md。

```markdown:README.md
# Lyooli React 项目部署文档

这是一个基于 React 的前端项目，用于部署在云服务器的 Docker 环境中。

## 前提条件

- 已有云服务器（Linux 环境）
- 服务器已安装 Docker
- 本地环境为 Mac
- Node.js 环境（推荐 v16+）

## 本地开发设置

1. 创建项目
```bash
# 创建新的React项目
npx create-react-app lyooli-react
cd lyooli-react

# 安装依赖
npm install @ant-design/icons antd axios
```

2. 创建必要文件

`src/App.js`:
```javascript
import React, { useState } from 'react';
import { Button, Layout, Typography, Space } from 'antd';
import { GithubOutlined } from '@ant-design/icons';
import './App.css';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function App() {
  const [count, setCount] = useState(0);

  return (
    <Layout className="layout">
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <Title level={3} style={{ color: 'white', margin: 0 }}>
          Lyooli React
        </Title>
      </Header>
      
      <Content style={{ padding: '50px', minHeight: 'calc(100vh - 134px)' }}>
        <div className="site-layout-content">
          <Space direction="vertical" size="large" align="center" style={{ width: '100%' }}>
            <Title level={2}>欢迎来到我的网站</Title>
            <Title level={4}>当前计数: {count}</Title>
            <Space>
              <Button type="primary" onClick={() => setCount(count + 1)}>
                增加
              </Button>
              <Button danger onClick={() => setCount(count - 1)}>
                减少
              </Button>
            </Space>
          </Space>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        <Space>
          <GithubOutlined />
          Lyooli React ©{new Date().getFullYear()}
        </Space>
      </Footer>
    </Layout>
  );
}

export default App;
```

`src/App.css`:
```css
.site-layout-content {
  min-height: 280px;
  padding: 24px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.ant-layout-header {
  background: #001529;
}

.ant-layout-footer {
  background: #f0f2f5;
}

.layout {
  min-height: 100vh;
}
```

3. 创建部署相关文件

`Dockerfile`:
```dockerfile
# 构建阶段
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

`docker-compose.yml`:
```yaml
version: '3'
services:
  lyooli-react:
    build: .
    container_name: lyooli-react
    ports:
      - "80:80"
    restart: always
```

`nginx.conf`:
```nginx
server {
    listen 80;
    server_name localhost;
    
    location / {
        root /usr/share/nginx/html;
        index index.html index.htm;
        try_files $uri $uri/ /index.html;
    }

    error_page 500 502 503 504 /50x.html;
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
```

`.dockerignore`:
```text
node_modules
npm-debug.log
build
.git
.gitignore
.env
```

## 本地测试

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start
```

## 部署步骤

1. 打包项目
```bash
# 在项目根目录外执行
cd ..
tar --exclude='lyooli-react/node_modules' -zcvf lyooli-react.tar.gz lyooli-react/
```

2. 上传到服务器
```bash
# 将打包文件上传到服务器
scp lyooli-react.tar.gz username@your-server-ip:~/
```

3. 服务器部署
```bash
# SSH连接到服务器
ssh username@your-server-ip

# 解压文件
cd ~
tar -zxvf lyooli-react.tar.gz

# 进入项目目录并部署
cd lyooli-react
sudo docker-compose up -d --build
```

## 维护命令

```bash
# 查看容器状态
sudo docker ps | grep lyooli-react

# 查看应用日志
sudo docker logs -f lyooli-react

# 重启应用
sudo docker-compose restart lyooli-react

# 停止应用
sudo docker-compose stop lyooli-react

# 重新构建并启动
sudo docker-compose up -d --build
```

## 常见问题排查

1. 如果网站无法访问：
   - 检查服务器防火墙设置
   - 确认 Docker 容器运行状态
   - 查看 Docker 日志是否有错误信息

2. 如果部署失败：
   - 确保所有配置文件格式正确
   - 检查服务器磁盘空间是否充足
   - 确认 Docker 服务是否正常运行

## 更新部署

当需要更新应用时：

1. 在本地更新代码
2. 重新执行打包上传步骤
3. 在服务器上执行：
```bash
cd ~/lyooli-react
sudo docker-compose up -d --build
```

## 项目结构

```
lyooli-react/
├── src/
│   ├── App.js          # 主应用组件
│   ├── App.css         # 样式文件
│   └── index.js        # 入口文件
├── public/
│   └── index.html      # HTML模板
├── Dockerfile          # Docker构建文件
├── docker-compose.yml  # Docker Compose配置
├── nginx.conf          # Nginx配置
├── .dockerignore       # Docker忽略文件
└── package.json        # 项目依赖配置
```
```

这份完整的 README 包含了：
- 详细的文件内容
- 完整的部署步骤
- 必要的配置文件
- 常用维护命令
- 问题排查指南

需要补充或修改其他内容吗？