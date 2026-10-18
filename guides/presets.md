# 发送预设

发送预设是一条有序投递链路：按顺序尝试每个节点，某个节点成功即停止，明确失败才顺延到下一个。每个账号最多保存一个预设。

## 创建预设

在<a href="/app/presets" target="_self">发送预设</a>页点击「创建预设」：

1. 点击虚线框添加节点，选择邮箱、ntfy、企业微信、飞书或钉钉，再选具体渠道。
2. 链路含 1–3 个节点，类型可混。邮箱与群机器人节点必须已验证。
3. 节点可点击编辑、删除、左右调序。
4. 保存后显示可视化链路。

已有预设时按钮变为「编辑」，另有「删除」。

## 使用预设发送

```bash
curl -i "$BASE_URL/api/v1/send-preset" \
  -H "Authorization: Bearer $PORTCLOUD_NOTIFY_API_KEY" \
  -H 'Content-Type: application/json' \
  --data '{"title":"部署完成","body":"服务已部署。"}'
```

请求体只有 `title` 和 `body`，不含预设 ID。尚未配置预设时返回 `400 NO_PRESET`。

受理返回单个 `log_id`，代表整条链路。用[状态 API](../api/status.md)轮询到终态。链路收到相同标题和纯文本正文。

## Credits 结算

受理按链路上最贵节点预占（默认邮箱 10，其余渠道 5，以 `credits_per_target` 为准），成功按实际成功节点结算并退回差额，全部明确失败则整体释放。链路含已停用类型（单价 0）时整单拒绝，返回 `400 CHANNEL_TYPE_DISABLED`。详见[Message Credits](./limits.md)。

相关：[通知渠道](./recipients.md) · [发送通知](./sending.md) · [测试通知](./testing.md)
