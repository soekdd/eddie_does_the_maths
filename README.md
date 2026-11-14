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

## Deployment per GitHub Actions

Der Workflow `Build and deploy math` startet ausschließlich über **Actions → Build and deploy math → Run workflow**. Er baut `dist/math/` und überträgt nur diesen Ordner nach `soek.de:/var/www/soek.de/eddie/math/`.

Für das Repository werden die Secrets `DEPLOY_SSH_KEY`, `DEPLOY_KNOWN_HOSTS` und `DEPLOY_USER` benötigt. Optional kann die Variable `DEPLOY_PORT` gesetzt werden (Standard: `22`). Der Deploy-Job nutzt die Umgebung `production`.

PDFs (`dist/.pdf-cache/math`) und Thumbnails (`public/thumbnails`) werden mit einem Schlüssel aus den Build-Eingaben zwischengespeichert. Ein erneuter manueller Lauf mit unveränderten Eingaben verwendet denselben Cache.

## Neue Themen hinzufügen (Checkliste)

1. Neues Thema unter `eddie_does_the_maths/src/book<n>/` anlegen.
2. Route in `eddie_does_the_maths/src/router.js` eintragen.
3. `meta: { title, index: true, order }` setzen, dann taucht es im Index auf.
4. Formeln über `<Katex ... />` reinwerfen.
5. 
## Lizenz

Dieses Subprojekt `eddie_does_the_maths` steht unter der MIT-Lizenz.
Siehe `LICENSE`.
