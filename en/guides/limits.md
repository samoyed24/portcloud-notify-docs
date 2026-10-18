# Message Credits and rate limits

## Pricing

| Target type | Cost per success |
| ----------- | ---------------- |
| Email       | 10 Credits       |
| ntfy        | 5 Credits        |
| WeCom       | 5 Credits        |
| Feishu      | 5 Credits        |
| DingTalk    | 5 Credits        |

The administrator can change these prices. Always read `credits_per_target` from `GET /api/v1/me`; `0` means the channel type is disabled (acceptance, adding a channel, and preset create/update all return `400 CHANNEL_TYPE_DISABLED`). The table above shows the defaults. A price change only affects sends accepted after the change; in-flight jobs settle at the price snapshotted at acceptance.

The default is 500 Message Credits per day per account. Acceptance reserves Credits; success settles, known failure releases. When the outcome is unknown: email (SMTP) and preset chains retain the reservation, while a plain ntfy send releases it immediately (an uncertain result cannot distinguish "not delivered" from "accepted but response lost"). A preset reserves the most expensive node and settles the actually delivered node. See [Sending presets](./presets.md).

## Query current credits

```bash
curl "$BASE_URL/api/v1/me" \
  -H "Authorization: Bearer $PORTCLOUD_NOTIFY_API_KEY"
```

| Field                                                                                                                            | Meaning                                                                                |
| -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `daily_message_credits`                                                                                                          | Daily Credits; 0 means unlimited                                                       |
| `message_credits_used`                                                                                                           | Settled for sends accepted today (late finishes still count toward the acceptance day) |
| `message_credits_reserved`                                                                                                       | In-flight reservations                                                                 |
| `message_credits_remaining`                                                                                                      | Available (reservations deducted)                                                      |
| `credits_per_target`                                                                                                             | Current price per channel type; `0` means the type is disabled                         |
| `daily_reset_at`                                                                                                                 | Next reset time                                                                        |
| `daily_attempt_limit` / `daily_attempt_used`                                                                                     | Daily attempt cap / used                                                               |
| `max_verified_emails` / `max_ntfy_channels` / `max_wecom_bot_channels` / `max_feishu_bot_channels` / `max_dingtalk_bot_channels` | Channel limits                                                                         |

Full fields: [Account API](../api/account.md). Values follow the current account response.

## Daily reset

Credits and daily attempts reset at midnight in `APP_TIMEZONE` (default `Asia/Shanghai`), per `daily_reset_at`.

## Service-wide budget

A shared global daily Credits pool (default 20000) can reject sends even with personal Credits remaining, returning `503 GLOBAL_MESSAGE_CREDITS_EXHAUSTED`.

## Rate limits

| Type         | Rule                                                                                                                                                               |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Send         | Per-account minute and daily attempt limits; daily attempts default to daily Credits × 2 and can be pinned to a fixed value or made unlimited by the administrator |
| Public reads | Shared account read budget, split by category                                                                                                                      |
| IP           | 300 requests per minute per source IP                                                                                                                              |
| Star recheck | 6 per account per hour                                                                                                                                             |

429 responses usually include `Retry-After`. Credits and attempt exhaustion include `details.reset_at`.

Test notifications share the same budget as real sends — no extra free allowance. Verification codes and adding ntfy channels do not consume Credits.

Related: [Error reference](../errors.md) · [Plans and Stars](./plans.md)
