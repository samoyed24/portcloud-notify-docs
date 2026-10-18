# API keys

Public API operations use Bearer API key authentication:

```http
Authorization: Bearer <API_KEY>
```

Use the full key, not its name or prefix. A key represents its account and shares that account's send and read limits. Creating more keys does not increase Credits.

## Create

Create a key in "API Keys" in the <a href="/app/dashboard" target="_self">console</a>. Supporter or higher is required. Expiration options: 30, 60, 90, 180, 365 days, or never (default).

## View and store

Creation shows the full key. The list shows name, prefix, and expiration only. The console's "View" action retrieves the full value again.

Store keys in server-side environment variables or a secret manager — never in frontend code, public repos, or screenshots. If leaked, delete and replace immediately.

## Delete and rotate

Deletion revokes the key for new requests. It does not erase existing send logs. To rotate: create a new key, switch calls, then delete the old one (if you are at the key limit, delete an unused key first or ask an administrator to raise the limit).

Expired-but-not-revoked keys return `401` and still occupy a slot until deleted. A revoked key releases its slot immediately and disappears from the list — no extra delete needed.

Related: [Quick start](../quickstart.md) · [Message Credits](./limits.md) · [Error reference](../errors.md)
