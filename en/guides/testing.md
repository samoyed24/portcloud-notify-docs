# Test notifications

The console <a href="/app/test-notification" target="_self">Test notification</a> page offers two modes. Tests share the same Credits and attempt budget as real sends.

## By channel

Select email, ntfy, or a group bot, an API key, and a destination, then enter title and body. Email sends to a verified address; ntfy sends to the selected channel's full topic; group bots list only verified channels and send to the selected `wb_...` / `fs_...` / `dt_...` target.

## By preset

Go to <a href="/app/test-notification/preset" target="_self">preset test</a>, select a key, enter title and body, and send down the current preset chain. The chain is read-only; edit it on the <a href="/app/presets" target="_self">Sending presets</a> page. Controls are disabled when no preset is set.

## Generate test code

Both pages offer "Generate test code," which fills in the selected key's plaintext. Generation does not send or charge Credits. Check and replace real key values before sharing.

Related: [Sending presets](./presets.md) · [Send notifications](./sending.md) · [Delivery status](./status.md)
