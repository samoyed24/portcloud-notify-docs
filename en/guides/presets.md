# Sending presets

A sending preset is an ordered delivery chain: nodes are tried in sequence, the first success stops the chain, and only a known failure advances to the next node. Each account can save at most one preset.

## Create a preset

On the <a href="/app/presets" target="_self">Sending presets</a> page, click "Create preset":

1. Click the dashed box to add a node — select email, ntfy, WeCom, Feishu, or DingTalk, then a specific channel.
2. A chain has 1–3 nodes; types may be mixed. Email and group bot nodes must be verified.
3. Nodes support click-to-edit, delete, and left/right reordering.
4. Save to display the visual chain.

With an existing preset, the action becomes "Edit," with a separate "Delete."

## Send with a preset

```bash
curl -i "$BASE_URL/api/v1/send-preset" \
  -H "Authorization: Bearer $PORTCLOUD_NOTIFY_API_KEY" \
  -H 'Content-Type: application/json' \
  --data '{"title":"Deploy done","body":"The service is deployed."}'
```

The body is only `title` and `body`, with no preset ID. Returns `400 NO_PRESET` when none is configured.

Acceptance returns a single `log_id` for the whole chain. Poll [delivery status](../api/status.md) for the terminal result. The chain receives the same title and plaintext body.

## Credits

Admission reserves the most expensive node (default email 10, every other channel 5 — read `credits_per_target` for the current prices); success settles the actually delivered node and refunds the difference; exhausting known failures releases the whole reservation. A chain containing a disabled type (price 0) is rejected as a whole with `400 CHANNEL_TYPE_DISABLED`. See [Message Credits](./limits.md).

Related: [Notification channels](./recipients.md) · [Send notifications](./sending.md) · [Test notifications](./testing.md)
