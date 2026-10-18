# 账号方案与 Star

在<a href="/app/plans" target="_self">账号方案页</a>查看层级与权益。

## 当前方案

| 方案           | 权限                                   |
| -------------- | -------------------------------------- |
| Free           | 可进入控制台查看信息；发送等功能未解锁 |
| Supporter      | 解锁发送、渠道管理、API Key 和测试通知 |
| Plus / Premium | 预留层级，暂无自助升级                 |

## 从 Free 升级到 Supporter

1. 使用 Portcloud 账号登录（邮箱或 GitHub）；解锁 Supporter 需要账号已绑定 GitHub。
2. 给 [portcloud-labs/portcloud](https://github.com/portcloud-labs/portcloud) 点 Star。
3. 返回方案页点击「重新检测」，确认后解锁。

层级提升是单向的，取消 Star 不会降回 Free。

## 取消 Star 的影响

取消 Star 后新发送可能被拒绝（`403 STAR_REQUIRED`），限制会随后续核验加重。重新点 Star 并检测可恢复。若提示需要重新登录（GitHub 令牌失效），先重新登录再检测；继续重试检测不会恢复，还会消耗每小时检测次数。已受理任务不受影响。

## 重新检测限制

手动「重新检测」每账号每小时最多 6 次，超限返回 `429 RATE_LIMITED`（`Retry-After: 3600`）。GitHub 不可用时保留上次状态。

相关：[快速开始](../quickstart.md) · [Message Credits](./limits.md) · [错误参考](../errors.md)
