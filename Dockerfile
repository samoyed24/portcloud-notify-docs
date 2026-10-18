# syntax=docker/dockerfile:1

# ---- 构建层：静态资源与运行镜像的 CPU 架构无关 ----
FROM --platform=$BUILDPLATFORM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
# pnpm-workspace.yaml 必须一起复制：pnpm 10 的 onlyBuiltDependencies 配置在那里，
# 缺了它 --frozen-lockfile 会以 ERR_PNPM_IGNORED_BUILDS 失败。
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

# ---- 运行层 ----
FROM nginx:1.27-alpine AS runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
# 站点挂在 /docs/ 下，由 service 的 frontend nginx 反代。
COPY --from=build /app/.vitepress/dist /usr/share/nginx/html/docs

RUN chown -R nginx:nginx /usr/share/nginx/html /var/cache/nginx \
    && touch /var/run/nginx.pid && chown nginx:nginx /var/run/nginx.pid

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1/healthz >/dev/null 2>&1 || exit 1

CMD ["nginx", "-g", "daemon off;"]
