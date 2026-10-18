# Portcloud Notify Docs

Portcloud Notify 的用户文档站（VitePress，中英文双语）：使用指南、公共 API 参考、错误码与 FAQ。

- 线上地址：<https://notify.portcloud.online/docs/>
- 服务仓库：[`samoyed24/portcloud-notify`](https://github.com/samoyed24/portcloud-notify)（`service/`）
- 文档地址约定：站点始终挂在同源 `/docs/` 下，文档里的 `/app/*`（控制台）和 `/api/docs`（Swagger）链接依赖这一点。

## 目录

```text
.
├── .vitepress/              # VitePress 配置、主题与公共 OpenAPI 快照
├── api/                     # 由快照生成的 API 页（不提交）
├── en/                      # 英文文档（en/api/ 同样由快照生成）
├── guides/                  # 中文使用指南
├── public/                  # favicon；openapi.json 构建时生成
├── scripts/                 # API 页生成器
├── index.md                 # 中文首页
└── CONVENTIONS.md           # 写作规范
```

## 本地开发

```bash
pnpm install
pnpm dev        # http://127.0.0.1:5174/docs/
```

`pnpm dev` 会先根据 `.vitepress/openapi.json` 重新生成中英文 API 页，再启动 VitePress。

其他命令：

```bash
pnpm build          # 生成 API 页并构建到 .vitepress/dist
pnpm preview        # 预览构建产物（http://127.0.0.1:4174/docs/）
pnpm format         # Prettier
pnpm format:check
```

在 service 仓库本地联调时，可以让 Vite 把 `/docs` 代理到本仓库：

```bash
# 本仓库
pnpm dev

# service/frontend，另一个终端
VITE_DOCS_TARGET=http://127.0.0.1:5174 pnpm dev
```

## OpenAPI 快照

API 参考不是手写的。`.vitepress/openapi.json` 是 service 后端导出的公共契约快照，`scripts/generate-api-docs.mjs` 从它生成 `api/*.md` 和 `en/api/*.md`，并把快照复制到 `public/openapi.json` 供下载。

后端修改公共接口后，在 service 仓库重新导出并提交到这里：

```bash
cd ../service/backend
uv run python -m app.export_openapi --output ../../docs/.vitepress/openapi.json
```

`service` 的 CI 只验证导出本身可以成功；跨仓库的快照同步需要这次手动提交。提交前跑一次 `pnpm build`，确认生成器和页面都正常。

## 写作规范

见 [`CONVENTIONS.md`](./CONVENTIONS.md)。

## 构建与发布

CI（GitHub Actions）在 `main` / `dev` 推送时：

1. `pnpm format:check`、`pnpm build`；
2. 构建 `linux/amd64` + `linux/arm64` 镜像并推送到 GHCR：
   - `ghcr.io/samoyed24/portcloud-notify-docs:latest`（main）
   - `ghcr.io/samoyed24/portcloud-notify-docs:dev`（dev）
   - `ghcr.io/samoyed24/portcloud-notify-docs:sha-<commit>`

文档容器只提供 `/docs/`，由 service 的 `frontend` nginx 反代。service 的 `docker-compose.yml` 通过 `DOCS_IMAGE_TAG`（默认 `latest`）拉取镜像；service 部署时一起更新文档。

只更新文档时，可以在服务器上单独拉取并重启文档容器：

```bash
cd /opt/notify
docker compose pull docs
docker compose up -d --no-deps docs
```
