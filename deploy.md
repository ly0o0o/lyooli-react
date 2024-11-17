# React 项目部署指南

## 1. 项目准备

### 1.1 项目构建
首先在本地开发环境构建项目：
```bash
npm run build
```
这会生成一个 `build` 目录，包含所有静态资源文件。

### 1.2 文件说明
build 目录通常包含：
- `index.html`：主页面
- `static/`：静态资源（JS、CSS、图片等）
- `asset-manifest.json`：资源映射文件
- `favicon.ico`：网站图标
- `manifest.json`：PWA 配置文件
- `robots.txt`：搜索引擎配置文件

## 2. 服务器配置

### 2.1 创建项目目录
```bash
# 创建项目目录
mkdir -p /opt/lyooli-react
cd /opt/lyooli-react
```

### 2.2 上传文件
将以下文件上传到服务器：
- build 目录（构建后的静态文件）
- nginx.conf（Nginx 配置文件）
- Dockerfile（Docker 构建文件）

## 3. 配置文件准备

### 3.1 Nginx 配置
创建 `nginx.conf`：
```nginx
server {
    listen 80;
    server_name localhost;
    
    root /usr/share/nginx/html;
    index index.html;

    # 所有路由都转发到 index.html
    location / {
        try_files $uri $uri/ /index.html;
        # 禁用缓存
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # 静态资源缓存配置
    location /static/ {
        expires 1y;
        add_header Cache-Control "public";
    }
}
```

### 3.2 Dockerfile 配置
创建 `Dockerfile`：
```dockerfile
# 使用轻量级的 nginx 镜像
FROM nginx:alpine

# 删除默认的 nginx 静态文件
RUN rm -rf /usr/share/nginx/html/*

# 复制构建好的文件到 nginx 目录
COPY build/ /usr/share/nginx/html/

# 复制 nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]
```

## 4. Docker 部署

### 4.1 构建 Docker 镜像
```bash
# 构建镜像
docker build -t lyooli-react .
```

### 4.2 运行容器
```bash
# 停止并删除旧容器（如果存在）
docker rm -f lyooli-react 2>/dev/null

# 运行新容器
docker run -d \
  --name lyooli-react \
  -p 80:80 \
  --restart unless-stopped \
  lyooli-react
```

## 5. 验证部署

### 5.1 检查容器状态
```bash
# 查看容器运行状态
docker ps

# 查看容器日志
docker logs lyooli-react
```

### 5.2 检查文件部署
```bash
# 进入容器
docker exec -it lyooli-react sh

# 检查文件
ls -la /usr/share/nginx/html/

# 检查 nginx 配置
cat /etc/nginx/conf.d/default.conf
```

### 5.3 访问测试
- 命令行测试：`curl localhost`
- 浏览器访问：`http://服务器IP`

## 6. 常见问题处理

### 6.1 页面显示 Nginx 默认欢迎页
可能原因：
1. 静态文件未正确复制
2. Nginx 配置未生效
3. 容器未正确重启

解决方案：
```bash
# 检查文件
docker exec -it lyooli-react sh -c "ls -la /usr/share/nginx/html"

# 检查 nginx 配置
docker exec -it lyooli-react sh -c "cat /etc/nginx/conf.d/default.conf"

# 重新构建和部署
docker rm -f lyooli-react
docker build -t lyooli-react .
docker run -d --name lyooli-react -p 80:80 --restart unless-stopped lyooli-react
```

### 6.2 页面无法访问
可能原因：
1. 端口未开放
2. 防火墙限制
3. Nginx 服务未启动

解决方案：
```bash
# 检查端口
netstat -tlnp | grep 80

# 检查防火墙
firewall-cmd --list-all

# 检查 nginx 状态
docker exec -it lyooli-react nginx -t
```

## 7. 更新部署

### 7.1 更新流程
1. 本地构建新版本
2. 上传新的 build 目录
3. 重新构建和部署：
```bash
docker build -t lyooli-react .
docker rm -f lyooli-react
docker run -d --name lyooli-react -p 80:80 --restart unless-stopped lyooli-react
```

## 8. 维护命令

### 8.1 常用 Docker 命令
```bash
# 查看容器日志
docker logs -f lyooli-react

# 重启容器
docker restart lyooli-react

# 进入容器
docker exec -it lyooli-react sh

# 查看容器资源使用
docker stats lyooli-react
```

### 8.2 备份和恢复
```bash
# 导出镜像
docker save lyooli-react > lyooli-react.tar

# 导入镜像
docker load < lyooli-react.tar
```
```

需要我详细解释任何部分吗？