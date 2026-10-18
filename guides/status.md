# 发送状态

用受理响应的 `log_id` 调用[状态 API](../api/status.md) `GET /api/v1/send/{log_id}` 查询投递结果。

`POST /api/v1/send` 的 `log_id` 是第一个目标的；`POST /api/v1/send-preset` 的 `log_id` 代表整条预设链路。其余目标的日志在[发送日志](../api/logs.md)查看。

## 五种状态

| `status`   | 含义                    | 终态 |
| ---------- | ----------------------- | ---- |
| `queued`   | 已受理，等待投递        | 否   |
| `sending`  | 正在投递                | 否   |
| `success`  | SMTP 或 ntfy 服务已接受 | 是   |
| `failed`   | 投递失败或结果无法确定  | 是   |
| `rejected` | 校验、权限或风控未通过  | 是   |

正常路径为 `queued → sending → success` 或 `queued → sending → failed`。投递较快时第一次查询可能已是终态。

## 轮询

每隔几秒查询一次，终态后停止。遇到 `429 RATE_LIMITED` 按 `Retry-After` 等待后重查同一个 ID。

## 服务接受不等于送达

`success` 表示邮件的 SMTP 服务或 ntfy 服务已接受，不保证到达收件箱或客户端。检查垃圾邮件、过滤规则、ntfy 订阅目标。本服务不提供阅读回执或打开追踪。

## 结果未知与重复发送

`failed` 不总能证明邮件没有发出。`interrupted`、`smtp_timeout`、`smtp_connection_error` 可能意味着远端已接受但本服务未收到完整响应。POST 响应丢失也存在相同风险。

服务不会自动重试。先查 `log_id`、日志和收件箱，再决定是否重新发送。重新 POST 是新请求，可能产生重复通知。

相关：[Message Credits](./limits.md) · [错误参考](../errors.md)
