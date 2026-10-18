# API Key

公共 API 使用 Bearer API Key 认证：

```http
Authorization: Bearer <API_KEY>
```

使用完整 Key，不是名称或前缀。一个 Key 代表所属账号，共享该账号的发送和读取限额。创建更多 Key 不会增加 Credits。

## 创建

在<a href="/app/dashboard" target="_self">控制台</a>「API Key」中创建，需 Supporter 或以上权限。有效期可选 30、60、90、180、365 天或永不过期（默认）。

## 查看与保存

创建时显示完整 Key。列表只展示名称、前缀、有效期等信息。控制台支持「查看」再次获取完整值。

Key 保存在服务端环境变量或密钥管理系统中，不要放入前端代码、公开仓库或截图。泄露时直接删除并更换。

## 删除与轮换

删除后不能用于新请求。删除不会抹去已有发送日志。轮换时先创建新 Key、切换调用、再删除旧 Key（若名额已满，先删除不再使用的 Key 或请管理员调整上限）。

过期但未撤销的 Key 返回 `401`，仍占名额直到删除。已撤销的 Key 立即释放名额，且不再出现在列表中，无需再删除。

相关：[快速开始](../quickstart.md) · [Message Credits](./limits.md) · [错误参考](../errors.md)
