# Claude Usage Monitor

Three Chrome extensions that display your [Claude.ai](https://claude.ai) usage limits directly in the browser toolbar — for the **5-hour session limit**, the **7-day weekly limit**, and the **additional monthly usage**.

![Chrome Extensions showing usage badges](https://img.shields.io/badge/Chrome-Extension-blue?logo=googlechrome) ![License: MIT](https://img.shields.io/badge/License-MIT-green)

Repo: [https://github.com/aksiegel/claude-usage-monitor](https://github.com/aksiegel/claude-usage-monitor)

---

## Features

- 🔵 **Session Extension** — shows your current 5-hour session usage as a badge
- 🟣 **Weekly Extension** — shows your 7-day rolling usage as a badge
- 🟢 **Extra Extension** — shows your additional monthly usage as a badge (incl. euro amount)
- 🟢 Green below 80% · 🟡 Yellow from 80% · 🔴 Red from 90%
- Refreshes automatically every **5 minutes**
- Click any icon for a detailed popup showing **all three limits** with reset times
- No data leaves your browser — everything stays local

---

## Installation

> **No Chrome Web Store** — install manually as unpacked extensions.

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (top right toggle)
4. Click **"Load unpacked"** and select the `claude-session-extension` folder
5. Repeat for `claude-weekly-extension`
6. Repeat for `claude-extra-extension`
7. Pin all extensions via the 🧩 puzzle icon in the toolbar

---

## How it works

The extensions read your `lastActiveOrg` cookie from `claude.ai` to dynamically determine your organization ID, then call the internal (unofficial) API endpoint:

```
GET https://claude.ai/api/organizations/{orgId}/usage
```

This returns JSON with utilization data for all three limit types:

```json
{
  "five_hour":   { "utilization": 2.0,  "resets_at": "..." },
  "seven_day":   { "utilization": 37.0, "resets_at": "..." },
  "extra_usage": { "is_enabled": true, "utilization": 1.6, "used_credits": 32, "monthly_limit": 2000 }
}
```

Each extension displays its own value as a badge. The popup (click the icon) always shows all three limits at once, including the euro amount for extra usage (`used_credits` and `monthly_limit` are in euro cents).

---

## ⚠️ Disclaimer

> This extension uses an **unofficial, undocumented internal API** of Claude.ai.  
> Anthropic may change or remove this API at any time without notice, which would break the extensions.  
> This project is not affiliated with or endorsed by Anthropic.

---

## Privacy

- No data is sent to any external server
- Your session cookies are only used locally to authenticate against `claude.ai`
- No tracking, no analytics

---

## Requirements

- Google Chrome (or any Chromium-based browser)
- An active [Claude.ai](https://claude.ai) account
- For the Extra Extension: additional usage must be enabled in your Claude account settings

---

## Contributing

Pull requests welcome! If the API changes and you figure out the new endpoint, feel free to open a PR.

---

## License

[MIT](LICENSE)
