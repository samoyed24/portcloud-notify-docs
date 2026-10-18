# Message Credits 与限流

## 单价

| 目标类型 | 成功结算   |
| -------- | ---------- |
| 邮箱     | 10 Credits |
| ntfy     | 5 Credits  |
| 企业微信 | 5 Credits  |
| 飞书     | 5 Credits  |
| 钉钉     | 5 Credits  |

单价可由管理员调整，以 `GET /api/v1/me` 返回的 `credits_per_target` 为准；`0` 表示该渠道类型已停用（受理、新增渠道、预设创建与更新都会返回 `400 CHANNEL_TYPE_DISABLED`）。上表为默认值。改价只影响改价之后受理的发送，在途任务按受理时的单价结算。

默认每账号每天 500 Message Credits。受理时按目标预占，成功结算，已知失败释放。结果未知时：邮件（SMTP）与预设链路保留预占，普通 ntfy 发送会立即释放（无法区分"未送达"与"服务已接受但响应丢失"）。预设按链路上最贵节点预占，成功按实际节点结算并退回差额。

## 查询当前额度

```bash
curl "$BASE_URL/api/v1/me" \
  -H "Authorization: Bearer $PORTCLOUD_NOTIFY_API_KEY"
```

| 字段                                                                                                                             | 含义                                           |
| -------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `daily_message_credits`                                                                                                          | 每日 Credits，0 表示不限                       |
| `message_credits_used`                                                                                                           | 本日受理批次的成功结算（跨日完成仍计入受理日） |
| `message_credits_reserved`                                                                                                       | 在途预占                                       |
| `message_credits_remaining`                                                                                                      | 可用（已扣除预占）                             |
| `credits_per_target`                                                                                                             | 各渠道类型当前单价；`0` 表示该类型已停用       |
| `daily_reset_at`                                                                                                                 | 下次重置时间                                   |
| `daily_attempt_limit` / `daily_attempt_used`                                                                                     | 每日尝试上限 / 已用                            |
| `max_verified_emails` / `max_ntfy_channels` / `max_wecom_bot_channels` / `max_feishu_bot_channels` / `max_dingtalk_bot_channels` | 各渠道数量上限                                 |

完整字段见[账号 API](../api/account.md)。以当前账号返回为准。

## 每日重置

Credits 和每日尝试在 `APP_TIMEZONE` 的零点重置（默认 `Asia/Shanghai`），以 `daily_reset_at` 为准。

## 全站预算

服务有共享的全站每日 Credits（默认 20000）。个人额度足够仍可能因全站预算被拒绝，返回 `503 GLOBAL_MESSAGE_CREDITS_EXHAUSTED`。

## 限流

| 类型          | 规则                                                                                              |
| ------------- | ------------------------------------------------------------------------------------------------- |
| 发送          | 每账号分钟尝试限制与每日尝试限制；每日尝试默认 = 每日 Credits × 2，可由管理员改为固定值或设为不限 |
| 公共读取      | 所有 Key 共享账号读取预算，按类别分配                                                             |
| IP            | 来源 IP 每分钟 300 请求                                                                           |
| Star 重新检测 | 每账号每小时 6 次                                                                                 |

429 响应按 `Retry-After` 等待。Credits 和每日尝试超限查看 `details.reset_at`。

测试通知与正式发送共用同一预算，没有额外免费额度。验证码和添加 ntfy 不消耗 Credits。

相关：[错误参考](../errors.md) · [账号方案](./plans.md)
