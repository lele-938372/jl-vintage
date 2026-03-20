# Schnellstart fur lokale Entwicklung

```bash
npm install

# .env.local erstellen:
cp .env.example .env.local
# JWT_SECRET bearbeiten (beliebiger langer String)
# Rest kann leer bleiben fur lokales Testen

npm run dev
# -> http://localhost:3000
```

Im Dev-Modus ohne E-Mail-Konfiguration:
- Nach Registrierung wird der Verifikationscode direkt in der URL angezeigt (devCode Parameter)
- Produkte werden beim ersten Seitenbesuch automatisch angelegt (In-Memory-Speicher)
