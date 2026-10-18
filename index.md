# Portcloud Notify 文档

Portcloud Notify 提供托管通知：在控制台设置邮箱 / ntfy / 企业微信 / 飞书 / 钉钉渠道和发送预设，创建 API Key，然后用 HTTP API 提交通知并查询状态。

## 从这里开始

- [快速开始](./quickstart.md)：登录、设置渠道、创建 Key、发送并查询。
- [通知渠道](./guides/recipients.md)：添加邮箱 / ntfy / 企业微信 / 飞书 / 钉钉渠道。
- [发送预设](./guides/presets.md)：配置有序投递链路。
- [API Key](./guides/api-keys.md)：创建、查看、轮换。
- [发送通知](./guides/sending.md)：请求字段、目标选择、大小限制。
- [测试通知](./guides/testing.md)：控制台按渠道或按预设测试。
- [发送状态](./guides/status.md)：状态轮询与结果判断。
- [Message Credits 与限流](./guides/limits.md)：每日预算、预占、结算、限流。
- [账号方案与 Star](./guides/plans.md)：Free、Supporter 与预留方案。
- [错误参考](./errors.md) · [常见问题](./faq.md)

## 公共 API 参考

| 操作                         | 参考                                       |
| ---------------------------- | ------------------------------------------ |
| `POST /api/v1/send`          | [提交通知](./api/send.md)                  |
| `POST /api/v1/send-preset`   | [按发送预设提交](./api/send-preset.md)     |
| `GET /api/v1/send/{log_id}`  | [查询发送状态](./api/status.md)            |
| `GET /api/v1/me`             | [账号与 Message Credits](./api/account.md) |
| `GET /api/v1/emails`         | [已验证收件邮箱](./api/recipients.md)      |
| `GET /api/v1/logs`           | [发送日志](./api/logs.md)                  |
| `GET /api/v1/stats/overview` | [账号统计](./api/stats.md)                 |

API 参考由后端 OpenAPI 契约自动生成。所有公共操作使用 `Authorization: Bearer <API_KEY>`。渠道、发送预设和 Key 管理由浏览器控制台完成。

## 控制台

<a href="/app/dashboard" target="_self">仪表盘</a>查看 Message Credits、状态与统计；<a href="/app/channels" target="_self">通知渠道</a>配置邮箱 / ntfy / 企业微信 / 飞书 / 钉钉；<a href="/app/presets" target="_self">发送预设</a>配置投递链路；<a href="/app/plans" target="_self">账号方案</a>查看权限与 Star 引导。
