function colorClass(pct, type) {
  if (pct >= 90) return type === 'fill' ? 'fill-red' : 'red';
  if (pct >= 80) return type === 'fill' ? 'fill-yellow' : 'yellow';
  return type === 'fill' ? 'fill-green' : 'green';
}

function formatTimeAgo(ts) {
  if (!ts) return 'Nie aktualisiert';
  const diff = Math.floor((Date.now() - ts) / 1000);
  if (diff < 60) return `Vor ${diff} Sek. aktualisiert`;
  if (diff < 3600) return `Vor ${Math.floor(diff / 60)} Min. aktualisiert`;
  return `Vor ${Math.floor(diff / 3600)} Std. aktualisiert`;
}

function card(title, percent, resetText) {
  const pct = percent ?? 0;
  const display = pct >= 1 ? `${Math.round(pct)}%` : '<1%';
  return `
    <div class="usage-card">
      <div class="card-header">
        <span class="card-title">${title}</span>
        <span class="card-percent ${colorClass(pct, 'text')}">${display}</span>
      </div>
      <div class="progress-wrap">
        <div class="progress-fill ${colorClass(pct, 'fill')}" style="width:${Math.min(pct,100)}%"></div>
      </div>
      ${resetText ? `<div class="reset-text">${resetText}</div>` : ''}
    </div>`;
}

async function render() {
  const { usageData, lastUpdated, error } = await chrome.storage.local.get(['usageData', 'lastUpdated', 'error']);
  document.getElementById('lastUpdated').textContent = formatTimeAgo(lastUpdated);
  const content = document.getElementById('content');
  if (error && !usageData) {
    content.innerHTML = `<div class="error-box"><strong>Fehler:</strong> ${error}</div>`;
    return;
  }
  if (!usageData) {
    content.innerHTML = `<div class="usage-card"><div style="color:#475569;font-size:12px;text-align:center;padding:8px">Lade...</div></div>`;
    return;
  }
  content.innerHTML =
    card('Aktuelle Sitzung (5h)', usageData.session.percent, usageData.session.resetText) +
    card('Wöchentlich (7 Tage)', usageData.weekly.percent, usageData.weekly.resetText);
}

document.getElementById('refreshBtn').addEventListener('click', async () => {
  const btn = document.getElementById('refreshBtn');
  btn.textContent = '...';
  btn.disabled = true;
  await chrome.alarms.create('fetchUsage', { delayInMinutes: 0 });
  setTimeout(async () => { await render(); btn.textContent = '↻ Refresh'; btn.disabled = false; }, 2000);
});

render();
setInterval(render, 10000);
