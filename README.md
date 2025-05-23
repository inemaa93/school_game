# Virtuell Lærerassistent

En intelligent lærerassistent for skolespill med avansert regelmotor og omfattende JavaScript-implementasjon.

## 🚀 Omfattende JavaScript-implementasjon

Dette prosjektet inneholder nå **mye mer JavaScript** enn tidligere:

### Backend JavaScript (Node.js)
- ✅ **Express.js Server** (`src/server.js`) - Fullverdig web-server med API
- ✅ **Regelmotor** (`src/engine.js`) - Intelligent læringssystem
- ✅ **RESTful API** - 7 endepunkter for komplett funksjonalitet
- ✅ **Jest-tester** (`tests/engine.test.js`) - Omfattende testing

### Frontend JavaScript
- ✅ **Avansert spillmotor** (`public/js/game-engine.js`) - 400+ linjer JavaScript
- ✅ **Interaktiv spillgrensesnitt** (`public/game.html`) - 600+ linjer JavaScript
- ✅ **Sanntids API-kommunikasjon** - Fetch API og async/await
- ✅ **LocalStorage** - Lagring av progresjon og innstillinger
- ✅ **Lydeffekter** - Web Audio API
- ✅ **Animasjoner** - CSS + JavaScript-animasjoner
- ✅ **Prestasjonssystem** - Achievement-systemet med notifikasjoner
- ✅ **Ytelsesovervåking** - Responsetid og statistikk
- ✅ **Adaptiv vanskelighetsgrad** - Intelligent tilpasning

## Beskrivelse

Dette prosjektet implementerer en virtuell lærerassistent som kan hjelpe elever med læring gjennom et interaktivt spill. Systemet bruker en regelbasert motor for å tilpasse seg elevenes behov og gi personalisert veiledning.

## Hovedfunksjoner

- **🧠 Intelligent Regelmotor**: Fleksibel motor som kan håndtere komplekse pedagogiske regler
- **🎯 Tilpasset læring**: Systemet tilpasser seg elevenes individuelle behov automatisk
- **🎮 Avansert spillifisering**: Motiverende spilleelementer med poeng, nivåer og prestasjoner
- **📊 Progressjonssporing**: Detaljert overvåking av elevenes fremgang
- **🔊 Lydeffekter**: Immersive lydopplevelse med Web Audio API
- **🎨 Animasjoner**: Flotte CSS-animasjoner og JavaScript-effekter
- **💾 Datapersistering**: LocalStorage for lagring av progresjon
- **📱 Responsivt design**: Fungerer på desktop, tablet og mobil
- **🔔 Notifikasjoner**: Browser-notifikasjoner for vikttige hendelser
- **⚡ Sanntidskommunikasjon**: Umiddelbar respons mellom frontend og backend

## Mappestruktur

```
virtuell-laererassistent/
├── public/                     # Frontend-filer
│   ├── index.html             # Hovedside (demo)
│   ├── game.html              # Komplett spillgrensesnitt
│   └── js/
│       └── game-engine.js     # Avansert JavaScript spillmotor
├── src/
│   ├── engine.js              # Hovedregelmotoren (Node.js)
│   └── server.js              # Express.js web-server
├── rules/
│   └── example.json           # Eksempler på regler
├── tests/
│   └── engine.test.js         # Omfattende Jest-tester
├── README.md                  # Denne filen
└── package.json               # Prosjektinfo og avhengigheter
```

## Installasjon

1. Klon eller last ned prosjektet
2. Installer avhengigheter:
   ```bash
   npm install
   ```

## Bruk

### 🚀 Kjøre hele applikasjonen (anbefalt)
```bash
npm start
```
Åpne http://localhost:3000 i nettleseren for komplett spillopplevelse.

### 🔧 Utvikling med auto-restart
```bash
npm run dev
```

### 🧪 Kjøre kun regelmotoren
```bash
npm run engine
```

### 🧪 Kjøre tester
```bash
npm test
```

### 👀 Kjøre tester i watch-modus
```bash
npm run test:watch
```

## 🎮 Spillfunksjoner

### Interaktivt Grensesnitt
- **Elevregistrering**: Tilpasset oppstart basert på ferdigheter
- **Dynamiske oppgaver**: Auto-genererte matematikkoppgaver
- **Sanntidstilbakemelding**: Umiddelbar respons på svar
- **Visuell progresjon**: Live oppdatering av statistikk

### JavaScript-drevne Funksjoner
- **🔊 Lydeffekter**: Korrekt/feil/prestasjon-lyder
- **🎨 Animasjoner**: Bounce, shake, fade-effekter
- **📈 Ytelsesmåling**: Responsetid og nøyaktighet
- **🏆 Prestasjonssystem**: Unlockable achievements
- **🔔 Notifikasjoner**: Browser-varsler ved milepæler
- **💾 Auto-lagring**: Progresjon lagres automatisk

### Adaptive Algoritmer
- **📊 Vanskelighetsgrad**: Justeres basert på ytelse
- **🎯 Motivasjonssystem**: Personaliserte oppmuntringer
- **📉 Ytelsesanalyse**: Detaljert statistikk og trender

## 🔌 API-endepunkter

| Endepunkt | Metode | Beskrivelse |
|-----------|--------|-------------|
| `/api/elev/registrer` | POST | Registrer ny elev |
| `/api/elev/status` | GET | Hent elevstatus |
| `/api/elev/progresjon` | GET | Hent progresjonsoversikt |
| `/api/oppgave/generer` | POST | Generer ny oppgave |
| `/api/oppgave/svar` | POST | Send inn svar |
| `/api/regler` | GET | Hent alle regler |
| `/api/elev/reset` | POST | Reset elevdata |

## 🧠 Regelmotor

Regelmotoren er hjertet i den virtuelle lærerassistenten. Den evaluerer regler basert på elevenes handlinger og tilstand, og gir passende responser og veiledning.

### Eksempel på regelbruk

Se `rules/example.json` for eksempler på hvordan regler kan defineres og struktureres.

### Regeltyper
- **Hendelse-baserte**: Trigger på spesifikke handlinger
- **Ferdighetsnivå**: Basert på elevens kompetanse
- **Motivasjon**: Tilpasses elevens motivasjonsnivå
- **Poeng**: Utløses ved poengmilepæler

## 🎯 JavaScript-arkitektur

### Frontend-arkitektur
```
VirtuellLaererassistentSpill (Main Class)
├── AdvancedGameEngine (Game Engine)
│   ├── SoundManager (Lydeffekter)
│   ├── AnimationEngine (Animasjoner)
│   ├── AchievementSystem (Prestasjoner)
│   ├── PerformanceTracker (Ytelsesmåling)
│   └── LocalStorageManager (Datalagring)
├── APIClient (Server-kommunikasjon)
├── UIManager (Grensesnittoppdateringer)
└── EventHandlers (Brukerinteraksjon)
```

### Backend-arkitektur
```
Express.js Server
├── VirtuellLaererassistent (Regelmotor)
├── API Routes (RESTful endepunkter)
├── Question Generator (Oppgavegenerering)
├── Rule Engine (Regel-evaluering)
└── Error Handling (Feilhåndtering)
```

## 🔧 Teknisk implementasjon

### JavaScript-teknologier brukt:
- **ES6+ Features**: Classes, async/await, modules
- **Web APIs**: Fetch, LocalStorage, Notifications, Audio
- **Node.js**: Express.js, Lodash
- **Testing**: Jest med omfattende test coverage
- **Modern CSS**: Flexbox, Grid, Animations
- **Responsive Design**: Mobile-first approach

### Avanserte funksjoner:
- **Adaptive Algorithms**: AI-lignende vanskelighetsgrad-justering
- **Real-time Communication**: Sanntids API-kall
- **Performance Monitoring**: Detaljert ytelsesmåling
- **Progressive Enhancement**: Graceful degradation
- **Error Handling**: Robust feilhåndtering
- **Accessibility**: ARIA-labels og keyboard navigation

## 📱 Brukeropplevelse

- **🎨 Moderne design**: Gradient-bakgrunner og shadow-effekter
- **📱 Responsivt**: Fungerer på alle enheter
- **⚡ Rask**: Optimalisert JavaScript-ytelse
- **🔄 Interaktivt**: Umiddelbar tilbakemelding
- **🎵 Engasjerende**: Lyd og animasjoner
- **📊 Informativt**: Detaljert progresjonsoversikt

## 🧪 Testing

Prosjektet har omfattende Jest-tester som dekker:
- Grunnleggende funksjonalitet
- Regelevaluering
- API-endepunkter
- Feilhåndtering
- Edge cases

## 🚀 Ytelse

JavaScript-optimalisering:
- **Lazy loading**: Laster innhold ved behov
- **Debouncing**: Unngår unødvendige API-kall
- **Memory management**: Rydder opp i event listeners
- **Efficient DOM manipulation**: Minimal reflow/repaint
- **Caching**: LocalStorage for rask datatilgang

## Bidrag

Bidrag til prosjektet er velkommen! Vennligst opprett en issue eller pull request for forslag til forbedringer.

## Lisens

MIT License - se LICENSE filen for detaljer.

## 🤖 AI-assistanse

Deler av koden er utviklet med støtte fra AI (ChatGPT/Cursor) for å forbedre struktur og effektivitet.
Jeg har selv tilpasset og testet all funksjonalitet.

## 📞 Kontakt

For spørsmål eller support, vennligst opprett en issue i prosjektets repository. 