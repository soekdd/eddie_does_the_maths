# AGENTS.md (eddie_does_the_maths)

## Ziel
Einheitliche Kapitelstruktur in allen zweistelligen View-Dateien (`src/views/??.vue`, z. B. `O1.vue`, `DG.vue`, `FI.vue`).

## Strukturregeln für `#descriptionPart`
1. Hauptkapitel immer als `<h2>`.
2. Hauptkapitel immer im Format `Teil N - Titel` (fortlaufend, beginnend bei `Teil 1`).
3. Keine Hauptkapitel-Nummerierung mit `1)`, `2)`, `3)`.
4. Unterkapitel als `<h3>`.
5. Nummerierte Unterkapitel im Format `Schritt N.M - ...` oder `Stufe X - ...`.
6. `id`-Attribute für Ankerlinks beibehalten; nur ergänzen, wenn sinnvoll und konfliktfrei.

## Zusätzliche Konventionen
1. `#interactivePart` und `#calculationPart` werden nicht als `Teil N` mitgezählt.
2. Bestehende mathematische Inhalte, Formeln und Beweisideen bleiben unverändert.
3. Änderungen sollen minimalinvasiv bleiben: primär Überschriftenstruktur und Benennung.

## Referenz
`src/views/O1.vue` ist die stilistische Referenz für Kapitel-/Schrittbenennung.

## SSG Deployment Notes

### Router/URLs (createWebHistory)

- Für Client-Navigation auf Unterseiten (z. B. `/FI`) braucht der Server eine Fallback-Regel auf die passende statische Seite oder auf den SPA-Entry.
- Die Public Base wird über `VITE_PUBLIC_BASE` gesteuert (mit führendem und abschließendem `/`).
- Standard-Build (`npm run build`) nutzt jetzt `/math/`.
- Für andere Unterverzeichnisse: `VITE_PUBLIC_BASE=/dein-pfad/ npm run build`.

### Statische Auslieferung

- Beim SSG-Build werden pro Route HTML-Dateien erzeugt (`dist/<base>/<route>/index.html`, standardmäßig `dist/math/<route>/index.html`).
- Hosting sollte den kompletten `dist`-Ordner unverändert ausliefern.

### Catch-all/Fallback

- Die Catch-all-Route (`/:pathMatch(.*)*`) wird nicht explizit vorgerendert.
- Falls ein Hosting-Provider keine direkte Datei findet, sollte ein Catch-all/Fallback auf die App greifen, damit Client-Routing weiter funktioniert.
