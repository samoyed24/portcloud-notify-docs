# Notification channels

Manage email, ntfy, WeCom, Feishu, and DingTalk on <a href="/app/channels" target="_self">Notification channels</a>. Supporter or higher access is required; see [Plans and Stars](./plans.md).

## Add email

1. Select Email, click "Add Email," enter an address, optionally add a label.
2. Enter the code before the expiry shown in the email (default: 6 digits, 15 minutes).
3. The channel shows verified when ready.

Closing the code dialog does not delete the channel; enter the code while it is valid. Resending replaces the old code — use the latest one. Check spam if not received; wait for the resend countdown before retrying.

## Add ntfy

1. Select ntfy, click "Add ntfy," enter a topic (e.g. `alerts`, 1–40 letters / digits / `_` / `-`, not a URL).
2. Adding takes effect immediately — no verification. Copy the full topic from the list (e.g. `ab12cd34ef56-alerts`).
3. Get the ntfy server address from the administrator and subscribe to the full topic.

The full topic is a secret: anyone who knows it can subscribe. Do not share it. The list masks it by default; use the reveal and copy buttons. An invalid topic returns `400 CHANNEL_TARGET_INVALID`.

## Add WeCom

1. In a WeCom **internal group chat**, click `[...]` → `Message Push` (called "Group Robot" in older versions) → `Add` to create a robot.
2. Open the robot details and copy the **Webhook URL**, e.g. `https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=<UUID>`.
3. In the console, select WeCom → "Add WeCom", paste the full Webhook URL or its UUID key, and optionally add a label.
4. Adding the channel automatically attempts to send its first six-digit code. Read it in the group and confirm in the console.
5. The list shows a `wb_` target id and masked key. See [Group bot verification](#group-bot-verification) for expiry, resends, and limits.

Send with the `wb_...` target id from the list, not the Webhook URL. The raw key is stored encrypted and never returned by the API or logs.

Limits and caveats:

- Internal groups only; groups containing external contacts cannot add a robot.
- If the group is muted for all members, robot messages may not be delivered; ask the group owner to unmute.
- Each robot can send at most **20 messages per minute**; exceeding it returns upstream `45009`.
- Plain text (title + blank line + body) is limited to **2048 UTF-8 bytes**; longer messages are rejected before admission.
- If the robot is removed from the group or the Webhook becomes invalid, upstream returns `93000`; add it again and update the channel.
- Group robots do not support `@` mentions; this service sends plain text only.

## Add Feishu

1. In a Feishu group, open Settings → Bots → Add Bot → Custom Bot, create the bot, and copy its Webhook URL (`https://open.feishu.cn/open-apis/bot/v2/hook/...`). International Lark uses `open.larksuite.com` with the same protocol.
2. In the console, select Feishu → "Add Feishu" and paste the full Webhook URL. If the bot enables signature verification in its security settings, also enter the signing secret; otherwise leave it empty.
3. Adding the channel automatically attempts its first six-digit code. Confirm it in the console; see [Group bot verification](#group-bot-verification).
4. Send with the `fs_...` target id from the list. The Webhook and signing secret are stored encrypted; the API only returns masked values.

A Feishu custom bot can only push to its own group, not direct messages. Official limits: the whole request body is at most **20 KB**, and one bot may send **100 requests per minute and 5 per second**. Rate limiting or system pressure may return `11232`. If keyword or IP allowlist security is enabled, the message content or the service's egress address must satisfy it; otherwise upstream returns `19024` / `19022`. Success requires response `code == 0`.

## Add DingTalk

1. In a DingTalk group, open Settings → Robots → Add Robot → Custom Robot, create the bot, and copy its Webhook URL (`https://oapi.dingtalk.com/robot/send?access_token=...`). The international host is `oapi.dingtalk.io`.
2. In the console, select DingTalk → "Add DingTalk" and paste the full Webhook URL or just the `access_token`. We recommend enabling signing in the robot security settings and entering the `SEC...` secret.
3. Adding the channel automatically attempts its first six-digit code. Confirm it in the console; see [Group bot verification](#group-bot-verification).
4. Send with the `dt_...` target id from the list. The access token and signing secret are stored encrypted; the API only returns masked values.

A DingTalk custom bot supports group chat only — no direct messages, read receipts, or recall. Official limits: **20 messages per minute per robot**; exceeding it throttles the bot for 10 minutes (`410100`). Success requires response `errcode == 0`. If you use keyword or IP allowlist security instead of signing, the message content or the service's egress address must satisfy it; otherwise even the verification code may be rejected upstream.

## Group bot verification

WeCom, Feishu, and DingTalk channels start unverified. Confirm ownership before sending, using a preset, or testing. Codes default to 15 minutes, allow at most 5 incorrect attempts, and are consumed on success. The group message and console show the actual expiry.

If code delivery fails, the pending channel remains and occupies a slot for its type. Choose **Verify** on the row to resend manually. There are no automatic retries.

Each bot type has a separate budget. Defaults per type are **5 requests per account per day**, plus a global limit per Webhook across accounts and channel IDs of **1 request per 60 seconds and 5 per day**. Days reset in the service timezone. Failed deliveries and timeouts consume allowance without refunds; Redis failures reject issuance. Codes do not consume Message Credits. Notifications and tests use [normal sending limits](./limits.md).

Code messages use a fixed system template without user labels, content, links, or `@` mentions. If a real Webhook leaks, recreate the bot or replace its Webhook on the relevant platform. Verification here cannot prevent direct calls.

## Channel limits and deletion

Email, ntfy, WeCom, Feishu, and DingTalk have independent limits (default 3 each). Email counts only verified addresses; every other type counts all channels, including pending ones. Delete unused channels to free slots.

Deleting a channel does not recall accepted notifications.

## Check addresses from your application

`GET /api/v1/emails` returns the account's verified email array, requiring an API key. Read-only; use the console to add or delete. See [Recipients API](../api/recipients.md).

Related: [Sending presets](./presets.md) · [Send notifications](./sending.md) · [Error reference](../errors.md)
