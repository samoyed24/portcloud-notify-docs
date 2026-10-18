# Plans and Stars

View your tier and rights on the <a href="/app/plans" target="_self">account plans page</a>.

## Available plans

| Plan           | Access                                                                 |
| -------------- | ---------------------------------------------------------------------- |
| Free           | Console access; sending and service features locked                    |
| Supporter      | Sending, channel management, API keys, and test notifications unlocked |
| Plus / Premium | Reserved; no self-service upgrade                                      |

## Upgrade from Free to Supporter

1. Sign in with your Portcloud account (email or GitHub); unlocking Supporter needs a linked GitHub account.
2. Star [portcloud-labs/portcloud](https://github.com/portcloud-labs/portcloud).
3. Click "Re-check" on the plans page to confirm.

Promotion is monotonic — removing a Star does not downgrade to Free.

## Removing a Star

After removal, new sends may be refused (`403 STAR_REQUIRED`) and restrictions increase over time. Restore the Star and re-check to resume. If the console asks you to sign in again (expired GitHub token), re-authenticate first and then re-check; retrying alone will not recover and burns the hourly recheck allowance. Accepted jobs are not affected.

## Recheck limits

Manual "Re-check" is limited to 6 requests per account per hour; exceeding returns `429 RATE_LIMITED` (`Retry-After: 3600`). When GitHub is unavailable, the last confirmed state is retained.

Related: [Quick start](../quickstart.md) · [Message Credits](./limits.md) · [Error reference](../errors.md)
