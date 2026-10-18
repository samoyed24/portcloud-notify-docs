# Portcloud Notify documentation

Portcloud Notify provides hosted notifications: set up email / ntfy / WeCom / Feishu / DingTalk channels and a send preset in the console, create an API key, then submit notifications and query status over HTTP.

## Start here

- [Quick start](./quickstart.md): sign in, set up channels, create a key, send and query.
- [Notification channels](./guides/recipients.md): add email / ntfy / WeCom / Feishu / DingTalk channels.
- [Sending presets](./guides/presets.md): configure an ordered delivery chain.
- [API keys](./guides/api-keys.md): create, view, rotate.
- [Send notifications](./guides/sending.md): request fields, targets, size limits.
- [Test notifications](./guides/testing.md): test by channel or by preset in the console.
- [Delivery status](./guides/status.md): polling and interpreting results.
- [Message Credits and rate limits](./guides/limits.md): daily budget, reservations, limits.
- [Plans and Stars](./guides/plans.md): Free, Supporter, and reserved plans.
- [Error reference](./errors.md) · [FAQ](./faq.md)

## Public API reference

| Operation                    | Reference                                       |
| ---------------------------- | ----------------------------------------------- |
| `POST /api/v1/send`          | [Send a notification](./api/send.md)            |
| `POST /api/v1/send-preset`   | [Send with a preset](./api/send-preset.md)      |
| `GET /api/v1/send/{log_id}`  | [Delivery status](./api/status.md)              |
| `GET /api/v1/me`             | [Account and Message Credits](./api/account.md) |
| `GET /api/v1/emails`         | [Verified recipients](./api/recipients.md)      |
| `GET /api/v1/logs`           | [Send logs](./api/logs.md)                      |
| `GET /api/v1/stats/overview` | [Statistics](./api/stats.md)                    |

The API reference is generated from the backend OpenAPI contract. All public operations use `Authorization: Bearer <API_KEY>`. Channel, preset, and key management is done in the console.

## Console

<a href="/app/dashboard" target="_self">Dashboard</a> for Message Credits, status and statistics; <a href="/app/channels" target="_self">Notification channels</a> to configure email / ntfy / WeCom / Feishu / DingTalk; <a href="/app/presets" target="_self">Sending presets</a> to configure the delivery chain; <a href="/app/plans" target="_self">Account plans</a> for permissions and Star.
