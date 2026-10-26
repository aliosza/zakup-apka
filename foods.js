// Wbudowana, OFFLINE tabela typowych produktów: podpowiada kategorię i ORIENTACYJNE wartości na 100 g / 100 ml.
// Wartości są uśrednione dla produktów surowych/generycznych (nie dla konkretnej marki) – sprawdź z opakowaniem.
// Format: [słowa kluczowe (bez polskich znaków, rozdzielone |), kategorie (pierwsza istniejąca na liście), jednostka bazowa, kcal, białko, tłuszcze, węglowodany, błonnik]
(function (root) {
  const D = [
    ['tofu', 'Nabiał i roślinne zamienniki', 'g', 130, 14, 7.5, 1.5, 1], ['mleko sojow', 'Nabiał i roślinne zamienniki', 'ml', 40, 3.3, 1.8, 1, 0.5],
    ['mleko owsian', 'Nabiał i roślinne zamienniki', 'ml', 45, 0.5, 1.5, 7, 0.8], ['mleko', 'Nabiał i roślinne zamienniki', 'ml', 50, 3.4, 2, 4.8, 0],
    ['jogurt', 'Nabiał i roślinne zamienniki', 'g', 61, 3.5, 3.3, 4.7, 0], ['ser zolty|gouda|edamer', 'Nabiał i roślinne zamienniki', 'g', 350, 25, 27, 0.5, 0],
    ['twarog', 'Nabiał i roślinne zamienniki', 'g', 110, 18, 2.5, 3.5, 0], ['maslo', 'Nabiał i roślinne zamienniki', 'g', 717, 0.9, 81, 0.1, 0],
    ['jajk|jaja', 'Nabiał i roślinne zamienniki', 'g', 143, 12.6, 9.5, 0.7, 0],
    ['marchew', 'Warzywa', 'g', 41, 0.9, 0.2, 9.6, 2.8], ['ziemniak', 'Warzywa', 'g', 77, 2, 0.1, 17, 2.2], ['cebul', 'Warzywa', 'g', 40, 1.1, 0.1, 9.3, 1.7],
    ['pomidor', 'Warzywa', 'g', 18, 0.9, 0.2, 3.9, 1.2], ['ogorek|ogorki', 'Warzywa', 'g', 15, 0.7, 0.1, 3.6, 0.5], ['papryk', 'Warzywa', 'g', 31, 1, 0.3, 6, 2.1],
    ['brokul', 'Warzywa', 'g', 34, 2.8, 0.4, 6.6, 2.6], ['szpinak', 'Warzywa', 'g', 23, 2.9, 0.4, 3.6, 2.2], ['salat', 'Warzywa', 'g', 15, 1.4, 0.2, 2.9, 1.3],
    ['czosnek', 'Warzywa', 'g', 149, 6.4, 0.5, 33, 2.1], ['cukini', 'Warzywa', 'g', 17, 1.2, 0.3, 3.1, 1], ['kapust', 'Warzywa', 'g', 25, 1.3, 0.1, 5.8, 2.5],
    ['jablk', 'Owoce', 'g', 52, 0.3, 0.2, 14, 2.4], ['banan', 'Owoce', 'g', 89, 1.1, 0.3, 23, 2.6], ['pomarancz', 'Owoce', 'g', 47, 0.9, 0.1, 12, 2.4],
    ['cytryn', 'Owoce', 'g', 29, 1.1, 0.3, 9.3, 2.8], ['truskawk', 'Owoce', 'g', 32, 0.7, 0.3, 7.7, 2], ['awokado', 'Owoce', 'g', 160, 2, 15, 9, 6.7],
    ['piers z kurczaka|kurczak', 'Mięso i ryby', 'g', 120, 22, 2.6, 0, 0], ['losos', 'Mięso i ryby', 'g', 208, 20, 13, 0, 0], ['dorsz', 'Mięso i ryby', 'g', 82, 18, 0.7, 0, 0],
    ['tunczyk', 'Konserwy i słoiki|Mięso i ryby', 'g', 116, 26, 1, 0, 0],
    ['chleb', 'Pieczywo', 'g', 250, 8, 2, 48, 3.5], ['bulk', 'Pieczywo', 'g', 280, 9, 1.5, 56, 2.5],
    ['ryz', 'Makarony i ryż', 'g', 350, 7, 0.6, 78, 1.3], ['makaron', 'Makarony i ryż', 'g', 360, 13, 1.5, 72, 3],
    ['kasza gryczan', 'Produkty sypkie i kasze', 'g', 340, 12.6, 3.3, 71.5, 10], ['platki owsiane', 'Produkty sypkie i kasze', 'g', 372, 13.5, 7, 60, 10],
    ['make|maka', 'Produkty sypkie i kasze', 'g', 350, 10, 1, 73, 3], ['soczewic', 'Produkty sypkie i kasze', 'g', 350, 25, 1.5, 60, 11],
    ['ciecierzyc', 'Konserwy i słoiki', 'g', 125, 7, 2.5, 17, 5], ['fasol', 'Konserwy i słoiki', 'g', 95, 6.5, 0.5, 13, 6],
    ['oliwa', 'Przyprawy i sosy', 'ml', 810, 0, 91, 0, 0], ['cukier', 'Przyprawy i sosy', 'g', 400, 0, 0, 100, 0],
    ['migdal', 'Przekąski i słodycze', 'g', 579, 21, 50, 22, 12.5], ['orzechy wloskie', 'Przekąski i słodycze', 'g', 654, 15, 65, 14, 6.7], ['maslo orzechowe', 'Przekąski i słodycze', 'g', 600, 25, 50, 15, 6],
    ['sok jablkowy', 'Napoje', 'ml', 46, 0.1, 0.1, 11, 0.2], ['woda', 'Napoje', 'ml', 0, 0, 0, 0, 0],
    ['plyn do naczyn|proszek do prania|plyn do plukania|gabk', 'Chemia domowa|Środki czystości'],
    ['papier toaletow|pasta do zebow|szczoteczk|mydlo|dezodorant|chusteczk', 'Higiena'], ['szampon|odzywk', 'Włosy'], ['krem do twarzy|serum|tonik', 'Pielęgnacja twarzy'],
    ['balsam|krem do rak|krem do ciala', 'Pielęgnacja ciała'], ['plaster|witamin|tabletk', 'Zdrowie'],
    ['dlugopis|olowek|marker|pisak|zakreslacz', 'Długopisy i ołówki'], ['zeszyt|notes|kalendarz', 'Zeszyty i notesy'], ['teczk|segregator', 'Teczki i segregatory'],
    ['wloczk|kordonek|nici|igl', 'Włóczki i nici'], ['farb|pedzel|akwarel', 'Farby i pędzle'], ['papier|karton|bibul', 'Papier i karton'], ['klej|nozyczk|tasma', 'Kleje i narzędzia'],
    // Dodane słowa kluczowe dla nowej kategorii "Inne"
    ['koszul|spodni|bluzk|skarpet|bielizn|kurtk|but', 'Ubrania'],
    ['poduszk|koc|posciel|swiec|wazon|ramk|wieszak', 'Rzeczy do domu'],
    ['baterii|zapalniczk|brelok|latark', 'Drobiazgi']
  ];
  const norm = s => s.toLowerCase().replace(/ł/g, 'l').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();
  // Zwraca {cat, n:{basis,values}|null} albo null, gdy tabela NIE zna produktu (wtedy aplikacja niczego nie zgaduje).
  function find(name, catNames) {
    const s = ' ' + norm(name), hits = [];
    for (const d of D) for (const kw of d[0].split('|')) if (s.includes(' ' + kw)) hits.push({ len: kw.length, d });
    hits.sort((a, b) => b.len - a.len);
    for (const { d } of hits) {
      const cat = d[1].split('|').find(c => !catNames || catNames.includes(c)); if (!cat) continue;
      return { cat, n: d.length > 3 ? { basis: d[2], values: { kcal: d[3], protein: d[4], fat: d[5], carbs: d[6], fibre: d[7] } } : null };
    }
    return null;
  }
  const api = { find, norm }; if (typeof module !== 'undefined') module.exports = api; else root.Foods = api;
})(this);
