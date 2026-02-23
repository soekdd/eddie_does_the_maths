# SSG Deployment Notes

## Router/URLs (createWebHistory)
- Die App nutzt jetzt History-URLs ohne `#`.
- Für Client-Navigation auf Unterseiten (z. B. `/FI`) braucht der Server eine Fallback-Regel auf die passende statische Seite oder auf den SPA-Entry.
- Die Public Base wird über `VITE_PUBLIC_BASE` gesteuert (mit führendem und abschließendem `/`).
- Standard-Build (`npm run build`) nutzt jetzt `/math/`.
- Für andere Unterverzeichnisse: `VITE_PUBLIC_BASE=/dein-pfad/ npm run build`.

## Statische Auslieferung
- Beim SSG-Build werden pro Route HTML-Dateien erzeugt (`dist/<route>/index.html`).
- Hosting sollte den kompletten `dist`-Ordner unverändert ausliefern.

## Catch-all/Fallback
- Die Catch-all-Route (`/:pathMatch(.*)*`) wird nicht explizit vorgerendert.
- Falls ein Hosting-Provider keine direkte Datei findet, sollte ein Catch-all/Fallback auf die App greifen, damit Client-Routing weiter funktioniert.
