# 常见问题

## 登录后为什么不能发送？

新账号为 Free，需给 [portcloud-labs/portcloud](https://github.com/portcloud-labs/portcloud) 点 Star 并重新检测，升级为 Supporter 后才能发送。详见[账号方案](./guides/plans.md)。

## 能向任意邮箱发送吗？

不能。邮箱只能发送到当前账号已验证的地址。发给多个目标请逐个调用发送 API（省略 `to` 会投递同类型的全部默认渠道）；[发送预设](./guides/presets.md)是故障后备链路，首个节点成功即停止，不会向其余节点发送。

## 验证码发出了为什么还是未验证？

发出验证码和完成验证是两步。输入最新验证码并确认，渠道显示已验证才算完成。验证码有效期以邮件、群消息和控制台提示为准，详见[通知渠道](./guides/recipients.md)。

## API Key 只能看一次吗？

不是。创建时显示完整值，控制台也支持「查看」再次获取。未撤销的 Key（含过期）都占名额；已撤销的 Key 立即释放名额。

## 201 是发送成功吗？

不是。201 表示已受理。检查查询返回的 `status` 字段，`success` 才表示服务已接受。详见[发送状态](./guides/status.md)。

## `success` 为什么没有收到通知？

`success` 表示 SMTP、ntfy、企业微信、飞书或钉钉服务已接受，不保证到达收件箱、客户端或群聊。检查垃圾邮件、过滤规则、ntfy 订阅或群设置。本服务不提供阅读回执。

## 超时后可以马上重发吗？

不要盲目重发。超时或 `interrupted` 可能意味着结果未知，邮件可能已发出。先查 `log_id` 和日志。重新 POST 是新的发送，可能重复。

## 能发自定义 HTML 或附件吗？

邮件可以：`type="email"` 时用 `html` 字段把自定义 HTML 作为整封邮件投递（不套服务模板）；用 `body` 则套模板发纯文本通知。ntfy 与群机器人只能发纯文本 `body`，带 `html` 返回 422；预设发送同样只接受 `body`。附件仍不支持。详见[发送通知](./guides/sending.md#内容格式)。

## 群机器人怎么配置？

在企业微信、飞书或钉钉群中创建自定义机器人，在控制台添加 Webhook；飞书和钉钉启用加签时还需填写签名密钥。添加会自动尝试发送首个验证码，收到后在控制台确认。详细步骤、各类型限额与发码失败处理见[通知渠道](./guides/recipients.md)。

## 为什么有 Credits 还被拒绝？

可能是在途预占、每日尝试限制、分钟限流、全站 Credits 耗尽或依赖故障。查看[当前额度](./api/account.md)并按错误码排查。详见[Message Credits](./guides/limits.md)。

## 每日什么时候重置？

在 `APP_TIMEZONE` 的零点重置（默认 `Asia/Shanghai`），以 `daily_reset_at` 为准。查询不消耗 Credits。

## 多创建 Key 能增加 Credits 吗？

不能。Key 共享账号限制。

## Plus / Premium 怎么购买？

当前是预留方案，没有自助购买流程。实际可用 Credits 以账号返回为准。

## 在哪里看日志？

打开<a href="/app/dashboard" target="_self">控制台</a>查看，或使用[日志 API](./api/logs.md)。需要交互调试时打开<a href="/api/docs" target="_self">Swagger UI</a>。
