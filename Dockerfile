# ============================
# 第一阶段：构建前端静态资源
# ============================
FROM node:22-alpine AS builder

WORKDIR /app

# 先复制依赖清单，充分利用 Docker 层缓存。
COPY package.json package-lock.json ./

# 使用 package-lock.json 固定依赖版本，保证镜像构建可复现。
RUN npm ci

COPY . .

RUN npm run build

# ============================
# 第二阶段：使用 Nginx 托管静态资源
# ============================
FROM nginx:1.27-alpine

# 写入轻量 Nginx 配置：
# 1. 支持 React BrowserRouter 深层路由刷新回退到 index.html。
# 2. 静态资源启用长期缓存，入口 HTML 不强缓存。
RUN printf '%s\n' \
    'server {' \
    '    listen 80;' \
    '    server_name _;' \
    '' \
    '    root /usr/share/nginx/html;' \
    '    index index.html;' \
    '' \
    '    location /assets/ {' \
    '        try_files $uri =404;' \
    '        access_log off;' \
    '        expires 1y;' \
    '        add_header Cache-Control "public, immutable";' \
    '    }' \
    '' \
    '    location / {' \
    '        try_files $uri $uri/ /index.html;' \
    '        add_header Cache-Control "no-cache";' \
    '    }' \
    '}' \
    > /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
