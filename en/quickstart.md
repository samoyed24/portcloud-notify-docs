# Quick start

## 1. Sign in and unlock

Open the <a href="/app/dashboard" target="_self">console</a> and sign in with your Portcloud account (email or GitHub). New accounts are Free and must unlock before sending.

Follow the <a href="/app/plans" target="_self">account plans page</a> to Star [portcloud-labs/portcloud](https://github.com/portcloud-labs/portcloud), then click "Re-check." Access unlocks as Supporter. See [Plans and Stars](./guides/plans.md).

## 2. Set up a channel

Open <a href="/app/channels" target="_self">Notification channels</a> and add email, ntfy, or a group bot:

- **Email**: enter an address, receive a 6-digit code, enter it within 15 minutes.
- **ntfy**: enter a topic (e.g. `alerts`, 1–40 letters / digits / `_` / `-`). After adding, copy the full topic from the list and subscribe to it on the administrator's ntfy server. The full topic is a secret — do not share it.
- **WeCom**: in an internal group chat, click `[...]` → `Message Push` (or "Group Robot") → `Add`, then paste the Webhook URL into the console. Enter the code sent to the group and send to the `wb_...` target id.
- **Feishu / DingTalk**: create a custom bot in the group settings and copy its Webhook URL; enter the signing secret too if signing is enabled. Enter the code sent to the group and send to the `fs_...` / `dt_...` target id. See [Notification channels](./guides/recipients.md#add-feishu).

## 3. Create an API key

Create a key in "API Keys," choose an expiration, and save the full value. See [API keys](./guides/api-keys.md).

## 4. Send your first notification

Replace `BASE_URL` with your site address:

```bash
export BASE_URL='https://notify.portcloud.online'
read -r -s -p 'API Key: ' PORTCLOUD_NOTIFY_API_KEY
export PORTCLOUD_NOTIFY_API_KEY

curl -i "$BASE_URL/api/v1/send" \
  -H "Authorization: Bearer $PORTCLOUD_NOTIFY_API_KEY" \
  -H 'Content-Type: application/json' \
  --data '{"type":"email","to":"you@example.com","title":"Hello","body":"Test notification."}'
```

A successful response returns **HTTP 201** with `{"log_id": 123, "status": "queued"}`. `type` is required (`email`, `ntfy`, `wecom_bot`, `feishu_bot`, or `dingtalk_bot`); `to` names an added channel. See [Send notifications](./guides/sending.md).

## 5. Check the result

```bash
curl -i "$BASE_URL/api/v1/send/123" \
  -H "Authorization: Bearer $PORTCLOUD_NOTIFY_API_KEY"
```

`queued` / `sending` are intermediate; check again after a few seconds. `success` / `failed` / `rejected` are terminal. See [Delivery status](./guides/status.md).

Run `unset PORTCLOUD_NOTIFY_API_KEY` when done. You can also test from the <a href="/app/test-notification" target="_self">console</a>; see [Test notifications](./guides/testing.md).

Next: [Send notifications](./guides/sending.md) · [Message Credits](./guides/limits.md) · [Send API](./api/send.md)
