const FETCH_INTERVAL_MINUTES = 5;
const BADGE_TYPE = 'weekly';

async function getOrgId() {
  const cookie = await chrome.cookies.get({ url: 'https://claude.ai', name: 'lastActiveOrg' });
  if (!cookie) throw new Error('lastActiveOrg Cookie nicht gefunden – bist du bei claude.ai eingeloggt?');
  return cookie.value;
}

async function fetchUsageData() {
  try {
    const orgId = await getOrgId();
    const response = await fetch(`https://claude.ai/api/organizations/${orgId}/usage`, {
      credentials: 'include',
      headers: { 'Accept': 'application/json', 'Cache-Control': 'no-cache' }
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const json = await response.json();
    const data = parseUsageData(json);
    await chrome.storage.local.set({ usageData: data, lastUpdated: Date.now(), error: null });
    updateBadge(data);
  } catch (err) {
    console.error('Claude Usage: Fehler:', err);
    await chrome.storage.local.set({ error: err.message });
    chrome.action.setBadgeText({ text: '?' });
    chrome.action.setBadgeBackgroundColor({ color: '#6b7280' });
  }
}

function formatResetTime(isoString) {
  if (!isoString) return null;
  const date = new Date(isoString);
  const diffMs = date - new Date();
  if (diffMs <= 0) return 'Läuft gleich ab';
  const diffH = Math.floor(diffMs / 3600000);
  const diffM = Math.floor((diffMs % 3600000) / 60000);
  if (diffH > 24) return 'Zurücksetzung ' + date.toLocaleDateString('de-DE', { weekday: 'short' }) + ', ' + date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  if (diffH > 0) return `Zurücksetzung in ${diffH} Std. ${diffM} Min.`;
  return `Zurücksetzung in ${diffM} Min.`;
}

function formatCredits(cents) {
  if (cents === null || cents === undefined) return null;
  return (cents / 100).toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
}

function parseUsageData(json) {
  const extra = json.extra_usage;
  return {
    session: {
      percent: json.five_hour?.utilization ?? null,
      resetText: formatResetTime(json.five_hour?.resets_at)
    },
    weekly: {
      percent: json.seven_day?.utilization ?? null,
      resetText: formatResetTime(json.seven_day?.resets_at)
    },
    extra: {
      enabled: extra?.is_enabled ?? false,
      percent: extra?.utilization ?? null,
      used: formatCredits(extra?.used_credits),
      limit: formatCredits(extra?.monthly_limit),
      resetText: 'Monatliches Limit'
    }
  };
}

function getBadgeColor(pct) {
  if (pct >= 90) return '#ef4444';
  if (pct >= 80) return '#eab308';
  return '#22c55e';
}

function updateBadge(data) {
  if (BADGE_TYPE === 'extra') {
    if (!data.extra.enabled) {
      chrome.action.setBadgeText({ text: 'OFF' });
      chrome.action.setBadgeBackgroundColor({ color: '#6b7280' });
      return;
    }
    const pct = data.extra.percent ?? 0;
    chrome.action.setBadgeText({ text: pct >= 1 ? `${Math.round(pct)}%` : '<1%' });
    chrome.action.setBadgeBackgroundColor({ color: getBadgeColor(pct) });
    return;
  }
  const pct = data[BADGE_TYPE].percent ?? 0;
  chrome.action.setBadgeText({ text: pct >= 1 ? `${Math.round(pct)}%` : '<1%' });
  chrome.action.setBadgeBackgroundColor({ color: getBadgeColor(pct) });
}

chrome.alarms.create('fetchUsage', { delayInMinutes: 0, periodInMinutes: FETCH_INTERVAL_MINUTES });
chrome.alarms.onAlarm.addListener((alarm) => { if (alarm.name === 'fetchUsage') fetchUsageData(); });
fetchUsageData();
