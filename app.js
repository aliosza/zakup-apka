'use strict';
const $ = s => document.querySelector(s), col = new Intl.Collator('pl', { sensitivity: 'base' });
const uid = () => crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const vibrate = () => { if (navigator.vibrate) navigator.vibrate(15); };
const ICONS = { cart: '<path d="M3 4h2l2.4 11h10.2l2-8H6.2"/><circle cx="9" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/>', leaf: '<path d="M5 19c0-9 6-14 14-14 0 9-5 14-14 14zM5 19l8-8"/>', bottle: '<path d="M9 3h6v3l1.5 2v11a2 2 0 01-2 2h-5a2 2 0 01-2-2V8L9 6zM8 12h8"/>',
  yarn: '<circle cx="12" cy="12" r="8"/><path d="M5 9c5 2 9 2 14 0M5 15c5-2 9-2 14 0M12 4c-3 5-3 11 0 16"/>', pencil: '<path d="M4 20l1-4L16 5l3 3L8 19zM14 7l3 3"/>', bag: '<path d="M6 8h12l1 12H5zM9 8a3 3 0 016 0"/>',
  heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z"/>', home: '<path d="M4 11l8-7 8 7M6 10v10h12V10"/>', gift: '<path d="M4 11h16v9H4zM3 8h18v3H3zM12 8v12M12 8c-3 0-4-4-1-4 2 0 1 4 1 4zM12 8c3 0 4-4 1-4-2 0-1 4-1 4z"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>', basket: '<path d="M3 10h18l-2 10H5zM8 10l3-6M16 10l-3-6"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>', check: '<path d="M5 12.5l4.5 4.5L19 7"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>', plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>', sliders: '<path d="M4 7h8M18 7h2M4 17h2M12 17h8"/><circle cx="15" cy="7" r="2.2"/><circle cx="9" cy="17" r="2.2"/>',
  flame: '<path d="M12 2c0 3-2 5-2 8 0 3.3 2.7 6 6 6 3.3 0 6-2.7 6-6 0-3-2-5-2-8 0 0-1 2-2 3-1-3-3-5-6-3z"/>', calendar: '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>',
  search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>' };
const ICONL = { leaf: 'Liść', bottle: 'Butelka', yarn: 'Włóczka', pencil: 'Ołówek', bag: 'Torba', basket: 'Koszyk', heart: 'Serce', home: 'Dom', gift: 'Prezent', star: 'Gwiazdka' }, ICON_KEYS = Object.keys(ICONL);
const ic = (n, s = 22) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ICONS.bag}</svg>`;
const onC = hex => { const m = /^#?([0-9a-f]{6})$/i.exec(hex || ''); if (!m) return '#2E2A47'; const n = parseInt(m[1], 16), r = (n >> 16) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255,
  mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2; if (l < 0.6) return '#fff';
  const d = mx - mn, s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1)); let h = d === 0 ? 0 : mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h = Math.round(((h * 60) + 360) % 360);
  return `hsl(${h} ${Math.round(Math.min(55, s * 90))}% 26%)`; };
const FC = { buy: '#FFCFAE', bought: '#B5EAD7', na: '#FFB5CC', all: '#D4C1FF' };
const OLDC = { '#2f7d4f': '#B5EAD7', '#2b6cb0': '#B7DEF8', '#a0306b': '#D4C1FF', '#b45309': '#FFCFAE', '#5C3A21': '#FFB5CC' }, EMO = { '🥬': 'leaf', '🧴': 'bottle', '🧶': 'yarn', '✏️': 'pencil', '🛍️': 'bag' };

function mig(s) { 
  s.types.forEach(t => { t.color = OLDC[t.color] || t.color; t.icon = EMO[t.icon] || (ICONS[t.icon] ? t.icon : 'bag'); }); 
  const hobby = s.types.find(t => t.name === 'Hobby i rękodzieło'), pap = s.types.find(t => t.name === 'Papiernicze');
  if (hobby && pap) {
    hobby.name = 'Hobby i papiernicze';
    const existingCats = new Set(hobby.categories.map(c => c.name));
    pap.categories.forEach(c => { if (!existingCats.has(c.name)) hobby.categories.push(c); });
    s.products.forEach(p => { if (p.typeId === pap.id) p.typeId = hobby.id; });
    s.entries.forEach(e => { if (e.typeId === pap.id) e.typeId = hobby.id; });
    s.types = s.types.filter(t => t.id !== pap.id);
  } else if (hobby && !pap && hobby.name === 'Hobby i rękodzieło') {
    hobby.name = 'Hobby i papiernicze';
  }
  if (!s.types.some(t => t.name === 'Inne')) {
    s.types.push(mk('Inne', '#FFCFAE', 'bag', false, ['Ubrania', 'Rzeczy do domu', 'Drobiazgi', 'Różne']));
  }
  s.logs ||= [];
  return s; 
}

const UNITS = ['szt', 'opak.', 'g', 'kg', 'ml', 'l', 'łyżka', 'łyżeczka'], ST = ['buy', 'bought', 'na'], STL = { buy: 'Do kupienia', bought: 'Kupione', na: 'Niedostępne' }, STI = { buy: '', bought: ic('check', 20), na: ic('x', 18) };
const MEALS = ['Śniadanie', 'Drugie śniadanie', 'Obiad', 'Kolacja', 'Przekąski', 'Napoje'];
const mk = (name, color, icon, food, cats) => ({ id: uid(), name, color, icon, food, categories: cats.map(n => ({ id: uid(), name: n })) });
function seed() {
  const s = { v: 1, appMode: 'shopping', types: [
    mk('Spożywcze', '#B5EAD7', 'leaf', true, ['Warzywa', 'Owoce', 'Nabiał i roślinne zamienniki', 'Mięso i ryby', 'Pieczywo', 'Produkty sypkie i kasze', 'Makarony i ryż', 'Konserwy i słoiki', 'Mrożonki', 'Przyprawy i sosy', 'Przekąski i słodycze', 'Napoje', 'Chemia domowa']),
    mk('Drogeria', '#B7DEF8', 'bottle', false, ['Higiena', 'Pielęgnacja twarzy', 'Pielęgnacja ciała', 'Włosy', 'Zdrowie', 'Środki czystości']),
    mk('Hobby i papiernicze', '#D4C1FF', 'yarn', false, ['Włóczki i nici', 'Farby i pędzle', 'Papier i karton', 'Kleje i narzędzia', 'Ozdoby', 'Zeszyty i notesy', 'Długopisy i ołówki', 'Teczki i segregatory', 'Akcesoria biurowe']),
    mk('Inne', '#FFCFAE', 'bag', false, ['Ubrania', 'Rzeczy do domu', 'Drobiazgi', 'Różne'])],
    products: [], entries: [], logs: [], sessions: [], cur: null };
  const ss = { id: uid(), name: 'Zakupy ' + new Date().toLocaleDateString('pl'), created: Date.now(), archived: false }; s.sessions.push(ss); s.cur = ss.id; return s;
}

const DB = { open: () => new Promise((ok, no) => { const r = indexedDB.open('zakupy', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); }),
  async get() { const d = await this.open(); return new Promise((ok, no) => { const r = d.transaction('kv').objectStore('kv').get('state'); r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); }); },
  async put(v) { const d = await this.open(); return new Promise((ok, no) => { const t = d.transaction('kv', 'readwrite'); t.objectStore('kv').put(v, 'state'); t.oncomplete = ok; t.onerror = () => no(t.error); }); } };

let S, appMode = 'shopping', view = 'all', filter = 'buy', shopFilter = 'all', query = '', sortMode = 'alpha', searchActive = false;
let logDate = new Date().toISOString().slice(0, 10);
let lastDeleted = null, toastTimer = null;

async function save() { 
  try { await DB.put(JSON.parse(JSON.stringify(S))); } catch (e) { console.error(e); alert('Nie udało się zapisać danych: ' + e.message); } 
  render(); 
}

const type = id => S.types.find(t => t.id === id), prod = id => S.products.find(p => p.id === id);
const catName = (t, id) => (t?.categories.find(c => c.id === id)?.name) || 'Bez kategorii';

function modal(html) { 
  const m = $('#modal'); 
  if (!m) return; 
  m.innerHTML = html ? `<div class="sheet" id="sh"><div style="position:relative">
    <button class="ib" id="modalCloseX" style="position:absolute;top:0;right:0;width:36px;height:36px;z-index:5;background:transparent" aria-label="Zamknij">${ic('x', 20)}</button>
    <div>${html}</div>
  </div></div>` : ''; 
  
  const sh = $('#sh'); 
  if (sh) {
    sh.onclick = e => { if (e.target === sh) modal(''); };
  }
  const cx = $('#modalCloseX');
  if (cx) {
    cx.onclick = () => { vibrate(); modal(''); };
  }
}

const fmt = n => n == null ? '?' : String(Math.round(n * 100) / 100).replace('.', ',');

function removeEntry(id) {
  if (appMode === 'shopping') {
    const idx = S.entries.findIndex(x => x.id === id);
    if (idx === -1) return;
    lastDeleted = { type: 'entry', item: S.entries[idx], index: idx };
    S.entries.splice(idx, 1);
  } else {
    const idx = S.logs.findIndex(x => x.id === id);
    if (idx === -1) return;
    lastDeleted = { type: 'log', item: S.logs[idx], index: idx };
    S.logs.splice(idx, 1);
  }
  save();
  showToast();
}

function showToast() {
  const toast = $('#toast');
  if (!toast) return;
  toast.style.display = 'flex';
  toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.classList.remove('show'); toast.style.display = 'none'; lastDeleted = null; }, 4000);
}

const undoBtn = $('#undoBtn');
if (undoBtn) {
  undoBtn.onclick = () => {
    if (!lastDeleted) return;
    vibrate();
    if (lastDeleted.type === 'entry') S.entries.splice(lastDeleted.index, 0, lastDeleted.item);
    else S.logs.splice(lastDeleted.index, 0, lastDeleted.item);
    lastDeleted = null;
    const toast = $('#toast');
    if (toast) {
      toast.classList.remove('show');
      toast.style.display = 'none';
    }
    if (toastTimer) clearTimeout(toastTimer);
    save();
  };
}

function switchMode(newMode) {
  vibrate();
  appMode = newMode;
  S.appMode = appMode;
  renderModeHeader();
  render();
}

function renderModeHeader() {
  const shopBtn = $('#btnShopMode');
  const trackBtn = $('#btnTrackMode');
  if (shopBtn) shopBtn.innerHTML = `${ic('cart', 16)} Zakupy`;
  if (trackBtn) trackBtn.innerHTML = `${ic('flame', 16)} Kalorie`;
  
  if (appMode === 'shopping') {
    if (shopBtn) shopBtn.classList.add('active');
    if (trackBtn) trackBtn.classList.remove('active');
    
    const sub = $('#subHeader');
    if (sub) {
      if (searchActive) {
        sub.innerHTML = `<input id="q" type="search" placeholder="Szukaj na liście…" value="${esc(query)}" style="flex:1" autofocus>
          <button class="ctrl-btn" id="closeSearchBtn" aria-label="Zamknij szukanie">${ic('x', 20)}</button>`;
        const qInput = $('#q');
        if (qInput) qInput.oninput = e => { query = e.target.value.trim(); render(); };
        const csBtn = $('#closeSearchBtn');
        if (csBtn) csBtn.onclick = () => { vibrate(); searchActive = false; query = ''; renderModeHeader(); render(); };
      } else {
        sub.innerHTML = `<button class="ctrl-btn" id="filterToggle" aria-label="Filtry">${ic('sliders', 18)} Filtry</button>
          <button class="ctrl-btn" id="sortToggle" aria-label="Sortowanie">${ic(sortMode === 'alpha' ? 'star' : 'calendar', 18)} ${sortMode === 'alpha' ? 'Alfabetycznie' : 'Dodania'}</button>
          <button class="ctrl-btn" id="searchToggle" aria-label="Szukaj">${ic('search', 18)}</button>`;
        const ft = $('#filterToggle'); if (ft) ft.onclick = openFilterModal;
        const st = $('#sortToggle'); if (st) st.onclick = toggleSortMode;
        const syt = $('#searchToggle'); if (syt) syt.onclick = () => { vibrate(); searchActive = true; renderModeHeader(); };
      }
    }
  } else {
    if (trackBtn) trackBtn.classList.add('active');
    if (shopBtn) shopBtn.classList.remove('active');
    
    const sub = $('#subHeader');
    if (sub) {
      sub.innerHTML = `<button class="ib" id="prevDay">${ic('minus', 16)}</button>
        <input type="date" id="logDateInput" value="${logDate}" style="flex:1;text-align:center;font-weight:700">
        <button class="ib" id="nextDay">${ic('plus', 16)}</button>`;
      
      const ldi = $('#logDateInput'); if (ldi) ldi.onchange = e => { logDate = e.target.value; render(); };
      const pd = $('#prevDay'); if (pd) pd.onclick = () => { changeDay(-1); };
      const nd = $('#nextDay'); if (nd) nd.onclick = () => { changeDay(1); };
    }
  }
}

function toggleSortMode() {
  vibrate();
  sortMode = sortMode === 'alpha' ? 'added' : 'alpha';
  renderModeHeader();
  render();
}

function changeDay(delta) {
  vibrate();
  const d = new Date(logDate);
  d.setDate(d.getDate() + delta);
  logDate = d.toISOString().slice(0, 10);
  renderModeHeader();
  render();
}

function render() {
  if (appMode === 'shopping') renderShopping();
  else renderTracker();
  initSwipeGestures();
}

function renderShopping() {
  const main = $('#main');
  if (!main) return;

  let list = S.entries.filter(e => {
    if (e.sessionId !== S.cur || (view !== 'all' && e.typeId !== view)) return false;
    if (filter !== 'all' && e.status !== filter) return false;
    if (shopFilter !== 'all' && (e.shop || 'Brak') !== shopFilter) return false;
    return true;
  });

  if (query) {
    const qLower = query.toLowerCase();
    list = list.filter(e => prod(e.productId).name.toLowerCase().includes(qLower));
  }
  
  if (!list.length) { main.innerHTML = `<div class="empty">Brak produktów do kupienia.<br>Dotknij „+”, aby dodać nowy produkt.</div>`; return; }
  
  const groups = {}; 
  list.forEach(e => { const t = type(e.typeId), p = prod(e.productId), key = view === 'all' ? t.name + ' › ' + catName(t, p.catId) : catName(t, p.catId); (groups[key] ||= { t, items: [] }).items.push(e); });
  
  main.innerHTML = Object.keys(groups).sort(col.compare).map(k => `<h2><span class="pill" style="--c:${groups[k].t.color};--on:${onC(groups[k].t.color)}">${ic(groups[k].t.icon, 16)}${esc(k)}</span></h2>` +
    groups[k].items.sort((a, b) => sortMode === 'alpha' ? col.compare(prod(a.productId).name, prod(b.productId).name) : (a.added || 0) - (b.added || 0))
    .map(e => `<div class="item-wrapper"><div class="item ${e.status === 'bought' ? 'p' : ''}" style="--c:${type(e.typeId).color};min-height:46px;padding:4px 8px 4px 6px" data-item-id="${e.id}">
    <button class="st ${e.status === 'bought' ? 'p' : e.status === 'na' ? 'n' : ''}" style="width:28px;height:28px" data-s="${e.id}" aria-label="${STL[e.status]}">${STI[e.status]}</button>
    <div class="t" data-e="${e.id}" style="display:flex;align-items:center;gap:6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer">
      <b style="font-size:15px;white-space:nowrap">${esc(prod(e.productId).name)}</b>
      <small style="font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">· ${esc(String(e.qty).replace('.', ','))} ${esc(e.unit)}${e.shop ? ' · ' + esc(e.shop) : ''}${e.note ? ' · ' + esc(e.note) : ''}</small>
    </div>
    <div class="acts">
      <button class="ib" style="width:32px;height:32px" data-minus="${e.id}" aria-label="Zmniejsz ilość">${ic('minus', 16)}</button>
      <button class="ib" style="width:32px;height:32px" data-plus="${e.id}" aria-label="Zwiększ ilość">${ic('plus', 16)}</button>
      <button class="ib" style="width:32px;height:32px" data-e="${e.id}" aria-label="Edytuj">${ic('pencil', 16)}</button>
    </div></div></div>`).join('')).join('');
}

function showShoppingItemDetail(entryId) {
  const en = S.entries.find(x => x.id === entryId);
  if (!en) return;
  const p = prod(en.productId);
  const t = type(en.typeId);
  const r = p?.nutri ? Nutrition.calc(p.nutri, en.qty, en.unit) : null;

  modal(`<h3 style="margin:0;padding-right:36px">${esc(p?.name || 'Produkt')}</h3>
  <small style="color:var(--mut);font-weight:700">${esc(t?.name || '')} › ${esc(catName(t, p?.catId))}</small>
  
  <div style="margin-top:14px;background:var(--card);padding:12px 14px;border-radius:16px;border:1.5px solid var(--line);display:flex;justify-content:space-between;align-items:center">
    <div>
      <div style="font-size:12px;color:var(--mut);font-weight:700">Ilość i sklep</div>
      <div style="font-size:16px;font-weight:800;margin-top:2px">${esc(String(en.qty).replace('.', ','))} ${esc(en.unit)}${en.shop ? ' · ' + esc(en.shop) : ''}</div>
      ${en.note ? `<div style="font-size:13px;color:var(--mut);margin-top:2px">Notatka: ${esc(en.note)}</div>` : ''}
    </div>
    <span class="pill" style="--c:${FC[en.status]};--on:${onC(FC[en.status])}">${STL[en.status]}</span>
  </div>

  ${p?.nutri ? `
    <div style="margin-top:14px;text-align:center;background:var(--card);padding:12px;border-radius:16px;border:1.5px solid var(--line)">
      <div style="font-size:24px;font-weight:800;color:var(--vio)">${r ? fmt(r.kcal) : '?'} <span style="font-size:16px;color:var(--ink)">kcal</span> <small style="font-size:12px;color:var(--mut)">(dla ${en.qty} ${en.unit})</small></div>
    </div>
    <div class="macro-grid" style="margin-top:10px">
      <div class="macro-item">${r ? fmt(r.protein) : '?'}g <span>Białko</span></div>
      <div class="macro-item">${r ? fmt(r.fat) : '?'}g <span>Tłuszcze</span></div>
      <div class="macro-item">${r ? fmt(r.carbs) : '?'}g <span>Węgle</span></div>
      <div class="macro-item">${r ? fmt(r.fibre) : '?'}g <span>Błonnik</span></div>
    </div>
  ` : ''}

  <div style="display:flex;gap:8px;margin-top:20px">
    <button class="btn" id="editEntryBtn" style="flex:1">Edytuj</button>
    <button class="btn s" id="closeEntryDetail" style="flex:1">Zamknij</button>
  </div>`);

  $('#closeEntryDetail').onclick = () => { vibrate(); modal(''); };
  $('#editEntryBtn').onclick = () => { vibrate(); entryForm(entryId); };
}

function calcLogNutri(l) {
  if (l.customNutri) {
    return l.customNutri;
  }
  if (l.items && l.items.length) {
    const res = { kcal: 0, protein: 0, fat: 0, carbs: 0, fibre: 0 };
    l.items.forEach(it => {
      if (it.customNutri) {
        const c = Nutrition.calc(it.customNutri, it.qty, it.unit);
        if (c) {
          res.kcal += c.kcal || 0;
          res.protein += c.protein || 0;
          res.fat += c.fat || 0;
          res.carbs += c.carbs || 0;
          res.fibre += c.fibre || 0;
        }
      } else {
        const p = prod(it.productId);
        if (p?.nutri) {
          const c = Nutrition.calc(p.nutri, it.qty, it.unit);
          if (c) {
            res.kcal += c.kcal || 0;
            res.protein += c.protein || 0;
            res.fat += c.fat || 0;
            res.carbs += c.carbs || 0;
            res.fibre += c.fibre || 0;
          }
        }
      }
    });
    return res;
  }
  const p = prod(l.productId);
  return p?.nutri ? Nutrition.calc(p.nutri, l.qty, l.unit) : null;
}

function renderTracker() {
  const main = $('#main');
  if (!main) return;

  const dayLogs = S.logs.filter(l => l.date === logDate);
  const calculated = dayLogs.map(l => {
    const p = l.productId ? prod(l.productId) : null;
    return { log: l, name: l.name || p?.name || 'Posiłek', p, r: calcLogNutri(l) };
  });

  const totals = { kcal: 0, protein: 0, fat: 0, carbs: 0, fibre: 0 };
  calculated.forEach(c => {
    if (c.r) {
      totals.kcal += c.r.kcal || 0;
      totals.protein += c.r.protein || 0;
      totals.fat += c.r.fat || 0;
      totals.carbs += c.r.carbs || 0;
      totals.fibre += c.r.fibre || 0;
    }
  });

  let html = `<div class="tracker-summary">
    <div style="font-size:13px;color:var(--mut);font-weight:700">Spożycie w dniu ${logDate}</div>
    <div class="main-k">${fmt(totals.kcal)} <span style="font-size:16px;font-weight:600;color:var(--ink)">kcal</span></div>
    <div class="macro-grid">
      <div class="macro-item">${fmt(totals.protein)}g <span>Białko</span></div>
      <div class="macro-item">${fmt(totals.fat)}g <span>Tłuszcze</span></div>
      <div class="macro-item">${fmt(totals.carbs)}g <span>Węgle</span></div>
      <div class="macro-item">${fmt(totals.fibre)}g <span>Błonnik</span></div>
    </div>
  </div>`;

  if (!dayLogs.length) {
    html += `<div class="empty">Brak wpisów dla tego dnia.<br>Dotknij „+”, aby zarejestrować posiłek.</div>`;
  } else {
    MEALS.forEach(meal => {
      const items = calculated.filter(c => c.log.meal === meal);
      if (items.length) {
        const mealKcal = items.reduce((s, i) => s + (i.r?.kcal || 0), 0);
        html += `<h2><span class="pill" style="--c:#D4C1FF;--on:#2E2A47">${esc(meal)} · ${fmt(mealKcal)} kcal</span></h2>` +
          items.map(i => `<div class="item-wrapper"><div class="item" style="--c:#CDB9FF;min-height:46px;padding:4px 8px" data-item-id="${i.log.id}">
            <div class="t" data-log-view="${i.log.id}" style="display:flex;align-items:center;justify-content:space-between;width:100%;cursor:pointer">
              <div><b>${esc(i.name)}</b> <small>${i.log.items ? '· posiłek złożony (' + i.log.items.length + ' skł.)' : (i.log.qty ? '· ' + esc(String(i.log.qty).replace('.', ',')) + ' ' + esc(i.log.unit) : '')}</small></div>
              <span class="nu" style="font-size:14px;font-weight:800;color:var(--vio)">${i.r ? fmt(i.r.kcal) + ' kcal' : '0 kcal'}</span>
            </div>
            <div class="acts">
              <button class="ib" style="width:32px;height:32px" data-log-edit="${i.log.id}" aria-label="Edytuj">${ic('pencil', 16)}</button>
            </div>
          </div></div>`).join('');
      }
    });
  }

  main.innerHTML = html;
}

function showLogDetail(logId) {
  const lg = S.logs.find(l => l.id === logId);
  if (!lg) return;
  const p = lg.productId ? prod(lg.productId) : null;
  const name = lg.name || p?.name || 'Posiłek';
  const r = calcLogNutri(lg) || { kcal: 0, protein: 0, fat: 0, carbs: 0, fibre: 0 };

  let detailsHtml = '';
  if (lg.items && lg.items.length) {
    detailsHtml = `<label style="margin-top:14px">Składniki posiłku:</label><div style="display:flex;flex-direction:column;gap:4px">` +
      lg.items.map(it => {
        const ip = it.productId ? prod(it.productId) : null;
        const ir = it.customNutri ? Nutrition.calc(it.customNutri, it.qty, it.unit) : (ip?.nutri ? Nutrition.calc(ip.nutri, it.qty, it.unit) : null);
        return `<div style="display:flex;justify-content:space-between;align-items:center;background:var(--card);padding:8px 12px;border-radius:12px;border:1px solid var(--line);font-size:14px">
          <span><b>${esc(ip?.name || it.name || 'Składnik')}</b> (${it.qty} ${it.unit})</span>
          <span style="font-weight:700;color:var(--vio)">${ir ? fmt(ir.kcal) + ' kcal' : '<span style="color:var(--err)">brak w bazie</span>'}</span>
        </div>`;
      }).join('') + `</div>`;
  }

  modal(`<h3 style="margin:0;padding-right:36px">${esc(name)}</h3>
  <small style="color:var(--mut);font-weight:700">${esc(lg.meal)} · ${lg.date}</small>
  
  <div style="margin-top:16px;text-align:center;background:var(--card);padding:14px;border-radius:18px;border:1.5px solid var(--line)">
    <div style="font-size:32px;font-weight:800;color:var(--vio)">${fmt(r.kcal)} <span style="font-size:18px;color:var(--ink)">kcal</span></div>
  </div>

  <div class="macro-grid" style="margin-top:12px">
    <div class="macro-item">${fmt(r.protein)}g <span>Białko</span></div>
    <div class="macro-item">${fmt(r.fat)}g <span>Tłuszcze</span></div>
    <div class="macro-item">${fmt(r.carbs)}g <span>Węgle</span></div>
    <div class="macro-item">${fmt(r.fibre)}g <span>Błonnik</span></div>
  </div>

  ${detailsHtml}

  <div style="display:flex;gap:8px;margin-top:20px">
    <button class="btn" id="editLogBtn" style="flex:1">Edytuj</button>
    <button class="btn s" id="closeDetailBtn" style="flex:1">Zamknij</button>
  </div>`);

  $('#closeDetailBtn').onclick = () => { vibrate(); modal(''); };
  $('#editLogBtn').onclick = () => { vibrate(); trackerForm(logId); };
}

function openFilterModal() {
  vibrate();
  const sessionEntries = S.entries.filter(e => e.sessionId === S.cur);
  const shops = [...new Set(sessionEntries.map(e => e.shop).filter(Boolean))].sort(col.compare);

  modal(`<h3 style="margin:0;padding-right:36px">Filtry i widok</h3>
  
  <label>Rodzaj listy</label>
  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
    <button class="chip f ${view === 'all' ? 'on' : ''}" style="--c:#D4C1FF;--on:${onC('#D4C1FF')}" data-v="all">Wszystko</button>
    ${S.types.map(t => `<button class="chip f ${view === t.id ? 'on' : ''}" style="--c:${t.color};--on:${onC(t.color)}" data-v="${t.id}">${ic(t.icon, 16)} ${esc(t.name)}</button>`).join('')}
  </div>

  <label>Status</label>
  <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px">
    <button class="chip f ${filter === 'all' ? 'on' : ''}" style="--c:#D4C1FF;--on:${onC('#D4C1FF')}" data-f="all">Wszystkie</button>
    ${ST.map(f => `<button class="chip f ${filter === f ? 'on' : ''}" style="--c:${FC[f]};--on:${onC(FC[f])}" data-f="${f}">${STL[f]}</button>`).join('')}
  </div>

  ${shops.length > 0 ? `
    <label>Sklep</label>
    <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px">
      <button class="chip f ${shopFilter === 'all' ? 'on' : ''}" style="--c:#FFCFAE;--on:${onC('#FFCFAE')}" data-shop="all">Wszystkie sklepy</button>
      ${shops.map(s => `<button class="chip f ${shopFilter === s ? 'on' : ''}" style="--c:#B7DEF8;--on:${onC('#B7DEF8')}" data-shop="${esc(s)}">${esc(s)}</button>`).join('')}
    </div>
  ` : ''}

  <button class="btn" id="closeFilter">Zastosuj i zamknij</button>`);

  const cf = $('#closeFilter');
  if (cf) cf.onclick = () => { vibrate(); modal(''); };
}

function initSwipeGestures() {
  document.querySelectorAll('.item').forEach(item => {
    let startX = 0, currentX = 0, isSwiping = false;
    const id = item.dataset.itemId;
    if (!id) return;

    item.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      currentX = startX;
      isSwiping = true;
      item.classList.add('swiping');
    }, {passive: true});

    item.addEventListener('touchmove', e => {
      if (!isSwiping) return;
      currentX = e.touches[0].clientX;
      const diff = currentX - startX;
      if (diff < 0) {
        item.style.transform = `translateX(${diff}px)`;
        item.style.backgroundColor = diff < -50 ? '#FF9AA8' : '';
      }
    }, {passive: true});

    item.addEventListener('touchend', () => {
      if (!isSwiping) return;
      isSwiping = false;
      item.classList.remove('swiping');
      if (currentX - startX < -80) {
        vibrate();
        removeEntry(id);
        return;
      }
      item.style.transform = '';
      item.style.backgroundColor = '';
    });
  });
}

document.addEventListener('click', e => { 
  const modeBtn = e.target.closest('[data-mode]');
  if (modeBtn) {
    switchMode(modeBtn.dataset.mode);
    return;
  }

  const logView = e.target.closest('[data-log-view]');
  if (logView) {
    vibrate();
    showLogDetail(logView.dataset.logView);
    return;
  }

  const logEdit = e.target.closest('[data-log-edit]');
  if (logEdit) {
    vibrate();
    trackerForm(logEdit.dataset.logEdit);
    return;
  }

  const entryTextClick = e.target.closest('.item .t[data-e]');
  if (entryTextClick) {
    vibrate();
    showShoppingItemDetail(entryTextClick.dataset.e);
    return;
  }

  const b = e.target.closest('[data-v],[data-f],[data-s],[data-e],[data-d],[data-plus],[data-minus],[data-shop]'); 
  if (!b) return; const d = b.dataset;
  vibrate();
  if (d.v) { view = d.v; render(); openFilterModal(); } 
  else if (d.f) { filter = d.f; render(); openFilterModal(); }
  else if (d.shop) { shopFilter = d.shop; render(); openFilterModal(); }
  else if (d.s) { const en = S.entries.find(x => x.id === d.s); if (en) { en.status = ST[(ST.indexOf(en.status) + 1) % 3]; save(); } } 
  else if (d.e) entryForm(d.e);
  else if (d.plus || d.minus) {
    const id = d.plus || d.minus;
    const en = S.entries.find(x => x.id === id);
    if (en) {
      const step = ['g', 'ml'].includes(en.unit) ? 100 : (['kg', 'l'].includes(en.unit) ? 0.5 : 1);
      en.qty = Math.max(0.1, Math.round((en.qty + (d.plus ? step : -step)) * 100) / 100);
      save();
    }
  }
  else if (d.d) { removeEntry(d.d); } 
});

const addBtn = $('#add');
if (addBtn) {
  addBtn.onclick = () => { 
    vibrate(); 
    if (appMode === 'shopping') entryForm(null); 
    else trackerForm(null); 
  };
}

const cfgBtn = $('#cfg');
if (cfgBtn) {
  cfgBtn.onclick = () => { vibrate(); settings(); }; 
  cfgBtn.innerHTML = ic('sliders', 24);
}

const opts = (arr, sel) => arr.map(([v, l]) => `<option value="${esc(v)}" ${v === sel ? 'selected' : ''}>${esc(l)}</option>`).join('');

function entryForm(id) {
  const en = id && S.entries.find(x => x.id === id), p0 = en && prod(en.productId);
  let catTouched = false, nutTouched = false, autoNut = false, autoSrc = '', typeId = en ? en.typeId : (view !== 'all' ? view : S.types[0].id), pid = p0 ? p0.id : null;
  const draw = () => { const t = type(typeId), p = pid && prod(pid), food = t.food;
    modal(`<h3 style="margin:0;padding-right:36px">${en ? 'Edytuj pozycję' : 'Dodaj produkt do zakupów'}</h3>
    <label>Lista</label><select id="fT" ${en ? 'disabled' : ''}>${opts(S.types.map(t => [t.id, t.name]), typeId)}</select>
    <label>Nazwa produktu</label><input id="fN" value="${esc(p?.name || '')}" autocomplete="off"><div class="sug" id="sug"></div><div class="err" id="err"></div>
    <label>Kategoria</label><select id="fC">${opts(t.categories.map(c => [c.id, c.name]), p?.catId)}</select>
    <label>Sklep (opcjonalnie)</label><input id="fShop" value="${esc(en?.shop || p?.defaultShop || '')}" placeholder="np. Biedronka, Lidl, Rossmann" list="shopList"><datalist id="shopList"></datalist>
    <div class="g2"><div><label>Ilość</label><input id="fQ" inputmode="decimal" value="${en ? en.qty : 1}"></div><div><label>Jednostka</label><select id="fU">${opts(UNITS.map(u => [u, u]), en?.unit || (food ? 'szt' : 'szt'))}</select></div></div>
    <label>Notatka (opcjonalnie)</label><input id="fNote" value="${esc(en?.note || '')}">
    ${food ? `<label><input type="checkbox" id="showNut" style="width:auto;min-height:0"> Dodaj wartości odżywcze</label>` : ''}
    ${food ? `<div id="nutBox" style="display:none"> <label>Wartości odżywcze (na 100g / 100ml)</label><div class="g2"><div><label>Baza</label><select id="nB">${opts([['g', 'g'], ['ml', 'ml']], p?.nutri?.basis)}</select></div><div><label>Energia (kcal)</label><input id="nK" inputmode="decimal" placeholder="kcal" value="${p?.nutri?.values.kcal ?? ''}"></div></div>
    <div class="g2" style="margin-top:8px"><div><label>Białko (g)</label><input id="nP" inputmode="decimal" placeholder="białko (g)" value="${p?.nutri?.values.protein ?? ''}"></div><div><label>Tłuszcze (g)</label><input id="nT" inputmode="decimal" placeholder="tłuszcze (g)" value="${p?.nutri?.values.fat ?? ''}"></div></div>
    <div class="g2" style="margin-top:8px"><div><label>Węglowodany (g)</label><input id="nW" inputmode="decimal" placeholder="węglowodany (g)" value="${p?.nutri?.values.carbs ?? ''}"></div><div><label>Błonnik (g)</label><input id="nF" inputmode="decimal" placeholder="błonnik (g)" value="${p?.nutri?.values.fibre ?? ''}"></div></div><div id="live" class="nu" style="margin-top:6px"></div><div id="auto" class="nu" style="font-style:italic"></div>
    <small style="color:var(--mut)">Puste pole = nieznane.</small></div>` : ''}
    <label>Status</label><select id="fS">${opts(ST.map(s => [s, STL[s]]), en?.status || 'buy')}</select>
    <button class="btn" id="ok">Zapisz</button>${en ? '<button class="btn s" id="rm">Usuń z listy</button>' : ''}<button class="btn s" id="cl">Anuluj</button>`);
    
    const shopList = $('#shopList');
    if (shopList) shopList.innerHTML = [...new Set(S.entries.map(e => e.shop).concat(S.products.map(p => p.defaultShop)).filter(Boolean))].map(s => `<option value="${esc(s)}">`).join('');

    const num = v => { v = String(v).trim().replace(',', '.'); return v === '' || isNaN(+v) ? null : +v; };
    const nut = () => { const cb = $('#showNut'); if (!food || !cb || !cb.checked) return null; const v = { kcal: num($('#nK').value), protein: num($('#nP').value), fat: num($('#nT').value), carbs: num($('#nW').value), fibre: num($('#nF').value) }; if (Object.values(v).every(x => x == null)) return null; return { basis: $('#nB').value, values: { ...(p?.nutri?.values || {}), ...v } }; };
    const live = () => { if (!food) return; const r = Nutrition.calc(nut(), num($('#fQ').value), $('#fU').value); const lv = $('#live'); if (lv) lv.textContent = !nut() ? '' : r ? 'Energia: ' + fmt(r.kcal) + ' kcal' : 'Brak przelicznika dla tej jednostki'; };
    
    if (food) {
      const cb = $('#showNut'), box = $('#nutBox');
      if (cb && box) {
        const hasNutri = !!p?.nutri;
        cb.checked = hasNutri;
        box.style.display = hasNutri ? 'block' : 'none';
        cb.onchange = () => { box.style.display = cb.checked ? 'block' : 'none'; live(); };
      }
      ['#nB', '#nK', '#nP', '#nT', '#nW', '#nF'].forEach(s => { const el = $(s); if (el) el.oninput = () => { nutTouched = true; autoNut = false; const at = $('#auto'); if (at) at.textContent = ''; live(); }; });
      ['#fQ', '#fU'].forEach(s => { const el = $(s); if (el) el.oninput = live; });
      live();
    }
    
    const fT = $('#fT'); if (fT) fT.onchange = e => { typeId = e.target.value; pid = null; catTouched = nutTouched = autoNut = false; draw(); };
    const fC = $('#fC'); if (fC) fC.onchange = () => catTouched = true;
    
    const updateSug = () => {
      const sug = $('#sug');
      if (!sug) return;
      const recents = S.products.filter(x => x.typeId === typeId).sort((a, b) => (b.usedCount || 0) - (a.usedCount || 0)).slice(0, 6);
      sug.innerHTML = recents.map(x => `<button class="chip f" data-p="${x.id}">⭐ ${esc(x.name)}</button>`).join('');
      sug.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { 
        vibrate(); pid = b.dataset.p; const pp = prod(pid); 
        const fN = $('#fN'); if (fN) fN.value = pp.name;
        const fc = $('#fC'); if (fc) fc.value = pp.catId; 
        const fShop = $('#fShop');
        if (pp.defaultShop && fShop) fShop.value = pp.defaultShop;
        else if (fShop) { const last = S.entries.slice().reverse().find(e => e.productId === pp.id && e.shop); if (last) fShop.value = last.shop; }
        updateSug(); if (pp.nutri) draw(); 
      });
    };

    const autoFill = name => { 
      const nm = name.trim(), sp = nm && S.products.find(x => x.typeId === typeId && Foods.norm(x.name) === Foods.norm(nm));
      const f = nm && Foods.find(nm, t.categories.map(c => c.name)), fCat = f && t.categories.find(c => c.name === f.cat)?.id;
      const catId = sp?.catId || fCat, n = sp?.nutri || f?.n;
      const fc = $('#fC');
      if (!catTouched && catId && t.categories.some(c => c.id === catId) && fc) fc.value = catId;
      
      const fShop = $('#fShop');
      if (sp?.defaultShop && fShop) fShop.value = sp.defaultShop;

      if (!food) return; const set = (id, v) => { const el = $(id); if (el) el.value = v ?? ''; };
      if (n && !nutTouched) { const v = n.values; const nb = $('#nB'); if (nb) nb.value = n.basis; set('#nK', v.kcal); set('#nP', v.protein); set('#nT', v.fat); set('#nW', v.carbs); set('#nF', v.fibre); autoNut = true; autoSrc = sp?.nutri ? 'saved' : 'table'; const cb = $('#showNut'); if (cb) cb.checked = true; const nbx = $('#nutBox'); if (nbx) nbx.style.display = 'block'; }
      else if (!n && autoNut && !nutTouched) { ['#nK', '#nP', '#nT', '#nW', '#nF'].forEach(i => set(i, '')); autoNut = false; }
      const aut = $('#auto'); if (aut) aut.textContent = !autoNut ? '' : autoSrc === 'saved' ? 'Wartości z zapisanego produktu.' : 'Wartości uzupełnione automatycznie.'; live(); 
    };

    const fN = $('#fN');
    if (fN) {
      fN.oninput = e => { 
        const q = e.target.value.trim().toLowerCase(); 
        if (!en) pid = null; 
        if (!en && !pid) autoFill(e.target.value); 
        const sug = $('#sug');
        const m = q ? S.products.filter(x => x.typeId === typeId && x.name.toLowerCase().includes(q)).sort((a, b) => col.compare(a.name, b.name)).slice(0, 6) : [];
        if (!q) updateSug();
        else if (sug) {
          sug.innerHTML = m.map(x => `<button class="chip f" data-p="${x.id}">${esc(x.name)} · ${esc(catName(t, x.catId))}</button>`).join(''); 
          sug.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { vibrate(); pid = b.dataset.p; const pp = prod(pid); fN.value = pp.name; const fc = $('#fC'); if (fc) fc.value = pp.catId; const fShop = $('#fShop'); if (pp.defaultShop && fShop) fShop.value = pp.defaultShop; sug.innerHTML = ''; if (pp.nutri) draw(); }); 
        }
      };
    }

    if (!en) updateSug();

    const cl = $('#cl'); if (cl) cl.onclick = () => { vibrate(); modal(''); };
    const rm = $('#rm'); if (en && rm) rm.onclick = () => { vibrate(); removeEntry(en.id); modal(''); };
    
    const ok = $('#ok');
    if (ok) {
      ok.onclick = () => { 
        vibrate();
        const name = fN ? fN.value.trim() : '';
        const fq = $('#fQ');
        const qty = fq ? num(fq.value) : 1;
        const fShop = $('#fShop');
        const shop = fShop ? fShop.value.trim() : '';
        const err = $('#err');
        if (!name) { if (err) err.textContent = 'Podaj nazwę produktu.'; return; } 
        if (!(qty > 0)) { if (err) err.textContent = 'Ilość musi być większa od zera.'; return; }
        let p = pid && prod(pid); 
        if (!p) p = S.products.find(x => x.typeId === typeId && col.compare(x.name, name) === 0);
        if (!p) { p = { id: uid(), typeId, name }; S.products.push(p); } 
        p.name = name; 
        const fc = $('#fC');
        if (fc) p.catId = fc.value; 
        p.defaultShop = shop; 
        p.usedCount = (p.usedCount || 0) + 1;
        if (food) p.nutri = nut();
        if (!en && S.entries.some(x => x.sessionId === S.cur && x.productId === p.id && x.status !== 'bought') && !confirm('Ten produkt jest już na liście. Dodać mimo to?')) return;
        const fNote = $('#fNote');
        const fS = $('#fS');
        const f = { productId: p.id, typeId, qty, unit: $('#fU')?.value || 'szt', shop, note: fNote ? fNote.value.trim() : '', status: fS ? fS.value : 'buy', added: en?.added || Date.now() };
        if (en) Object.assign(en, f); else S.entries.push({ id: uid(), sessionId: S.cur, ...f }); 
        modal(''); save(); 
      }; 
    }
  };
  draw();
}

function trackerForm(logId) {
  const lg = logId && S.logs.find(x => x.id === logId);
  const foodType = S.types.find(t => t.food) || S.types[0];
  let activeTab = lg?.items ? 'multi' : (lg?.customNutri ? 'custom' : 'single');
  let itemsList = lg?.items ? JSON.parse(JSON.stringify(lg.items)) : [];
  let currentMeal = lg?.meal || MEALS[0];
  let currentName = lg?.name || '';
  let singleQty = lg?.qty || 100;
  let singleUnit = lg?.unit || 'g';

  const drawForm = () => {
    modal(`<h3 style="margin:0;padding-right:36px">${lg ? 'Edytuj posiłek' : 'Zarejestruj posiłek'}</h3>
    <label>Posiłek</label><select id="tMeal">${opts(MEALS.map(m => [m, m]), currentMeal)}</select>
    
    <div style="display:flex;gap:4px;margin-top:10px;margin-bottom:12px;background:var(--line);padding:3px;border-radius:16px">
      <button class="chip f ${activeTab === 'single' ? 'on' : ''}" id="tabSingle" style="flex:1;justify-content:center">Z bazy</button>
      <button class="chip f ${activeTab === 'multi' ? 'on' : ''}" id="tabMulti" style="flex:1;justify-content:center">Składniki</button>
      <button class="chip f ${activeTab === 'custom' ? 'on' : ''}" id="tabCustom" style="flex:1;justify-content:center">Wpisz kcal</button>
    </div>

    <div id="tabContent"></div>
    <div class="err" id="err"></div>
    <button class="btn" id="ok">Zapisz w dzienniku</button>${lg ? '<button class="btn s" id="rm">Usuń wpis</button>' : ''}<button class="btn s" id="cl">Anuluj</button>`);

    const mealSelect = $('#tMeal');
    if (mealSelect) mealSelect.onchange = e => { currentMeal = e.target.value; };

    $('#tabSingle').onclick = () => {
      const tN = $('#tN'), tQ = $('#tQ'), tU = $('#tU');
      if (tN) currentName = tN.value.trim();
      if (tQ) singleQty = tQ.value;
      if (tU) singleUnit = tU.value;
      activeTab = 'single';
      drawForm();
    };
    $('#tabMulti').onclick = () => {
      const tName = $('#tName');
      if (tName) currentName = tName.value.trim();
      activeTab = 'multi';
      drawForm();
    };
    $('#tabCustom').onclick = () => {
      const cName = $('#cName');
      if (cName) currentName = cName.value.trim();
      activeTab = 'custom';
      drawForm();
    };

    const cnt = $('#tabContent');
    if (activeTab === 'single') {
      const p0 = lg?.productId ? prod(lg.productId) : (currentName ? S.products.find(x => col.compare(x.name, currentName) === 0) : null);
      cnt.innerHTML = `<label>Nazwa produktu</label><input id="tN" value="${esc(currentName || p0?.name || '')}" autocomplete="off"><div class="sug" id="sug"></div>
      <div class="g2"><div><label>Ilość</label><input id="tQ" inputmode="decimal" value="${singleQty}"></div><div><label>Jednostka</label><select id="tU">${opts(UNITS.map(u => [u, u]), singleUnit)}</select></div></div>`;
      
      let pid = p0 ? p0.id : null;
      const updateSug = () => {
        const sug = $('#sug'); if (!sug) return;
        const recents = S.products.filter(x => x.nutri).sort((a, b) => (b.usedCount || 0) - (a.usedCount || 0)).slice(0, 6);
        sug.innerHTML = recents.map(x => `<button class="chip f" data-p="${x.id}">⭐ ${esc(x.name)}</button>`).join('');
        sug.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { vibrate(); pid = b.dataset.p; const pp = prod(pid); const tn = $('#tN'); if (tn) { tn.value = pp.name; currentName = pp.name; } });
      };
      const tN = $('#tN');
      if (tN) {
        tN.oninput = e => {
          currentName = e.target.value;
          const q = currentName.trim().toLowerCase();
          const found = S.products.find(x => col.compare(x.name, currentName.trim()) === 0);
          pid = found ? found.id : null;
          const sug = $('#sug');
          const m = q ? S.products.filter(x => x.name.toLowerCase().includes(q)).slice(0, 6) : [];
          if (!q) updateSug();
          else if (sug) {
            sug.innerHTML = m.map(x => `<button class="chip f" data-p="${x.id}">${esc(x.name)}</button>`).join('');
            sug.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { vibrate(); pid = b.dataset.p; const pp = prod(pid); tN.value = pp.name; currentName = pp.name; sug.innerHTML = ''; });
          }
        };
      }
      if (!lg && !currentName) updateSug();
      cnt.dataset.getPid = () => pid;
    } else if (activeTab === 'multi') {
      cnt.innerHTML = `<label>Nazwa posiłku (np. Koktajl proteinowy)</label><input id="tName" value="${esc(currentName)}" placeholder="np. Owsianka, Omlet" autocomplete="off">
      <label>Dodane składniki:</label>
      <div id="itemsContainer" style="display:flex;flex-direction:column;gap:6px;margin-bottom:8px"></div>
      <button class="btn s" id="addItemBtn" style="min-height:40px;margin-top:4px">+ Dodaj składnik do posiłku</button>`;
      
      const tNameInput = $('#tName');
      if (tNameInput) tNameInput.oninput = e => { currentName = e.target.value; };

      const renderItems = () => {
        const icnt = $('#itemsContainer');
        if (!icnt) return;
        icnt.innerHTML = itemsList.map((it, idx) => {
          const p = it.productId ? prod(it.productId) : null;
          const hasNutri = it.customNutri || (p && p.nutri);
          return `<div style="display:flex;align-items:center;justify-content:space-between;background:var(--card);padding:6px 10px;border-radius:12px;border:1.5px solid var(--line)">
            <div>
              <b>${esc(p?.name || it.name || 'Składnik')}</b> (${it.qty} ${it.unit})
              ${!hasNutri ? '<br><small style="color:var(--err)">Brak w bazie — <a href="#" data-fix-item="' + idx + '" style="color:var(--vio);font-weight:700">uzupełnij makro</a></small>' : ''}
            </div>
            <div style="display:flex;gap:4px">
              <button class="ib" data-edit-item="${idx}" style="width:28px;height:28px" aria-label="Edytuj">${ic('pencil', 14)}</button>
              <button class="ib del" data-del-item="${idx}" style="width:28px;height:28px" aria-label="Usuń">${ic('x', 14)}</button>
            </div>
          </div>`;
        }).join('');
        icnt.querySelectorAll('[data-del-item]').forEach(b => b.onclick = () => { itemsList.splice(+b.dataset.delItem, 1); renderItems(); });
        icnt.querySelectorAll('[data-edit-item]').forEach(b => b.onclick = () => { openItemModal(+b.dataset.editItem); });
        icnt.querySelectorAll('[data-fix-item]').forEach(a => a.onclick = e => { e.preventDefault(); openItemModal(+a.dataset.fixItem); });
      };
      renderItems();

      const openItemModal = (editIdx = null) => {
        const itToEdit = editIdx !== null ? itemsList[editIdx] : null;
        const editP = itToEdit?.productId ? prod(itToEdit.productId) : null;
        const cn = itToEdit?.customNutri || {};
        modal(`<h3 style="margin:0;padding-right:36px">${itToEdit ? 'Edytuj składnik' : 'Dodaj składnik'}</h3>
        <label>Nazwa składnika</label><input id="itN" value="${esc(editP?.name || itToEdit?.name || '')}" autocomplete="off"><div class="sug" id="itSug"></div>
        <div class="g2"><div><label>Ilość</label><input id="itQ" inputmode="decimal" value="${itToEdit ? itToEdit.qty : 100}"></div><div><label>Jednostka</label><select id="itU">${opts(UNITS.map(u => [u, u]), itToEdit?.unit || 'g')}</select></div></div>
        
        <div style="margin-top:12px;background:var(--card);padding:10px;border-radius:12px;border:1px solid var(--line)">
          <label style="font-size:13px;margin-bottom:6px">Wartości odżywcze na 100g/100ml (jeśli brak w bazie):</label>
          <div class="g2"><div><label>Kcal</label><input id="icK" inputmode="decimal" value="${cn.kcal ?? ''}"></div><div><label>Białko (g)</label><input id="icP" inputmode="decimal" value="${cn.protein ?? ''}"></div></div>
          <div class="g2" style="margin-top:6px"><div><label>Tłuszcz (g)</label><input id="icT" inputmode="decimal" value="${cn.fat ?? ''}"></div><div><label>Węgle (g)</label><input id="icW" inputmode="decimal" value="${cn.carbs ?? ''}"></div></div>
          <div style="margin-top:6px"><label>Błonnik (g)</label><input id="icF" inputmode="decimal" value="${cn.fibre ?? ''}"></div>
        </div>

        <div class="err" id="itErr"></div>
        <button class="btn" id="itOk">Zapisz składnik</button><button class="btn s" id="itCl">Anuluj</button>`);
        
        let itPid = editP ? editP.id : null;
        let itName = editP?.name || itToEdit?.name || '';
        const itN = $('#itN');
        if (itN) {
          itN.oninput = e => {
            itName = e.target.value;
            const q = itName.trim().toLowerCase();
            const found = S.products.find(x => col.compare(x.name, itName.trim()) === 0);
            itPid = found ? found.id : null;
            const sug = $('#itSug');
            const m = q ? S.products.filter(x => x.name.toLowerCase().includes(q)).slice(0, 6) : [];
            if (!q) {
              sug.innerHTML = S.products.filter(x => x.nutri).slice(0, 6).map(x => `<button class="chip f" data-p="${x.id}">⭐ ${esc(x.name)}</button>`).join('');
            } else if (sug) {
              sug.innerHTML = m.map(x => `<button class="chip f" data-p="${x.id}">${esc(x.name)}</button>`).join('');
            }
            sug.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { vibrate(); itPid = b.dataset.p; const pp = prod(itPid); itN.value = pp.name; itName = pp.name; sug.innerHTML = ''; });
          };
        }
        const initialSug = $('#itSug');
        if (initialSug) {
          initialSug.innerHTML = S.products.filter(x => x.nutri).slice(0, 6).map(x => `<button class="chip f" data-p="${x.id}">⭐ ${esc(x.name)}</button>`).join('');
          initialSug.querySelectorAll('[data-p]').forEach(b => b.onclick = () => { vibrate(); itPid = b.dataset.p; const pp = prod(itPid); itN.value = pp.name; itName = pp.name; initialSug.innerHTML = ''; });
        }

        $('#itCl').onclick = () => drawForm();
        $('#itOk').onclick = () => {
          const nm = itName.trim(), qv = +($('#itQ')?.value.replace(',', '.') || 0);
          if (!nm) return $('#itErr').textContent = 'Podaj nazwę składnika.';
          if (!(qv > 0)) return $('#itErr').textContent = 'Ilość musi być większa od zera.';
          
          let p = itPid ? prod(itPid) : S.products.find(x => col.compare(x.name, nm) === 0);
          const num = v => { v = String(v || '').trim().replace(',', '.'); return v === '' || isNaN(+v) ? 0 : +v; };
          const customKcal = num($('#icK')?.value);
          
          let customNutri = null;
          if (customKcal > 0) {
            customNutri = {
              basis: 'g',
              values: {
                kcal: customKcal,
                protein: num($('#icP')?.value),
                fat: num($('#icT')?.value),
                carbs: num($('#icW')?.value),
                fibre: num($('#icF')?.value)
              }
            };
          }

          if (!p && !customNutri) {
            const f = Foods.find(nm, foodType.categories.map(c => c.name));
            if (f) {
              p = { id: uid(), typeId: foodType.id, name: nm, catId: foodType.categories[0]?.id, nutri: f.n };
              S.products.push(p);
            }
          }

          const newItemData = { productId: p ? p.id : null, name: nm, qty: qv, unit: $('#itU')?.value || 'g', customNutri };
          if (editIdx !== null) {
            itemsList[editIdx] = newItemData;
          } else {
            itemsList.push(newItemData);
          }
          drawForm();
        };
      };

      $('#addItemBtn').onclick = () => openItemModal(null);
    } else if (activeTab === 'custom') {
      const c = lg?.customNutri || {};
      cnt.innerHTML = `<label>Nazwa (opcjonalnie)</label><input id="cName" value="${esc(currentName)}" placeholder="np. Obiad na mieście" autocomplete="off">
      <div class="g2"><div><label>Energia (kcal)</label><input id="cK" inputmode="decimal" placeholder="kcal" value="${c.kcal ?? ''}"></div><div><label>Białko (g)</label><input id="cP" inputmode="decimal" placeholder="g" value="${c.protein ?? ''}"></div></div>
      <div class="g2" style="margin-top:8px"><div><label>Tłuszcze (g)</label><input id="cT" inputmode="decimal" placeholder="g" value="${c.fat ?? ''}"></div><div><label>Węglowodany (g)</label><input id="cW" inputmode="decimal" placeholder="g" value="${c.carbs ?? ''}"></div></div>
      <div style="margin-top:8px"><label>Błonnik (g)</label><input id="cF" inputmode="decimal" placeholder="g" value="${c.fibre ?? ''}"></div>`;
      
      const cNameInput = $('#cName');
      if (cNameInput) cNameInput.oninput = e => { currentName = e.target.value; };
    }

    const cl = $('#cl'); if (cl) cl.onclick = () => { vibrate(); modal(''); };
    const rm = $('#rm'); if (lg && rm) rm.onclick = () => { vibrate(); removeEntry(lg.id); modal(''); };

    const ok = $('#ok');
    if (ok) {
      ok.onclick = () => {
        vibrate();
        const meal = $('#tMeal')?.value || MEALS[0];
        const num = v => { v = String(v || '').trim().replace(',', '.'); return v === '' || isNaN(+v) ? 0 : +v; };
        
        let logData = { date: logDate, meal };

        if (activeTab === 'single') {
          const tN = $('#tN');
          const name = tN ? tN.value.trim() : currentName.trim();
          const tq = $('#tQ');
          const qty = tq ? num(tq.value) : 100;
          const err = $('#err');
          if (!name) { if (err) err.textContent = 'Podaj nazwę produktu.'; return; }
          if (!(qty > 0)) { if (err) err.textContent = 'Ilość musi być większa od zera.'; return; }
          
          let getPid = cnt.dataset.getPid;
          let pid = getPid ? getPid() : null;
          let p = pid ? prod(pid) : S.products.find(x => col.compare(x.name, name) === 0);
          if (!p) {
            const f = Foods.find(name, foodType.categories.map(c => c.name));
            p = { id: uid(), typeId: foodType.id, name, catId: foodType.categories[0]?.id, nutri: f?.n || null };
            S.products.push(p);
          }
          p.usedCount = (p.usedCount || 0) + 1;
          logData.productId = p.id;
          logData.qty = qty;
          logData.unit = $('#tU')?.value || 'g';
          logData.name = name;
        } else if (activeTab === 'multi') {
          const name = currentName.trim() || 'Posiłek złożony';
          if (!itemsList.length) { const err = $('#err'); if (err) err.textContent = 'Dodaj przynajmniej jeden składnik.'; return; }
          logData.name = name;
          logData.items = itemsList;
        } else if (activeTab === 'custom') {
          const name = currentName.trim() || 'Posiłek';
          const kcal = num($('#cK')?.value);
          if (!kcal) { const err = $('#err'); if (err) err.textContent = 'Podaj liczbę kalorii.'; return; }
          logData.name = name;
          logData.customNutri = {
            kcal,
            protein: num($('#cP')?.value),
            fat: num($('#cT')?.value),
            carbs: num($('#cW')?.value),
            fibre: num($('#cF')?.value)
          };
        }

        if (lg) {
          delete lg.productId; delete lg.qty; delete lg.unit; delete lg.items; delete lg.customNutri; delete lg.name;
          Object.assign(lg, logData);
        } else {
          S.logs.push({ id: uid(), ...logData });
        }

        modal(''); save();
      };
    }
  };

  drawForm();
}

function settings() {
  const hist = S.sessions.filter(s => s.archived).length;
  modal(`<h3 style="margin:0;padding-right:36px">Ustawienia</h3>
  <label>Aktualny tryb aplikacji</label>
  <div style="display:flex;gap:8px;margin-bottom:12px">
    <button class="btn ${appMode === 'shopping' ? '' : 's'}" id="setShop" style="flex:1">Lista zakupów</button>
    <button class="btn ${appMode === 'tracker' ? '' : 's'}" id="setTrack" style="flex:1">Kalorie</button>
  </div>
  <button class="btn s" id="share">Udostępnij listę tekstowo</button>
  <button class="btn s" id="end">Zakończ zakupy / nowa lista</button>
  <button class="btn s" id="types">Rodzaje list i kategorie</button>
  <button class="btn s" id="exp">Eksportuj kopię zapasową (JSON)</button>
  <label class="btn s" style="display:flex;align-items:center;justify-content:center">Przywróć z kopii<input id="imp" type="file" accept=".json,application/json" hidden></label>
  <p style="color:var(--mut);font-size:14px">Dane są zapisane na tym urządzeniu. Zarchiwizowane sesje: ${hist}.</p><button class="btn s" id="cl">Zamknij</button>`);
  
  const setShop = $('#setShop'); if (setShop) setShop.onclick = () => { switchMode('shopping'); modal(''); };
  const setTrack = $('#setTrack'); if (setTrack) setTrack.onclick = () => { switchMode('tracker'); modal(''); };
  const cl = $('#cl'); if (cl) cl.onclick = () => { vibrate(); modal(''); }; 
  const types = $('#types'); if (types) types.onclick = () => { vibrate(); typesEditor(); }; 
  const end = $('#end'); if (end) end.onclick = () => { vibrate(); endSession(); };
  
  const share = $('#share');
  if (share) {
    share.onclick = async () => {
      vibrate();
      const list = S.entries.filter(e => e.sessionId === S.cur && e.status === 'buy');
      if (!list.length) { alert('Brak produktów do kupienia na liście!'); return; }
      const groups = {};
      list.forEach(e => { const t = type(e.typeId), p = prod(e.productId), key = t.name + ' › ' + catName(t, p.catId); (groups[key] ||= []).push(`- ${p.name} (${e.qty} ${e.unit})${e.shop ? ' [' + e.shop + ']' : ''}${e.note ? ' [' + e.note + ']' : ''}`); });
      let text = '🛒 Lista zakupów:\n\n';
      for (const [k, items] of Object.entries(groups)) text += `*${k}*:\n` + items.join('\n') + '\n\n';
      if (navigator.share) { try { await navigator.share({ title: 'Lista zakupów', text }); } catch {} }
      else { navigator.clipboard.writeText(text); alert('Skopiowano listę do schowka!'); }
    };
  }

  const exp = $('#exp');
  if (exp) {
    exp.onclick = () => { vibrate(); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' })); a.download = 'zakupy-' + new Date().toISOString().slice(0, 10) + '.json'; a.click(); };
  }

  const imp = $('#imp');
  if (imp) {
    imp.onchange = async e => { vibrate(); try { const d = JSON.parse(await e.target.files[0].text()); if (!d.types || !d.products || !d.entries || !d.sessions) throw 0;
      if (!confirm('Przywrócenie ZASTĄPI obecne dane. Kontynuować?')) return; S = mig(d); appMode = S.appMode || 'shopping'; view = 'all'; modal(''); save(); renderModeHeader(); } catch { alert('Niepoprawna kopia zapasowa.'); } };
  }
}

function endSession() {
  const na = S.entries.filter(e => e.sessionId === S.cur && e.status === 'na').length, buy = S.entries.filter(e => e.sessionId === S.cur && e.status === 'buy').length;
  modal(`<h3 style="margin:0;padding-right:36px">Zakończ zakupy</h3><p>Niedostępne: <b>${na}</b>, do kupienia: <b>${buy}</b>.</p>
  <label><input type="checkbox" id="cn" checked style="width:auto;min-height:0"> Przenieś niedostępne do nowej listy</label>
  <label><input type="checkbox" id="cb" checked style="width:auto;min-height:0"> Przenieś też „do kupienia”</label>
  <button class="btn" id="go">Zarchiwizuj i utwórz nową</button><button class="btn s" id="cl">Anuluj</button>`);
  const cl = $('#cl'); if (cl) cl.onclick = () => { vibrate(); modal(''); }; 
  const go = $('#go');
  if (go) {
    go.onclick = () => { 
      vibrate();
      const n = { id: uid(), name: 'Zakupy ' + new Date().toLocaleDateString('pl'), created: Date.now(), archived: false };
      const cn = $('#cn')?.checked, cb = $('#cb')?.checked;
      const carry = S.entries.filter(e => e.sessionId === S.cur && ((cn && e.status === 'na') || (cb && e.status === 'buy')));
      carry.forEach(e => { if (!S.entries.some(x => x.sessionId === n.id && x.productId === e.productId)) S.entries.push({ ...e, id: uid(), sessionId: n.id, status: 'buy' }); });
      S.sessions.find(s => s.id === S.cur).archived = true; S.sessions.push(n); S.cur = n.id; modal(''); save(); 
    };
  }
}

function typesEditor() {
  modal(`<h3 style="margin:0;padding-right:36px">Rodzaje list</h3>` + S.types.map(t => `<div class="item" style="margin:6px 0"><div class="t"><b>${ic(t.icon, 18)} ${esc(t.name)}</b><small>${t.categories.length} kategorii</small></div><button class="chip f" data-et="${t.id}">Edytuj</button></div>`).join('') +
    `<button class="btn" id="nt">Nowy rodzaj listy</button><button class="btn s" id="cl">Wróć</button>`);
  const cl = $('#cl'); if (cl) cl.onclick = () => { vibrate(); settings(); }; 
  const nt = $('#nt'); if (nt) nt.onclick = () => { vibrate(); editType(null); }; 
  document.querySelectorAll('[data-et]').forEach(b => b.onclick = () => { vibrate(); editType(b.dataset.et); });
}

function editType(id) {
  const t = id ? type(id) : { name: '', color: '#FFB5CC', icon: 'bag', food: false, categories: [] };
  modal(`<h3 style="margin:0;padding-right:36px">${id ? 'Edytuj listę' : 'Nowa lista'}</h3><label>Nazwa</label><input id="tn" value="${esc(t.name)}"><div class="g2"><div><label>Ikona</label><select id="ti">${opts(ICON_KEYS.map(k => [k, ICONL[k]]), t.icon)}</select></div><div><label>Kolor</label><input id="tc" type="color" value="${t.color}"></div></div>
  <label><input type="checkbox" id="tf" ${t.food ? 'checked' : ''} style="width:auto;min-height:0"> Produkty spożywcze (wartości odżywcze)</label>
  <label>Kategorie (jedna w wierszu)</label><textarea id="tk" rows="8">${esc(t.categories.map(c => c.name).join('\n'))}</textarea><div class="err" id="err"></div>
  <button class="btn" id="ok">Zapisz</button>${id ? '<button class="btn d" id="del">Usuń listę</button>' : ''}<button class="btn s" id="cl">Anuluj</button>`);
  const cl = $('#cl'); if (cl) cl.onclick = () => { vibrate(); typesEditor(); };
  const ok = $('#ok');
  if (ok) {
    ok.onclick = () => { 
      vibrate();
      const name = $('#tn')?.value.trim(); 
      const err = $('#err');
      if (!name) { if (err) err.textContent = 'Podaj nazwę listy.'; return; }
      const names = $('#tk')?.value.split('\n').map(x => x.trim()).filter(Boolean) || [], old = id ? t.categories : [];
      const cats = names.map((n, i) => ({ id: old[i]?.id || uid(), name: n }));
      if (id) { const gone = old.slice(cats.length); if (gone.some(c => S.products.some(p => p.catId === c.id)) && !confirm('Usuwane kategorie mają produkty — trafią do „Bez kategorii”. Kontynuować?')) return; gone.forEach(c => S.products.forEach(p => { if (p.catId === c.id) p.catId = null; })); }
      Object.assign(t, { name, icon: $('#ti')?.value || 'bag', color: $('#tc')?.value || '#FFB5CC', food: $('#tf')?.checked || false, categories: cats }); if (!id) { t.id = uid(); S.types.push(t); } save().then(typesEditor); 
    };
  }
  const del = $('#del');
  if (id && del) {
    del.onclick = () => { 
      vibrate();
      if (!confirm(`Usunąć listę „${t.name}” wraz z produktami?`)) return;
      S.types = S.types.filter(x => x.id !== id); S.products = S.products.filter(p => p.typeId !== id); S.entries = S.entries.filter(e => e.typeId !== id); if (view === id) view = 'all'; save().then(typesEditor); 
    };
  }
}

(async () => { 
  try { S = await DB.get(); if (!S) { S = seed(); await DB.put(S); } } catch { S = seed(); }
  mig(S); 
  appMode = S.appMode || 'shopping';
  try { await DB.put(JSON.parse(JSON.stringify(S))) } catch {}
  if (navigator.storage?.persist) navigator.storage.persist(); 
  renderModeHeader();
  render();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {}); 
})();
