# 快速开始

## 1. 登录并解锁

打开<a href="/app/dashboard" target="_self">控制台</a>，使用 Portcloud 账号登录（邮箱或 GitHub）。新账号为 Free，需先解锁才能发送。

按<a href="/app/plans" target="_self">账号方案页</a>提示给 [portcloud-labs/portcloud](https://github.com/portcloud-labs/portcloud) 点 Star，再点击「重新检测」。确认后升级为 Supporter。详见[账号方案](./guides/plans.md)。

## 2. 设置通知渠道

打开<a href="/app/channels" target="_self">通知渠道</a>，添加邮箱、ntfy 或群机器人：

- **邮箱**：输入地址，收取 6 位验证码，15 分钟内输入并确认。
- **ntfy**：输入 topic（如 `alerts`，1–40 位字母 / 数字 / `_` / `-`）。添加后复制列表中的完整 topic，在管理员提供的服务器上订阅。完整 topic 等同密码，不要公开。
- **企业微信**：在内部群右上角 `[...]` → `消息推送`（或「群机器人」）→ `添加`，复制 Webhook 地址并粘贴到控制台。添加后输入群内验证码，发送时使用 `wb_...` 目标标识。
- **飞书 / 钉钉**：在群设置中创建自定义机器人，复制 Webhook 地址；如启用了加签，同时填写签名密钥。添加后输入群内验证码，发送时使用 `fs_...` / `dt_...` 目标标识。详见[通知渠道](./guides/recipients.md#添加飞书)。

## 3. 创建 API Key

在「API Key」中创建一个 Key，选择有效期，保存完整值。详见[API Key](./guides/api-keys.md)。

## 4. 发送第一条通知

把 `BASE_URL` 替换成实际站点地址：

```bash
export BASE_URL='https://notify.portcloud.online'
read -r -s -p 'API Key: ' PORTCLOUD_NOTIFY_API_KEY
export PORTCLOUD_NOTIFY_API_KEY

curl -i "$BASE_URL/api/v1/send" \
  -H "Authorization: Bearer $PORTCLOUD_NOTIFY_API_KEY" \
  -H 'Content-Type: application/json' \
  --data '{"type":"email","to":"you@example.com","title":"第一次通知","body":"测试通知。"}'
```

成功返回 **HTTP 201** 和 `{"log_id": 123, "status": "queued"}`。`type` 必填（`email`、`ntfy`、`wecom_bot`、`feishu_bot` 或 `dingtalk_bot`），`to` 填已添加的渠道。详见[发送通知](./guides/sending.md)。

## 5. 查询发送结果

```bash
curl -i "$BASE_URL/api/v1/send/123" \
  -H "Authorization: Bearer $PORTCLOUD_NOTIFY_API_KEY"
```

`queued` / `sending` 是中间态，隔几秒再查。`success` / `failed` / `rejected` 为终态。详见[发送状态](./guides/status.md)。

完成后可执行 `unset PORTCLOUD_NOTIFY_API_KEY` 清除变量。也可以在<a href="/app/test-notification" target="_self">控制台</a>测试发送，详见[测试通知](./guides/testing.md)。

下一步：[发送通知](./guides/sending.md) · [Message Credits](./guides/limits.md) · [提交 API](./api/send.md)
