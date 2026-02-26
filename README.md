# Eddie rechnet (eddie_does_the_maths)

<p align="center">
  <img src="./cover.jpg" alt="Eddie rechnet" width="560" />
</p>

Mathe, aber in Eddie-Logik: kein trockenes Tafel-Gekrakel, sondern ein Plan. Mit Variablen. Und Auswegen.

Das hier ist eine kleine Vue/Vite-App, die Themen aus *Eddie rechnet* als interaktive Seiten baut.

## Was drinsteckt

- Vue 3 + Vite + Vuetify
- KaTeX für Formeln (aus `node_modules`, Fonts werden beim Build mitgenommen)
- Hash-Routing (`/#/...`), damit das Ding auch als statische Dateien funktioniert

## Entwickeln

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Output landet standardmäßig in `@/dist/math/` (abhängig von `VITE_PUBLIC_BASE`).

## Neue Themen hinzufügen (Checkliste)

1. Neue View unter `eddie_does_the_maths/src/views/` anlegen.
2. Route in `eddie_does_the_maths/src/router.js` eintragen.
3. `meta: { title, index: true, order }` setzen, dann taucht es im Index auf.
4. Formeln über `<Katex ... />` reinwerfen.
5. 
## Lizenz

Dieses Subprojekt `eddie_does_the_maths` steht unter der MIT-Lizenz.
Siehe `LICENSE`.
