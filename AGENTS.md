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
