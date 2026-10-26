const { calc } = require('./nutrition.js'); const assert = require('assert');
const tofu = { basis: 'g', values: { kcal: 140, protein: 15, fibre: 1 } };
assert.deepStrictEqual(calc(tofu, 180, 'g'), { kcal: 252, protein: 27, fibre: 1.8 });
assert.deepStrictEqual(calc(tofu, 0.18, 'kg'), { kcal: 252, protein: 27, fibre: 1.8 });
assert.strictEqual(calc(tofu, 2, 'szt'), null);                       // brak przelicznika
assert.strictEqual(calc({ basis: 'ml', values: { kcal: 40 } }, 1, 'kg'), null);
assert.strictEqual(calc({ basis: 'g', values: { kcal: 100, fibre: null } }, 50, 'g').fibre, null); // nieznane != 0
assert.strictEqual(calc(null, 100, 'g'), null);
const c = new Intl.Collator('pl'); assert.deepStrictEqual(['Zebra','Łosoś','Ser','Ćwikła','Cebula'].sort(c.compare), ['Cebula','Ćwikła','Łosoś','Ser','Zebra']);
const r1 = calc({ basis: 'g', values: { kcal: 140, protein: 15, fat: 8, carbs: 2, fibre: 1 } }, 180, 'g');
assert.deepStrictEqual(r1, { kcal: 252, protein: 27, fat: 14.4, carbs: 3.6, fibre: 1.8 });
const sm = require('./nutrition.js').sum([r1, r1, null]);
assert.deepStrictEqual(sm.totals, { kcal: 504, protein: 54, fat: 28.8, carbs: 7.2, fibre: 3.6 });
assert.strictEqual(sm.used, 2); assert.strictEqual(sm.incomplete, 1); assert.strictEqual(sm.count, 3);
const F = require('./foods.js'), cats = ['Warzywa','Nabiał i roślinne zamienniki','Owoce'];
assert.strictEqual(F.find('Tofu naturalne', cats).cat, 'Nabiał i roślinne zamienniki');
assert.strictEqual(F.find('Marchewki', cats).cat, 'Warzywa'); assert.strictEqual(F.find('Marchewki', cats).n.values.kcal, 41);
assert.strictEqual(F.find('Mleko sojowe', cats).n.basis, 'ml'); assert.strictEqual(F.find('mleko sojowe', cats).n.values.kcal, 40); // dłuższe dopasowanie wygrywa
assert.strictEqual(F.find('Ogórek', cats).cat, 'Warzywa'); assert.strictEqual(F.find('Łosoś', ['Mięso i ryby']).cat, 'Mięso i ryby');
assert.strictEqual(F.find('papier toaletowy', ['Higiena', 'Papier i karton']).cat, 'Higiena');
assert.strictEqual(F.find('Blablabla XYZ', cats), null);          // nieznany produkt: brak zgadywania
assert.strictEqual(F.find('szampon', cats), null);                // kategoria nie istnieje na tej liście
console.log('OK: wszystkie testy przeszły');
