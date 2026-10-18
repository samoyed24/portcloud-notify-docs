# 发送通知

[提交 API](../api/send.md)提供 `POST /api/v1/send` 和 [`POST /api/v1/send-preset`](../api/send-preset.md)，均使用 API Key Bearer 认证。预设发送详见[发送预设](./presets.md)。

## 请求字段

| 字段    | 必填   | 规则                                                                   |
| ------- | ------ | ---------------------------------------------------------------------- |
| `type`  | 是     | `"email"`、`"ntfy"`、`"wecom_bot"`、`"feishu_bot"` 或 `"dingtalk_bot"` |
| `to`    | 否     | 目标必须是已添加的渠道；省略时投递默认渠道                             |
| `title` | 是     | 1–200 字符，不含换行                                                   |
| `body`  | 二选一 | 非空纯文本，最多 1,048,576 字符                                        |
| `html`  | 二选一 | 非空自定义 HTML，最多 1,048,576 字符；仅 `type="email"`                |

请求体只接受以上字段，未知字段返回 `422 VALIDATION_ERROR`。旧 `subject`、`text` 字段同样拒绝。

`body` 与 `html` 必须且只能给一个：两个都给或都不给都返回 422。ntfy 与群机器人（`wecom_bot`、`feishu_bot`、`dingtalk_bot`）带 `html` 也返回 422。

## 选择目标

- **提供 `to`**：只投递该目标。`type="email"` 填已验证邮箱地址，`type="ntfy"` 填渠道列表中的完整 topic；群机器人填渠道列表中的目标标识：企业微信 `wb_...`、飞书 `fs_...`、钉钉 `dt_...`。目标必须是本账号已添加的渠道。
- **省略 `to`**：投递此前保存的默认渠道中与 `type` 匹配的，按原顺序。无匹配返回 `400 NO_DEFAULT_CHANNEL`。控制台已移除默认渠道配置入口；新用户请提供 `to`。

不支持收件人数组、抄送或密送。

## 内容格式

- `body`：纯文本，保留 Unicode 和换行，不解析 HTML。邮件套服务统一模板（`multipart/alternative`：纯文本 + 模板 HTML）；ntfy 与群机器人收到原始纯文本。
- `html`：仅 `type="email"` 可用，作为整封邮件原样投递 —— 不套模板、不转义、不追加纯文本回退。邮件内容、链接与样式由你负责。

预设发送（[发送预设](./presets.md)）只接受 `title` 与纯文本 `body`，不带 `html`。附件和自定义发件人仍不支持。

## 大小限制

报文字节上限由[账号 API](../api/account.md)的 `max_message_size_bytes` 给出。含邮箱目标（含预设链路中的邮箱节点）时，服务检查每封邮件组装后的完整 MIME 大小（自定义 HTML 按整封 HTML 邮件计算）；纯 ntfy 只检查正文 UTF-8 字节数。群机器人把 `title` + 空行 + `body` 拼接后检查：企业微信最多 **2048 字节**，飞书与钉钉在受理前按 **18 KiB** 的产品阈值检查，飞书投递时还会校验整个 JSON 请求体不超过官方的 **20 KB**。超长在受理前或投递时明确失败。多字节字符和 MIME 编码会增加大小，正文应留出空间。HTTP 请求体另有 2 MiB 上限。

## 示例

邮件（纯文本，套服务模板）：

```json
{ "type": "email", "to": "you@example.com", "title": "部署完成", "body": "服务已部署。" }
```

邮件（自定义 HTML，原样投递）：

```json
{
  "type": "email",
  "to": "you@example.com",
  "title": "部署完成",
  "html": "<h1>部署完成</h1><p>服务已上线。</p>"
}
```

ntfy（`to` 为渠道列表里的完整 topic）：

```json
{ "type": "ntfy", "to": "a1b2c3d4e5f6-alerts", "title": "部署完成", "body": "服务已部署。" }
```

企业微信（`to` 为渠道列表里的 `wb_...` 目标标识）：

```json
{ "type": "wecom_bot", "to": "wb_3f8a1b2c9d0e", "title": "部署完成", "body": "服务已部署。" }
```

飞书（`to` 为 `fs_...` 目标标识）：

```json
{ "type": "feishu_bot", "to": "fs_3f8a1b2c9d0e", "title": "部署完成", "body": "服务已部署。" }
```

钉钉（`to` 为 `dt_...` 目标标识）：

```json
{ "type": "dingtalk_bot", "to": "dt_3f8a1b2c9d0e", "title": "部署完成", "body": "服务已部署。" }
```

群机器人消息都会把 `title`、一个空行、`body` 依次拼接；没有 `title` 时只发 `body`。

## 受理与投递

成功受理返回 **201** 和 `{"log_id":123,"status":"queued"}`。`log_id` 是第一个目标的日志 ID，用[状态 API](../api/status.md)查询。多目标的其余日志在[发送日志](../api/logs.md)查看。受理后不自动重试，重新 POST 是新的发送。

相关：[发送预设](./presets.md) · [发送状态](./status.md) · [Message Credits](./limits.md) · [错误参考](../errors.md)
