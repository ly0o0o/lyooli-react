# 使用 nginx 镜像
FROM nginx:alpine

# 删除默认的 nginx 静态文件
RUN rm -rf /usr/share/nginx/html/*

# 复制构建好的文件到 nginx 目录
COPY build/ /usr/share/nginx/html

# 复制 nginx 配置文件
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 暴露 80 端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"] 