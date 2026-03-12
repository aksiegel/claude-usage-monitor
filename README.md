# Claude Usage Monitor

Two Chrome extensions that display your [Claude.ai](https://claude.ai) usage limits directly in the browser toolbar — one for the **5-hour session limit**, one for the **7-day weekly limit**.

![Chrome Extensions showing usage badges](https://img.shields.io/badge/Chrome-Extension-blue?logo=googlechrome) ![License: MIT](https://img.shields.io/badge/License-MIT-green)

---

## Features

- 🔵 **Session Extension** — shows your current 5-hour session usage as a badge
- 🟣 **Weekly Extension** — shows your 7-day rolling usage as a badge
- 🟢 Green below 80% · 🟡 Yellow from 80% · 🔴 Red from 90%
- Refreshes automatically every **5 minutes**
- Click the icon for a detailed popup with both limits and reset times
- No data leaves your browser — everything stays local

---

## Installation

> **No Chrome Web Store** — install manually as an unpacked extension.

1. Download or clone this repository
2. Open Chrome and go to `chrome://extensions/`
3. Enable **Developer mode** (top right toggle)
4. Click **"Load unpacked"**
5. Select the `claude-session-extension` folder → confirms the session extension
6. Repeat step 4–5 for `claude-weekly-extension`
7. Pin both extensions via the 🧩 puzzle icon in the toolbar

---

## How it works

The extensions read your `lastActiveOrg` cookie from `claude.ai` to dynamically determine your organization ID, then call the internal (unofficial) API endpoint:

```
GET https://claude.ai/api/organizations/{orgId}/usage
```

This returns JSON with `five_hour` and `seven_day` utilization percentages, which are displayed as badges.

---

## ⚠️ Disclaimer

> This extension uses an **unofficial, undocumented internal API** of Claude.ai.  
> Anthropic may change or remove this API at any time without notice, which would break the extension.  
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

---

## Contributing

Pull requests welcome! If the API changes and you figure out the new endpoint, feel free to open a PR.

---

## License

[MIT](LICENSE)
