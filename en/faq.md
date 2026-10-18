# Frequently asked questions

## Why can't I send after signing in?

New accounts are Free. Star [portcloud-labs/portcloud](https://github.com/portcloud-labs/portcloud) and re-check to unlock as Supporter. See [Plans and Stars](./guides/plans.md).

## Can I send to any address?

No. Email sends only to addresses verified by your account. To reach multiple targets, call the send API per target (omitting `to` delivers to all default channels of that type); [sending presets](./guides/presets.md) are a fallback chain — the first successful node stops the chain, so remaining nodes are not sent to.

## Why is an address still unverified after receiving a code?

Requesting a code and completing verification are separate steps. Enter the latest 6-digit code and confirm; the address must appear in the verified list. Codes last 15 minutes.

## Can I view a key only once?

No. Creation shows the full value, and the console's "View" action retrieves it again. Un-revoked keys (including expired) occupy a slot; a revoked key releases its slot immediately.

## Does 201 mean delivery succeeded?

No. 201 means accepted. Check the `status` field in the query response; `success` means the service accepted it. See [Delivery status](./guides/status.md).

## Why is a `success` email not in the inbox?

`success` means the SMTP, ntfy, or WeCom service accepted it — not that it reached the inbox, client, or group. Check spam, filters, the ntfy subscription, or whether the WeCom group is muted for all members. No read receipts.

## Can I resend after a timeout?

Do not blindly resend. Timeouts or `interrupted` may mean the outcome is unknown — the message may already be sent. Check the `log_id` and logs first. Another POST is a new send and may duplicate.

## Can I send custom HTML or attachments?

Email can: with `type="email"`, the `html` field sends your HTML as the whole message (no service template), while `body` sends a plaintext notification in the service template. ntfy and group bots accept plaintext `body` only — `html` returns 422 — and preset sending takes `body` only. Attachments are still unsupported. See [Send notifications](./guides/sending.md#content-format).

## How do I set up a group bot?

Create a custom bot in the group settings for WeCom, Feishu, or DingTalk and copy its Webhook URL; for Feishu and DingTalk, also enter the signing secret if signing is enabled. Enter the code received in the group to verify the channel before sending, using presets, or testing. Failed code delivery can be retried from the pending row. Send to the `wb_...` / `fs_...` / `dt_...` target id shown in the list. WeCom allows 20 messages per minute and 2048 bytes per text message; Feishu allows a 20 KB request body and 100 requests per minute; DingTalk allows 20 messages per minute. See [Notification channels](./guides/recipients.md) for verification limits and leaked-Webhook handling.

## Why am I refused while I still have Credits?

Possible causes: reservations, daily attempt limits, minute rate limits, global Credits exhaustion, or dependency failures. Check [current credits](./api/account.md) and the error code. See [Message Credits](./guides/limits.md).

## When does the day reset?

At midnight in `APP_TIMEZONE` (default `Asia/Shanghai`), per `daily_reset_at`. Status queries do not consume Credits.

## Do extra keys increase Credits?

No. Keys share account limits.

## How do I purchase Plus / Premium?

These are reserved plans with no self-service purchase. Available Credits follow the current account response.

## Where can I find logs?

Open the <a href="/app/dashboard" target="_self">console</a>, or use the [Logs API](./api/logs.md). For interactive debugging, open <a href="/api/docs" target="_self">Swagger UI</a>.
