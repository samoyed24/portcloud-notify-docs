# Delivery status

Query delivery results with the `log_id` from acceptance via [Status API](../api/status.md) `GET /api/v1/send/{log_id}`.

For `POST /api/v1/send`, the `log_id` is for the first target. For `POST /api/v1/send-preset`, it represents the whole chain. Other targets' logs are in [Send logs](../api/logs.md).

## Five states

| `status`   | Meaning                                         | Terminal |
| ---------- | ----------------------------------------------- | -------- |
| `queued`   | Accepted, waiting                               | no       |
| `sending`  | Delivery in progress                            | no       |
| `success`  | SMTP or ntfy service accepted                   | yes      |
| `failed`   | Delivery failed or outcome unknown              | yes      |
| `rejected` | Validation, permission, or risk control refused | yes      |

Normal path: `queued → sending → success` or `queued → sending → failed`. Fast deliveries may reach a terminal state before the first query.

## Polling

Query every few seconds; stop at a terminal state. On `429 RATE_LIMITED`, wait per `Retry-After` and re-query the same ID.

## Acceptance is not delivery

`success` means the email SMTP service or ntfy service accepted the notification — not that it reached the inbox or client. Check spam, filters, or the ntfy subscription. No read receipts or open tracking.

## Uncertain outcomes and duplicate risk

`failed` does not always prove the message was not sent. `interrupted`, `smtp_timeout`, `smtp_connection_error` may mean the remote service accepted it but this service did not receive a complete response. A lost POST response carries the same risk.

The service does not retry automatically. Check the `log_id`, logs, and inbox before deciding to resend. Another POST is a new send and may duplicate.

Related: [Message Credits](./limits.md) · [Error reference](../errors.md)
