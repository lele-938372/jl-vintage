# JL VINTAGE

Kuratierter Vintage-Shop von Leandro & Justin.

## Setup auf Vercel

### 1. Repo auf GitHub pushen
```bash
cd jl-vintage
git init
git add .
git commit -m "JL Vintage initial"
git remote add origin https://github.com/DEIN_USER/jl-vintage.git
git push -u origin main
```

### 2. Auf vercel.com importieren
- New Project > GitHub Repo importieren
- Framework: Next.js (wird automatisch erkannt)

### 3. Storage: Vercel KV anlegen
- Vercel Dashboard > Storage > Create Database > KV
- Im Projekt verbinden -> automatisch als Env-Vars hinzugefugt

### 4. Umgebungsvariablen setzen
In Vercel > Settings > Environment Variables:

| Variable | Wert | Beschreibung |
|---|---|---|
| `JWT_SECRET` | (langer zufallsstring) | Token-Signing |
| `RESEND_API_KEY` | `re_...` | E-Mail (gratis auf resend.com) |
| `RESEND_FROM_EMAIL` | `noreply@jlvintage.com` | Absender-Adresse |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | Deine PayPal Client ID | PayPal Sandbox/Live |
| `NEXT_PUBLIC_SITE_URL` | `https://jlvintage.vercel.app` | Deine Vercel-URL |

### 5. E-Mail (Resend)
- Gratis-Account auf resend.com
- Domain verifizieren ODER testweise eure eigene Gmail nutzen
- API Key kopieren -> in Vercel Env einfugen

### 6. PayPal
- developer.paypal.com -> My Apps -> Create App
- Client ID kopieren -> in Vercel Env einfugen
- Fur echte Zahlungen: Live-Modus aktivieren

## Admin-Zugang
- URL: /auth/login
- E-Mail: `JLVINTAGEONTOP`
- Passwort: `JLVINTAGEONTOP`

## Features
- Vintage-Look mit Playfair Display & Cormorant Garamond Fonts
- Hero-Slideshow mit 3 Slides
- Sale-Produktbereich mit Horizontal-Slider
- Shop mit Filter (Kategorie, Suche, Sortierung)
- Warenkorb (Sidebar, localStorage)
- PayPal Checkout
- Rabattcodes
- Benutzerkonto mit E-Mail-Verifizierung
- Admin-Panel: Produkte/Bestellungen/Rabattcodes verwalten
- Uber-Uns-Seite (Leandro & Justin)
- Vercel KV als Datenbank
