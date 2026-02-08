# Eddie rechnet (eddie_does_the_maths)

<p align="center">
  <img src="./src/images/welcome.webp" alt="Eddie rechnet" width="560" />
</p>

Mathe, aber in Eddie-Logik: kein trockenes Tafel-Gekrakel, sondern ein Plan. Mit Variablen. Und Auswegen.

Das hier ist eine kleine Vue/Vite-App, die Themen aus *Eddie rechnet* als interaktive Seiten baut.

## Was drinsteckt

- Vue 3 + Vite + Vuetify
- KaTeX fuer Formeln (aus `node_modules`, Fonts werden beim Build mitgenommen)
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

Output landet in `@/dist/`.

## Neue Themen hinzufuegen (Eddie-Checkliste)

1. Neue View unter `eddie_does_the_maths/src/views/` anlegen.
2. Route in `eddie_does_the_maths/src/router.js` eintragen.
3. `meta: { title, index: true, order }` setzen, dann taucht es im Index auf.
4. Formeln ueber `<Katex ... />` reinwerfen.

## Troubleshooting (aka: Mathe ist manchmal kalt)

- Seite leer? Du bist wahrscheinlich ohne Hash gelandet. Richtig ist `/#/DG` statt `/DG`.
- Formeln sehen aus wie 1996? Check `eddie_does_the_maths/src/main.js`: `import 'katex/dist/katex.min.css'`.
- Titel passt mobil nicht in die App-Bar? Eddie nimmt sich Platz. Guck in `eddie_does_the_maths/src/App.vue`.
