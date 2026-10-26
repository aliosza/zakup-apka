// Czyste funkcje liczące wartości odżywcze (bez UI). Testowane w test.js
(function (root) {
  function toBase(qty, unit, basis) {
    if (basis === 'g') { if (unit === 'g') return qty; if (unit === 'kg') return qty * 1000; }
    if (basis === 'ml') { if (unit === 'ml') return qty; if (unit === 'l') return qty * 1000; }
    return null; // sztuki/opakowania: brak przelicznika
  }
  // nutri = { basis:'g'|'ml', values:{ kcal, protein, fibre, ...dowolne } }
  function calc(nutri, qty, unit) {
    if (!nutri || !(qty > 0)) return null;
    const a = toBase(qty, unit, nutri.basis);
    if (a == null) return null;
    const out = {};
    for (const k of Object.keys(nutri.values)) {
      const v = nutri.values[k];
      out[k] = (v == null || v === '') ? null : Math.round((a / 100) * v * 100) / 100; // null = nieznane
    }
    return out;
  }
  const KEYS = ['kcal', 'protein', 'fat', 'carbs', 'fibre'];
  // results: tablica wyników calc() (lub null gdy brak danych/przelicznika)
  function sum(results) {
    const totals = {}; KEYS.forEach(k => totals[k] = 0);
    let used = 0, incomplete = 0;
    for (const r of results) {
      if (!r) { incomplete++; continue; }
      used++; let missing = false;
      for (const k of KEYS) { if (r[k] == null) missing = true; else totals[k] += r[k]; }
      if (missing) incomplete++;
    }
    KEYS.forEach(k => totals[k] = Math.round(totals[k] * 100) / 100);
    return { totals, used, incomplete, count: results.length };
  }
  const api = { toBase, calc, sum, KEYS };
  if (typeof module !== 'undefined') module.exports = api; else root.Nutrition = api;
})(this);
