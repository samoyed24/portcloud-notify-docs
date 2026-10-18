# Send notifications

The [Send API](../api/send.md) provides `POST /api/v1/send` and [`POST /api/v1/send-preset`](../api/send-preset.md), both using API key Bearer authentication. Preset sending is covered in [Sending presets](./presets.md).

## Request fields

| Field   | Required   | Rules                                                                   |
| ------- | ---------- | ----------------------------------------------------------------------- |
| `type`  | yes        | `"email"`, `"ntfy"`, `"wecom_bot"`, `"feishu_bot"`, or `"dingtalk_bot"` |
| `to`    | no         | Must be an added channel; omit to use default channels                  |
| `title` | yes        | 1–200 characters, no line breaks                                        |
| `body`  | one of two | Nonempty plaintext, up to 1,048,576 characters                          |
| `html`  | one of two | Nonempty custom HTML, up to 1,048,576 characters; `email` only          |

Only these fields are accepted; unknown fields return `422 VALIDATION_ERROR`. Legacy `subject` and `text` are rejected.

Supply exactly one of `body` or `html`: both or neither returns 422. `html` with ntfy or any group bot (`wecom_bot`, `feishu_bot`, `dingtalk_bot`) also returns 422.

## Selecting a target

- **Provide `to`**: deliver only to that target. `type="email"` takes a verified address; `type="ntfy"` takes the full topic from the channel list. Group bots take the target id from the channel list: WeCom `wb_...`, Feishu `fs_...`, DingTalk `dt_...`. The target must be one of the account's own channels.
- **Omit `to`**: deliver saved defaults matching `type`, in saved order. No match returns `400 NO_DEFAULT_CHANNEL`. The console no longer configures defaults; new users should provide `to`.

No recipient arrays, CC, or BCC.

## Content format

- `body`: plaintext — Unicode and newlines are preserved, HTML is not parsed. Email uses the service-owned template (`multipart/alternative`: plaintext plus template HTML); ntfy and group bots receive the original plaintext.
- `html`: `type="email"` only. Your HTML is the whole message — no service template, no escaping, no plaintext fallback. You own the content, links, and styling.

Preset sending ([Sending presets](./presets.md)) accepts `title` and plaintext `body` only, never `html`. Attachments and custom senders remain unsupported.

## Size limits

The byte limit is reported by [Account API](../api/account.md) `max_message_size_bytes`. For any email target (including email nodes in a preset chain), the service checks the fully rendered MIME size (custom HTML counts as the whole HTML message); a plain ntfy send only checks the UTF-8 body bytes. Group bots join `title` + a blank line + `body`: WeCom is limited to **2048 UTF-8 bytes**; Feishu and DingTalk are checked against a **18 KiB** product threshold before admission, and Feishu additionally verifies that the whole JSON request body stays within the official **20 KB** limit at delivery. Oversized messages fail explicitly before admission or during delivery. Multibyte characters and MIME encoding add size. The HTTP body has a separate 2 MiB cap.

## Examples

Email (plaintext, service template):

```json
{ "type": "email", "to": "you@example.com", "title": "Deploy done", "body": "Service deployed." }
```

Email (custom HTML, sent as-is):

```json
{
  "type": "email",
  "to": "you@example.com",
  "title": "Deploy done",
  "html": "<h1>Deploy done</h1><p>Service is live.</p>"
}
```

ntfy (`to` is the full topic from the channel list):

```json
{ "type": "ntfy", "to": "a1b2c3d4e5f6-alerts", "title": "Deploy done", "body": "Service deployed." }
```

WeCom (`to` is the `wb_...` target id from the channel list):

```json
{
  "type": "wecom_bot",
  "to": "wb_3f8a1b2c9d0e",
  "title": "Deploy done",
  "body": "Service deployed."
}
```

Feishu (`to` is the `fs_...` target id):

```json
{
  "type": "feishu_bot",
  "to": "fs_3f8a1b2c9d0e",
  "title": "Deploy done",
  "body": "Service deployed."
}
```

DingTalk (`to` is the `dt_...` target id):

```json
{
  "type": "dingtalk_bot",
  "to": "dt_3f8a1b2c9d0e",
  "title": "Deploy done",
  "body": "Service deployed."
}
```

Group bot messages join `title`, a blank line, and `body`; without a title only `body` is sent.

## Acceptance and delivery

A successful response returns **201** with `{"log_id":123,"status":"queued"}`. The `log_id` is for the first target; query it with [Status API](../api/status.md). Other targets' logs are in [Send logs](../api/logs.md). Accepted sends are not retried; another POST is a new send.

Related: [Sending presets](./presets.md) · [Delivery status](./status.md) · [Message Credits](./limits.md) · [Error reference](../errors.md)
