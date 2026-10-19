# Error reference

The public API uses real HTTP status codes. Successful submission returns `201`. A query returning `200` means the query worked — still check `status` in the JSON.

## Error responses

```json
{
  "error": {
    "code": "RECIPIENT_NOT_VERIFIED",
    "message": "Recipient is not in your verified list.",
    "details": { "reason": "recipient_not_verified" }
  }
}
```

Handle by HTTP status and `error.code`, not by matching `message`.

## Public API errors

| HTTP | `error.code`                       | Meaning                                                                                                                  |
| ---- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| 400  | `RECIPIENT_NOT_VERIFIED`           | Email `to` is not verified                                                                                               |
| 400  | `INVALID_RECIPIENT_FORMAT`         | Email `to` has invalid format (the public API returns `422 VALIDATION_ERROR` when schema validation rejects the address) |
| 400  | `NO_DEFAULT_CHANNEL`               | `to` omitted with no matching default                                                                                    |
| 400  | `NO_PRESET`                        | No preset configured                                                                                                     |
| 400  | `CHANNEL_UNVERIFIED`               | Email or group bot in the requested target, defaults, or preset is unverified                                            |
| 400  | `CHANNEL_TYPE_DISABLED`            | Channel type disabled by the administrator (its price is 0)                                                              |
| 401  | `UNAUTHENTICATED`                  | No API key provided                                                                                                      |
| 401  | `INVALID_API_KEY`                  | Key invalid or revoked                                                                                                   |
| 401  | `API_KEY_EXPIRED`                  | Key expired                                                                                                              |
| 403  | `STAR_REQUIRED`                    | Not unlocked or Star removed                                                                                             |
| 403  | `USER_DISABLED`                    | Account disabled                                                                                                         |
| 404  | `NOT_FOUND`                        | ntfy topic or bot target is not owned by the account, or channel/`log_id` does not exist                                 |
| 413  | `PAYLOAD_TOO_LARGE`                | Body or message too large                                                                                                |
| 422  | `VALIDATION_ERROR`                 | Field, type, or constraint error                                                                                         |
| 429  | `RATE_LIMITED`                     | Send or read rate limit                                                                                                  |
| 429  | `MESSAGE_CREDITS_EXHAUSTED`        | Personal Credits insufficient                                                                                            |
| 429  | `DAILY_ATTEMPT_LIMIT_REACHED`      | Daily attempt limit reached                                                                                              |
| 503  | `GLOBAL_MESSAGE_CREDITS_EXHAUSTED` | Global Credits exhausted                                                                                                 |
| 503  | `DEPENDENCY_UNAVAILABLE`           | Required service unavailable                                                                                             |
| 500  | `INTERNAL_ERROR`                   | Server-side failure (not a request problem; retry later)                                                                 |

429 responses usually include `Retry-After`. Credits and attempt exhaustion include `details.reset_at`.

## Console errors

| HTTP | `error.code`                | Scenario                                                              |
| ---- | --------------------------- | --------------------------------------------------------------------- |
| 400  | `VERIFICATION_CODE_INVALID` | Email or bot code is incorrect, expired, or no longer valid           |
| 400  | `CHANNEL_TARGET_INVALID`    | Invalid ntfy topic or bot Webhook/credential format                   |
| 409  | `EMAIL_ALREADY_EXISTS`      | Email already added, including pending verification                   |
| 409  | `EMAIL_LIMIT_REACHED`       | Limit reached for the selected channel type                           |
| 409  | `CHANNEL_ALREADY_EXISTS`    | ntfy topic or group bot already added, including pending verification |
| 409  | `API_KEY_LIMIT_REACHED`     | Key limit reached                                                     |
| 409  | `PRESET_EXISTS`             | Preset already exists                                                 |
| 409  | `GITHUB_NOT_BOUND`          | No GitHub account linked (link one before re-checking)                |
| 423  | `CODE_LOCKED`               | Too many wrong codes                                                  |
| 429  | `VERIFY_CODE_RATE_LIMITED`  | Code cooldown or daily verification allowance exhausted               |

## `failure_reason`

Log failure reasons are lowercase strings:

| Reason                                                        | Meaning                                                                        |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| `invalid_recipient_format`                                    | Invalid email address format                                                   |
| `recipient_not_verified`                                      | Email or group bot unverified, including verification revoked after acceptance |
| `message_credits_exhausted`, `daily_attempt_limit_reached`    | Credits or attempt limit                                                       |
| `channel_type_disabled`                                       | Channel type disabled by the administrator                                     |
| `smtp_timeout`, `smtp_connection_error`, `smtp_unknown_error` | SMTP timeout or error; outcome may be unknown                                  |
| `interrupted`                                                 | Processing interrupted; cannot prove not sent                                  |
| `channel_unreachable`                                         | ntfy or bot network/timeout failure                                            |
| `channel_delivery_error`                                      | ntfy or bot rejected delivery, or target/credentials became invalid            |

Related: [Delivery status](./guides/status.md) · [Message Credits](./guides/limits.md)
