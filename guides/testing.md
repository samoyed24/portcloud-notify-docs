# 测试通知

控制台<a href="/app/test-notification" target="_self">测试通知</a>页提供两种测试方式。测试与正式发送共用同一 Credits 与尝试预算。

## 按渠道测试

选择邮箱、ntfy 或群机器人、API Key 和目标，填写标题与正文后发送。邮件发送到已验证地址，ntfy 发送到所选渠道的完整 topic；群机器人只列出已验证渠道，并发送到其 `wb_...` / `fs_...` / `dt_...` 目标。

## 按预设测试

前往<a href="/app/test-notification/preset" target="_self">预设测试</a>，选择 Key、填写标题与正文，按当前预设链路发送。链路只读，修改请去<a href="/app/presets" target="_self">发送预设</a>。未设置预设时相关控件禁用。

## 生成测试代码

两个页面都提供「生成测试代码」，会填入选定 Key 的明文生成示例。生成动作不发送、不消耗 Credits。复制分享前检查并替换实际 Key 值。

相关：[发送预设](./presets.md) · [发送通知](./sending.md) · [发送状态](./status.md)
