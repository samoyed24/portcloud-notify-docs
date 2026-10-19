# 错误参考

公共 API 使用真实 HTTP 状态码。成功提交返回 `201`；查询返回 `200` 只说明查询成功，仍应检查 JSON 中的 `status`。

## 错误响应

```json
{
  "error": {
    "code": "RECIPIENT_NOT_VERIFIED",
    "message": "Recipient is not in your verified list.",
    "details": { "reason": "recipient_not_verified" }
  }
}
```

按 HTTP 状态和 `error.code` 处理，不要匹配 `message` 文案。

## 公共 API 错误

| HTTP | `error.code`                       | 含义                                                                        |
| ---- | ---------------------------------- | --------------------------------------------------------------------------- |
| 400  | `RECIPIENT_NOT_VERIFIED`           | `to` 的邮箱未验证                                                           |
| 400  | `INVALID_RECIPIENT_FORMAT`         | `to` 的邮箱格式无效（公共 API 格式校验未通过时返回 `422 VALIDATION_ERROR`） |
| 400  | `NO_DEFAULT_CHANNEL`               | 省略 `to` 且无匹配默认渠道                                                  |
| 400  | `NO_PRESET`                        | 未配置预设                                                                  |
| 400  | `CHANNEL_UNVERIFIED`               | 发送目标、默认渠道或预设中的邮箱/群机器人尚未验证                           |
| 400  | `CHANNEL_TYPE_DISABLED`            | 渠道类型已被管理员停用（单价为 0）                                          |
| 401  | `UNAUTHENTICATED`                  | 未提供 API Key                                                              |
| 401  | `INVALID_API_KEY`                  | Key 无效或已撤销                                                            |
| 401  | `API_KEY_EXPIRED`                  | Key 已过期                                                                  |
| 403  | `STAR_REQUIRED`                    | 未解锁或取消 Star                                                           |
| 403  | `USER_DISABLED`                    | 账号已禁用                                                                  |
| 404  | `NOT_FOUND`                        | ntfy topic、群机器人目标不属于本账号，或渠道、`log_id` 不存在               |
| 413  | `PAYLOAD_TOO_LARGE`                | 请求体或报文超限                                                            |
| 422  | `VALIDATION_ERROR`                 | 字段、类型或约束错误                                                        |
| 429  | `RATE_LIMITED`                     | 发送或读取限流                                                              |
| 429  | `MESSAGE_CREDITS_EXHAUSTED`        | 个人 Credits 不足                                                           |
| 429  | `DAILY_ATTEMPT_LIMIT_REACHED`      | 每日尝试上限                                                                |
| 503  | `GLOBAL_MESSAGE_CREDITS_EXHAUSTED` | 全站 Credits 不足                                                           |
| 503  | `DEPENDENCY_UNAVAILABLE`           | 依赖服务不可用                                                              |
| 500  | `INTERNAL_ERROR`                   | 服务端异常（不是参数问题，请稍后重试）                                      |

429 响应通常包含 `Retry-After`。Credits 和尝试超限查看 `details.reset_at`。

## 控制台错误

| HTTP | `error.code`                | 场景                                       |
| ---- | --------------------------- | ------------------------------------------ |
| 400  | `VERIFICATION_CODE_INVALID` | 邮箱或群机器人验证码错误、过期或已失效     |
| 400  | `CHANNEL_TARGET_INVALID`    | ntfy topic 或群机器人 Webhook/凭据格式无效 |
| 409  | `EMAIL_ALREADY_EXISTS`      | 邮箱已添加（含待验证）                     |
| 409  | `EMAIL_LIMIT_REACHED`       | 当前类型渠道达上限                         |
| 409  | `CHANNEL_ALREADY_EXISTS`    | ntfy topic 或群机器人已添加（含待验证）    |
| 409  | `API_KEY_LIMIT_REACHED`     | Key 达上限                                 |
| 409  | `PRESET_EXISTS`             | 已有预设                                   |
| 409  | `GITHUB_NOT_BOUND`          | 账号未绑定 GitHub（Star 检测前需先绑定）   |
| 423  | `CODE_LOCKED`               | 验证码多次输错                             |
| 429  | `VERIFY_CODE_RATE_LIMITED`  | 验证码重发过快或当日发码额度已用完         |

## `failure_reason`

日志中的失败原因是小写字符串：

| 原因                                                          | 含义                                       |
| ------------------------------------------------------------- | ------------------------------------------ |
| `invalid_recipient_format`                                    | 邮箱地址格式无效                           |
| `recipient_not_verified`                                      | 邮箱或群机器人尚未验证（含受理后验证失效） |
| `message_credits_exhausted`, `daily_attempt_limit_reached`    | Credits 或尝试限制                         |
| `channel_type_disabled`                                       | 渠道类型已被管理员停用                     |
| `smtp_timeout`, `smtp_connection_error`, `smtp_unknown_error` | SMTP 超时或错误，结果可能未知              |
| `interrupted`                                                 | 处理中断，不能证明未发出                   |
| `channel_unreachable`                                         | ntfy 或群机器人网络/超时失败               |
| `channel_delivery_error`                                      | ntfy 或群机器人服务拒绝、目标或凭据失效    |

相关：[发送状态](./guides/status.md) · [Message Credits](./guides/limits.md)
