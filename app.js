'use strict';
const $ = s => document.querySelector(s), col = new Intl.Collator('pl', { sensitivity: 'base' });
const uid = () => crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const vibrate = () => { if (navigator.vibrate) navigator.vibrate(15); };
const ICONS = { cart: '<path d="M3 4h2l2.4 11h10.2l2-8H6.2"/><circle cx="9" cy="20" r="1.3"/><circle cx="17" cy="20" r="1.3"/>', leaf: '<path d="M5 19c0-9 6-14 14-14 0 9-5 14-14 14zM5 19l8-8"/>', bottle: '<path d="M9 3h6v3l1.5 2v11a2 2 0 01-2 2h-5a2 2 0 01-2-2V8L9 6zM8 12h8"/>',
  yarn: '<circle cx="12" cy="12" r="8"/><path d="M5 9c5 2 9 2 14 0M5 15c5-2 9-2 14 0M12 4c-3 5-3 11 0 16"/>', pencil: '<path d="M4 20l1-4L16 5l3 3L8 19zM14 7l3 3"/>', bag: '<path d="M6 8h12l1 12H5zM9 8a3 3 0 016 0"/>',
  heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 017-2.5A4 4 0 0119 10c0 5.5-7 10-7 10z"/>', home: '<path d="M4 11l8-7 8 7M6 10v10h12V10"/>', gift: '<path d="M4 11h16v9H4zM3 8h18v3H3zM12 8v12M12 8c-3 0-4-4-1-4 2 0 1 4 1 4zM12 8c3 0 4-4 1-4-2 0-1 4-1 4z"/>',
  star: '<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>', basket: '<path d="M3 10h18l-2 10H5zM8 10l3-6M16 10l-3-6"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>', check: '<path d="M5 12.5l4.5 4.5L19 7"/>', x: '<path d="M6 6l12 12M18 6L6 18"/>', plus: '<path d="M12 5v14M5 12h14"/>', sliders: '<path d="M4 7h8M18 7h2M4 17h2M12 17h8"/><circle cx="15" cy="7" r="2.2"/><circle cx="9" cy="17" r="2.2"/>' };
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
  return s; 
}

const UNITS = ['szt', 'opak.', 'g', 'kg', 'ml', 'l'], ST = ['buy', 'bought', 'na'], STL = { buy: 'Do kupienia', bought: 'Kupione', na: 'Niedostępne' }, STI = { buy: '', bought: ic('check', 24), na: ic('x', 22) };
const mk = (name, color, icon, food, cats) => ({ id: uid(), name, color, icon, food, categories: cats.map(n => ({ id: uid(), name: n })) });
function seed() {
  const s = { v: 1, types: [
    mk('Spożywcze', '#B5EAD7', 'leaf', true, ['Warzywa', 'Owoce', 'Nabiał i roślinne zamienniki', 'Mięso i ryby', 'Pieczywo', 'Produkty sypkie i kasze', 'Makarony i ryż', 'Konserwy i słoiki', 'Mrożonki', 'Przyprawy i sosy', 'Przekąski i słodycze', 'Napoje', 'Chemia domowa']),
    mk('Drogeria', '#B7DEF8', 'bottle', false, ['Higiena', 'Pielęgnacja twarzy', 'Pielęgnacja ciała', 'Włosy', 'Zdrowie', 'Środki czystości']),
    mk('Hobby i papiernicze', '#D4C1FF', 'yarn', false, ['Włóczki i nici', 'Farby i pędzle', 'Papier i karton', 'Kleje i narzędzia', 'Ozdoby', 'Zeszyty i notesy', 'Długopisy i ołówki', 'Teczki i segregatory', 'Akcesoria biurowe']),
    mk('Inne', '#FFCFAE', 'bag', false, ['Ubrania', 'Rzeczy do domu', 'Drobiazgi', 'Różne'])],
    products: [], entries: [], sessions: [], cur: null };
  const ss = { id: uid(), name: 'Zakupy ' + new Date().toLocaleDateString('pl'), created: Date.now(), archived: false }; s.sessions.push(ss); s.cur = ss.id; return s;
}

const DB = { open: () => new Promise((ok, no) => { const r = indexedDB.open('zakupy', 1); r.onupgradeneeded = () => r.result.createObjectStore('kv'); r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); }),
  async get() { const d = await this.open(); return new Promise((ok, no) => { const r = d.transaction('kv').objectStore('kv').get('state'); r.onsuccess = () => ok(r.result); r.onerror = () => no(r.error); }); },
  async put(v) { const d = await this.open(); return new Promise((ok, no) => { const t = d.transaction('kv', 'readwrite'); t.objectStore('kv').put(v, 'state'); t.oncomplete = ok; t.onerror = () => no(t.error); }); } };

let S, view = 'all', filter = 'all', shopFilter = 'all', query = '', sortMode = 'alpha';
let lastDeleted = null, toastTimer = null;

async function save() { 
  try { await DB.put(JSON.parse(JSON.stringify(S))); } catch (e) { console.error(e); alert('Nie udało się zapisać danych: ' + e.message); } 
  render(); 
}

const type = id => S.types.find(t => t.id === id), prod = id => S.products.find(p => p.id === id);
const catName = (t, id) => (t?.categories.find(c => c.id === id)?.name) || 'Bez kategorii';
function modal(html) { $('#modal').innerHTML = html ? `<div class="sheet" id="sh"><div>${html}</div></div>` : ''; const sh = $('#sh'); if (sh) sh.onclick = e => { if (e.target === sh) modal(''); }; }
const fmt = n => n == null ? '?' : String(Math.round(n * 100) / 100).replace('.', ',');
const nutriText = r => `${fmt(r.kcal)}\u00A0kcal · B\u00A0${fmt(r.protein)}\u00A0g · T\u00A0${fmt(r.fat)}\u00A0g · W\u00A0${fmt(r.carbs)}\u00A0g · bł.\u00A0${fmt(r.fibre)}\u00A0g`;

function totalsBar(list) {
  const rs = list.filter(e => prod(e.productId).nutri || type(e.typeId).food).map(e => { const p = prod(e.productId); return p.nutri ? Nutrition.calc(p.nutri, e.qty, e.unit) : null; });
  if (!rs.length || rs.every(r => !r)) return '';
  const s = Nutrition.sum(rs), T = s.totals;
  return `<div class="item" style="display:block;background:#E4D9FF;color:#2E2A47;--c:#CDB9FF"><b>Razem: ${fmt(T.kcal)} kcal</b><br>białko ${fmt(T.protein)} g · tłuszcze ${fmt(T.fat)} g · węglowodany ${fmt(T.carbs)} g · błonnik ${fmt(T.fibre)} g` +
    (s.incomplete ? `<br><small>Uwaga: ${s.incomplete} z ${s.count} pozycji ma niepełne lub nieznane dane.</small>` : `<br><small>Suma dla pozycji widocznych na liście (${s.used}).</small>`) + `</div>`;
}
function nutriLine(e) { const p = prod(e.productId); if (!p?.nutri) return ''; const r = Nutrition.calc(p.nutri, e.qty, e.unit);
  if (!r) return `<span class="nu">Wartości odżywcze: brak przelicznika dla „${esc(e.unit)}”</span>`;
  return `<span class="nu">${nutriText(r)}</span>`; }

function removeEntry(id) {
  const idx = S.entries.findIndex(x => x.id === id);
  if (idx === -1) return;
  lastDeleted = { entry: S.entries[idx], index: idx };
  S.entries.splice(idx, 1);
  save();
  showToast();
}

function showToast() {
  const toast = $('#toast');
  toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.classList.remove('show'); lastDeleted = null; }, 4000);
}

$('#undoBtn').onclick = () => {
  if (!lastDeleted) return;
  vibrate();
  S.entries.splice(lastDeleted.index, 0, lastDeleted.entry);
  lastDeleted = null;
  $('#toast').classList.remove('show');
  if (toastTimer) clearTimeout(toastTimer);
  save();
};

function render() {
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
  
  if (!list.length) { $('#main').innerHTML = `<div class="empty">Brak produktów.<br>Dotknij „+”, aby dodać pierwszy.</div>`; return; }
  
  const groups = {}; 
  list.forEach(e => { const t = type(e.typeId), p = prod(e.productId), key = view === 'all' ? t.name + ' › ' + catName(t, p.catId) : catName(t, p.catId); (groups[key] ||= { t, items: [] }).items.push(e); });
  
  $('#main').innerHTML = totalsBar(list) + Object.keys(groups).sort(col.compare).map(k => `<h2><span class="pill" style="--c:${groups[k].t.color};--on:${onC(groups[k].t.color)}">${ic(groups[k].t.icon, 16)}${esc(k)}</span></h2>` +
    groups[k].items.sort((a, b) => sortMode === 'alpha' ? col.compare(prod(a.productId).name, prod(b.productId).name) : (a.added || 0) - (b.added || 0))
    .map(e => `<div class="item-wrapper"><div class="item ${e.status === 'bought' ? 'p' : ''}" style="--c:${type(e.typeId).color}" data-item-id="${e.id}">
    <button class="st ${e.status === 'bought' ? 'p' : e.status === 'na' ? 'n' : ''}" data-s="${e.id}" aria-label="${STL[e.status]}">${STI[e.status]}</button>
    <div class="t" data-e="${e.id}"><b>${esc(prod(e.productId).name)}</b><small>${esc(String(e.qty).replace('.', ','))} ${esc(e.unit)}${e.shop ? ' · 🏪 ' + esc(e.shop) : ''}${e.note ? ' · ' + esc(e.note) : ''} · ${STL[e.status]}</small>${nutriLine(e)}</div>
    <div class="acts">
      <div class="qty-ctrls"><button class="qty-btn" data-minus="${e.id}">-</button><button class="qty-btn" data-plus="${e.id}">+</button></div>
      <button class="ib" data-e="${e.id}" aria-label="Edytuj">${ic('pencil', 18)}</button><button class="ib del" data-d="${e.id}" aria-label="Usuń z listy">${ic('trash', 18)}</button>
    </div></div></div>`).join('')).join('');

  initSwipeGestures();
}

function openFilterModal() {
  vibrate();
  const sessionEntries = S.entries.filter(e => e.sessionId === S.cur);
  const shops = [...new Set(sessionEntries.map(e => e.shop).filter(Boolean))].sort(col.compare);

  modal(`<h3 style="margin:0">Filtry i widok</h3>
  
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

  $('#closeFilter').onclick = () => { vibrate(); modal(''); };
}

$('#filterToggle').onclick = openFilterModal;
$('#filterToggle').innerHTML = `${ic('sliders', 20)} Filtry`;

function initSwipeGestures() {
  document.querySelectorAll('.item').forEach(item => {
    let startX = 0, currentX = 0, isSwiping = false;
    const id = item.dataset.itemId;
    if (!id) return; // pasek „Razem” nie jest pozycją listy

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
  const b = e.target.closest('[data-v],[data-f],[data-s],[data-e],[data-d],[data-plus],[data-minus],[data-shop]'); 
  if (!b) return; const d = b.dataset;
  vibrate();
  if (d.v) { view = d.v; render(); openFilterModal(); } 
  else if (d.f) { filter = d.f; render(); openFilterModal(); }
  else if (d.shop) { shopFilter = d.shop; render(); openFilterModal(); }
  else if (d.s) { const en = S.entries.find(x => x.id === d.s); en.status = ST[(ST.indexOf(en.status) + 1) % 3]; save(); } 
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

$('#q').oninput = e => { query = e.target.value.trim(); render(); };
$('#sortMode').onchange = e => { sortMode = e.target.value; render(); };
$('#add').onclick = () => { vibrate(); entryForm(null); }; 
$('#cfg').onclick = () => { vibrate(); settings(); }; 
$('#cfg').innerHTML = ic('sliders', 24);

const opts = (arr, sel) => arr.map(([v, l]) => `<option value="${esc(v)}" ${v === sel ? 'selected' : ''}>${esc(l)}</option>`).join('');

function entryForm(id) {
  const en = id && S.entries.find(x => x.id === id), p0 = en && prod(en.productId);
  let catTouched = false, nutTouched = false, autoNut = false, autoSrc = '', typeId = en ? en.typeId : (view !== 'all' ? view : S.types[0].id), pid = p0 ? p0.id : null;
  const draw = () => { const t = type(typeId), p = pid && prod(pid), food = t.food;
    modal(`<h3 style="margin:0">${en ? 'Edytuj pozycję' : 'Dodaj produkt'}</h3>
    <label>Lista</label><select id="fT" ${en ? 'disabled' : ''}>${opts(S.types.map(t => [t.id, t.name]), typeId)}</select>
    <label>Nazwa produktu</label><input id="fN" value="${esc(p?.name || '')}" autocomplete="off"><div class="sug" id="sug"></div><div class="err" id="err"></div>
    <label>Kategoria</label><select id="fC">${opts(t.categories.map(c => [c.id, c.name]), p?.catId)}</select>
    <label>Sklep (opcjonalnie)</label><input id="fShop" value="${esc(en?.shop || p?.defaultShop || '')}" placeholder="np. Biedronka, Lidl, Rossmann" list="shopList"><datalist id="shopList"></datalist>
    <div class="g2"><div><label>Ilość</label><input id="fQ" inputmode="decimal" value="${en ? en.qty : 1}"></div><div><label>Jednostka</label><select id="fU">${opts(UNITS.map(u => [u, u]), en?.unit || (food ? 'szt' : 'szt'))}</select></div></div>
    <label>Notatka (opcjonalnie)</label><input id="fNote" value="${esc(en?.note || '')}">
    ${food ? `<label><input type="checkbox" id="showNut" style="width:auto;min-height:0"> Dodaj wartości odżywcze</label>` : ''}
    ${food ? `<div id="nutBox" style="display:none"> <label>Wartości odżywcze (opcjonalnie)</label><div class="g2"><div><label>Wartości na 100</label><select id="nB">${opts([['g', 'g'], ['ml', 'ml']], p?.nutri?.basis)}</select></div><div><label>Energia (kcal)</label><input id="nK" inputmode="decimal" placeholder="kcal" value="${p?.nutri?.values.kcal ?? ''}"></div></div>
    <div class="g2" style="margin-top:8px"><div><label>Białko (g)</label><input id="nP" inputmode="decimal" placeholder="białko (g)" value="${p?.nutri?.values.protein ?? ''}"></div><div><label>Tłuszcze (g)</label><input id="nT" inputmode="decimal" placeholder="tłuszcze (g)" value="${p?.nutri?.values.fat ?? ''}"></div></div>
    <div class="g2" style="margin-top:8px"><div><label>Węglowodany (g)</label><input id="nW" inputmode="decimal" placeholder="węglowodany (g)" value="${p?.nutri?.values.carbs ?? ''}"></div><div><label>Błonnik (g)</label><input id="nF" inputmode="decimal" placeholder="błonnik (g)" value="${p?.nutri?.values.fibre ?? ''}"></div></div><div id="live" class="nu" style="margin-top:6px"></div><div id="auto" class="nu" style="font-style:italic"></div>
    <small style="color:var(--mut)">Puste pole = nieznane (nie zero).</small></div>` : ''}
    <label>Status</label><select id="fS">${opts(ST.map(s => [s, STL[s]]), en?.status || 'buy')}</select>
    <button class="btn" id="ok">Zapisz</button>${en ? '<button class="btn s" id="rm">Usuń z listy</button>' : ''}<button class="btn s" id="cl">Anuluj</button>`);
    
    $('#shopList').innerHTML = [...new Set(S.entries.map(e => e.shop).concat(S.products.map(p => p.defaultShop)).filter(Boolean))].map(s => `<option value="${esc(s)}">`).join('');

    const num = v => { v = String(v).trim().replace(',', '.'); return v === '' || isNaN(+v) ? null : +v; };
    // Wartości odżywcze zapisują się tylko, gdy pole „Dodaj wartości odżywcze” jest zaznaczone
    const nut = () => { if (!food || !$('#showNut').checked) return null; const v = { kcal: num($('#nK').value), protein: num($('#nP').value), fat: num($('#nT').value), carbs: num($('#nW').value), fibre: num($('#nF').value) }; if (Object.values(v).every(x => x == null)) return null; return { basis: $('#nB').value, values: { ...(p?.nutri?.values || {}), ...v } }; };
    const live = () => { if (!food) return; const r = Nutrition.calc(nut(), num($('#fQ').value), $('#fU').value); $('#live').textContent = !nut() ? '' : r ? 'Razem: ' + nutriText(r) : 'Brak przelicznika dla tej jednostki'; };
    
    if (food) {
      const cb = $('#showNut'), box = $('#nutBox');
      if (cb && box) {
        const hasNutri = !!p?.nutri;
        cb.checked = hasNutri;
        box.style.display = hasNutri ? 'block' : 'none';
        cb.onchange = () => { box.style.display = cb.checked ? 'block' : 'none'; live(); };
      }
      ['#nB', '#nK', '#nP', '#nT', '#nW', '#nF'].forEach(s => $(s).oninput = () => { nutTouched = true; autoNut = false; $('#auto').textContent = ''; live(); });
      ['#fQ', '#fU'].forEach(s => $(s).oninput = live);
      live();
    }
    
    $('#fT').onchange = e => { typeId = e.target.value; pid = null; catTouched = nutTouched = autoNut = false; draw(); };
    $('#fC').onchange = () => catTouched = true;
    
    const updateSug = () => {
      const recents = S.products.filter(x => x.typeId === typeId).sort((a, b) => (b.usedCount || 0) - (a.usedCount || 0)).slice(0, 6);
      $('#sug').innerHTML = recents.map(x => `<button class="chip f" data-p="${x.id}">⭐ ${esc(x.name)}</button>`).join('');
      $('#sug').querySelectorAll('[data-p]').forEach(b => b.onclick = () => { 
        vibrate(); pid = b.dataset.p; const pp = prod(pid); 
        $('#fN').value = pp.name; $('#fC').value = pp.catId; 
        if (pp.defaultShop) $('#fShop').value = pp.defaultShop;
        else { const last = S.entries.slice().reverse().find(e => e.productId === pp.id && e.shop); if (last) $('#fShop').value = last.shop; }
        updateSug(); if (pp.nutri) draw(); 
      });
    };

    const autoFill = name => { 
      const nm = name.trim(), sp = nm && S.products.find(x => x.typeId === typeId && Foods.norm(x.name) === Foods.norm(nm));
      const f = nm && Foods.find(nm, t.categories.map(c => c.name)), fCat = f && t.categories.find(c => c.name === f.cat)?.id;
      const catId = sp?.catId || fCat, n = sp?.nutri || f?.n;
      if (!catTouched && catId && t.categories.some(c => c.id === catId)) $('#fC').value = catId;
      
      if (sp?.defaultShop) $('#fShop').value = sp.defaultShop;
      else if (nm) {
        const found = S.products.find(x => Foods.norm(x.name) === Foods.norm(nm));
        const last = S.entries.slice().reverse().find(e => found && e.productId === found.id && e.shop);
        if (last) $('#fShop').value = last.shop;
      }

      if (!food) return; const set = (id, v) => $(id).value = v ?? '';
      if (n && !nutTouched) { const v = n.values; $('#nB').value = n.basis; set('#nK', v.kcal); set('#nP', v.protein); set('#nT', v.fat); set('#nW', v.carbs); set('#nF', v.fibre); autoNut = true; autoSrc = sp?.nutri ? 'saved' : 'table'; $('#showNut').checked = true; $('#nutBox').style.display = 'block'; }
      else if (!n && autoNut && !nutTouched) { ['#nK', '#nP', '#nT', '#nW', '#nF'].forEach(i => set(i, '')); autoNut = false; }
      $('#auto').textContent = !autoNut ? '' : autoSrc === 'saved' ? 'Wartości z zapisanego produktu.' : 'Wartości uzupełnione automatycznie z wbudowanej tabeli.'; live(); 
    };

    $('#fN').oninput = e => { 
      const q = e.target.value.trim().toLowerCase(); 
      if (!en) pid = null; 
      if (!en && !pid) autoFill(e.target.value); 
      const m = q ? S.products.filter(x => x.typeId === typeId && x.name.toLowerCase().includes(q)).sort((a, b) => col.compare(a.name, b.name)).slice(0, 6) : [];
      if (!q) updateSug();
      else {
        $('#sug').innerHTML = m.map(x => `<button class="chip f" data-p="${x.id}">${esc(x.name)} · ${esc(catName(t, x.catId))}</button>`).join(''); 
        $('#sug').querySelectorAll('[data-p]').forEach(b => b.onclick = () => { vibrate(); pid = b.dataset.p; const pp = prod(pid); $('#fN').value = pp.name; $('#fC').value = pp.catId; if (pp.defaultShop) $('#fShop').value = pp.defaultShop; $('#sug').innerHTML = ''; if (pp.nutri) draw(); }); 
      }
    };

    if (!en) updateSug();

    $('#cl').onclick = () => { vibrate(); modal(''); };
    if (en) $('#rm').onclick = () => { vibrate(); removeEntry(en.id); modal(''); };
    
    $('#ok').onclick = () => { 
      vibrate();
      const name = $('#fN').value.trim(), qty = num($('#fQ').value), shop = $('#fShop').value.trim();
      if (!name) return $('#err').textContent = 'Podaj nazwę produktu.'; 
      if (!(qty > 0)) return $('#err').textContent = 'Ilość musi być większa od zera.';
      let p = pid && prod(pid); 
      if (!p) p = S.products.find(x => x.typeId === typeId && col.compare(x.name, name) === 0);
      if (!p) { p = { id: uid(), typeId, name }; S.products.push(p); } 
      p.name = name; p.catId = $('#fC').value; p.defaultShop = shop; p.usedCount = (p.usedCount || 0) + 1;
      if (food) p.nutri = nut();
      if (!en && S.entries.some(x => x.sessionId === S.cur && x.productId === p.id && x.status !== 'bought') && !confirm('Ten produkt jest już na liście. Dodać mimo to?')) return;
      const f = { productId: p.id, typeId, qty, unit: $('#fU').value, shop, note: $('#fNote').value.trim(), status: $('#fS').value, added: en?.added || Date.now() };
      if (en) Object.assign(en, f); else S.entries.push({ id: uid(), sessionId: S.cur, ...f }); 
      modal(''); save(); 
    }; 
  };
  draw();
}

function settings() {
  const hist = S.sessions.filter(s => s.archived).length;
  modal(`<h3 style="margin:0">Ustawienia</h3>
  <button class="btn" id="share">Udostępnij listę tekstowo</button>
  <button class="btn s" id="end">Zakończ zakupy / nowa lista</button>
  <button class="btn s" id="types">Rodzaje list i kategorie</button>
  <button class="btn s" id="exp">Eksportuj kopię zapasową (JSON)</button>
  <label class="btn s" style="display:flex;align-items:center;justify-content:center">Przywróć z kopii<input id="imp" type="file" accept=".json,application/json" hidden></label>
  <p style="color:var(--mut);font-size:14px">Dane są tylko na tym urządzeniu. Zarchiwizowane sesje: ${hist}.</p><button class="btn s" id="cl">Zamknij</button>`);
  
  $('#cl').onclick = () => { vibrate(); modal(''); }; 
  $('#types').onclick = () => { vibrate(); typesEditor(); }; 
  $('#end').onclick = () => { vibrate(); endSession(); };
  
  $('#share').onclick = async () => {
    vibrate();
    const list = S.entries.filter(e => e.sessionId === S.cur && e.status === 'buy');
    if (!list.length) { alert('Brak produktów do kupienia na liście!'); return; }
    const groups = {};
    list.forEach(e => { const t = type(e.typeId), p = prod(e.productId), key = t.name + ' › ' + catName(t, p.catId); (groups[key] ||= []).push(`- ${p.name} (${e.qty} ${e.unit})${e.shop ? ' [🏪 ' + e.shop + ']' : ''}${e.note ? ' [' + e.note + ']' : ''}`); });
    let text = '🛒 Lista zakupów:\n\n';
    for (const [k, items] of Object.entries(groups)) text += `*${k}*:\n` + items.join('\n') + '\n\n';
    if (navigator.share) { try { await navigator.share({ title: 'Lista zakupów', text }); } catch {} }
    else { navigator.clipboard.writeText(text); alert('Skopiowano listę do schowka!'); }
  };

  $('#exp').onclick = () => { vibrate(); const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], { type: 'application/json' })); a.download = 'zakupy-' + new Date().toISOString().slice(0, 10) + '.json'; a.click(); };
  $('#imp').onchange = async e => { vibrate(); try { const d = JSON.parse(await e.target.files[0].text()); if (!d.types || !d.products || !d.entries || !d.sessions) throw 0;
    if (!confirm('Przywrócenie ZASTĄPI obecne dane. Kontynuować?')) return; S = mig(d); view = 'all'; modal(''); save(); } catch { alert('Niepoprawna kopia zapasowa.'); } };
}

function endSession() {
  const na = S.entries.filter(e => e.sessionId === S.cur && e.status === 'na').length, buy = S.entries.filter(e => e.sessionId === S.cur && e.status === 'buy').length;
  modal(`<h3 style="margin:0">Zakończ zakupy</h3><p>Niedostępne: <b>${na}</b>, do kupienia: <b>${buy}</b>.</p>
  <label><input type="checkbox" id="cn" checked style="width:auto;min-height:0"> Przenieś niedostępne do nowej listy</label>
  <label><input type="checkbox" id="cb" checked style="width:auto;min-height:0"> Przenieś też „do kupienia”</label>
  <button class="btn" id="go">Zarchiwizuj i utwórz nową</button><button class="btn s" id="cl">Anuluj</button>`);
  $('#cl').onclick = () => { vibrate(); modal(''); }; 
  $('#go').onclick = () => { 
    vibrate();
    const n = { id: uid(), name: 'Zakupy ' + new Date().toLocaleDateString('pl'), created: Date.now(), archived: false }, cn = $('#cn').checked, cb = $('#cb').checked;
    const carry = S.entries.filter(e => e.sessionId === S.cur && ((cn && e.status === 'na') || (cb && e.status === 'buy')));
    carry.forEach(e => { if (!S.entries.some(x => x.sessionId === n.id && x.productId === e.productId)) S.entries.push({ ...e, id: uid(), sessionId: n.id, status: 'buy' }); });
    S.sessions.find(s => s.id === S.cur).archived = true; S.sessions.push(n); S.cur = n.id; modal(''); save(); 
  };
}

function typesEditor() {
  modal(`<h3 style="margin:0">Rodzaje list</h3>` + S.types.map(t => `<div class="item" style="margin:6px 0"><div class="t"><b>${ic(t.icon, 18)} ${esc(t.name)}</b><small>${t.categories.length} kategorii</small></div><button class="chip f" data-et="${t.id}">Edytuj</button></div>`).join('') +
    `<button class="btn" id="nt">Nowy rodzaj listy</button><button class="btn s" id="cl">Wróć</button>`);
  $('#cl').onclick = () => { vibrate(); settings(); }; 
  $('#nt').onclick = () => { vibrate(); editType(null); }; 
  document.querySelectorAll('[data-et]').forEach(b => b.onclick = () => { vibrate(); editType(b.dataset.et); });
}

function editType(id) {
  const t = id ? type(id) : { name: '', color: '#FFB5CC', icon: 'bag', food: false, categories: [] };
  modal(`<h3 style="margin:0">${id ? 'Edytuj listę' : 'Nowa lista'}</h3><label>Nazwa</label><input id="tn" value="${esc(t.name)}"><div class="g2"><div><label>Ikona</label><select id="ti">${opts(ICON_KEYS.map(k => [k, ICONL[k]]), t.icon)}</select></div><div><label>Kolor</label><input id="tc" type="color" value="${t.color}"></div></div>
  <label><input type="checkbox" id="tf" ${t.food ? 'checked' : ''} style="width:auto;min-height:0"> Produkty spożywcze (wartości odżywcze)</label>
  <label>Kategorie (jedna w wierszu)</label><textarea id="tk" rows="8">${esc(t.categories.map(c => c.name).join('\n'))}</textarea><div class="err" id="err"></div>
  <button class="btn" id="ok">Zapisz</button>${id ? '<button class="btn d" id="del">Usuń listę</button>' : ''}<button class="btn s" id="cl">Anuluj</button>`);
  $('#cl').onclick = () => { vibrate(); typesEditor(); };
  $('#ok').onclick = () => { 
    vibrate();
    const name = $('#tn').value.trim(); if (!name) return $('#err').textContent = 'Podaj nazwę listy.';
    const names = $('#tk').value.split('\n').map(x => x.trim()).filter(Boolean), old = id ? t.categories : [];
    const cats = names.map((n, i) => ({ id: old[i]?.id || uid(), name: n }));
    if (id) { const gone = old.slice(cats.length); if (gone.some(c => S.products.some(p => p.catId === c.id)) && !confirm('Usuwane kategorie mają produkty — trafią do „Bez kategorii”. Kontynuować?')) return; gone.forEach(c => S.products.forEach(p => { if (p.catId === c.id) p.catId = null; })); }
    Object.assign(t, { name, icon: $('#ti').value || 'bag', color: $('#tc').value, food: $('#tf').checked, categories: cats }); if (!id) { t.id = uid(); S.types.push(t); } save().then(typesEditor); 
  };
  if (id) $('#del').onclick = () => { 
    vibrate();
    if (!confirm(`Usunąć listę „${t.name}” wraz z produktami?`)) return;
    S.types = S.types.filter(x => x.id !== id); S.products = S.products.filter(p => p.typeId !== id); S.entries = S.entries.filter(e => e.typeId !== id); if (view === id) view = 'all'; save().then(typesEditor); 
  };
}

(async () => { 
  try { S = await DB.get(); if (!S) { S = seed(); await DB.put(S); } } catch { S = seed(); }
  mig(S); 
  try { await DB.put(JSON.parse(JSON.stringify(S))); } catch {}
  if (navigator.storage?.persist) navigator.storage.persist(); 
  render();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {}); 
})();
