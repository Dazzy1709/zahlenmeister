
# ZahlenMeister 🎲🧠

Spiel spielen:[zahlenmeister.onrender.com](https://zahlenmeister.onrender.com)

---

## 🚀 Übersicht

**ZahlenMeister** ist ein fesselndes Mathe-Abenteuerspiel, bei dem jedes Haus ein Kapitel in einer mysteriösen Welt der Zahlen ist. Löse Rechenrätsel, knacke geschichtenbasierte Herausforderungen und überliste Logikfallen – während du gleichzeitig deine Mathefähigkeiten verbesserst.

> 💡 Dein Begleiter, **Professor Jay**, führt dich durch eine epische Reise voller Zahlen, Rätsel und herausfordernder Logik.

---

## 🧩 Features

- 🔢 **10 einzigartige Mathe-Häuser** – Deckt Addition, Subtraktion, Multiplikation und Division ab
- ⬆️ **Progressiver Schwierigkeitsgrad** – Häuser werden in steigender Komplexität freigeschaltet
- 💬 **Interaktive Story** – Dialoge mit Professor Jay führen und fordern dich
- 🌐 **Globaler Chat** – In Echtzeit mit anderen Spielern kommunizieren
- 👤 **Benutzerprofile** – Personalisiere Benutzernamen und Profilbilder
- 💾 **Fortschritt speichern** – Verfolgt deinen Weg durch Level und Häuser
- 📱 **Responsives Design** – Lückenlos auf Desktop und Mobilgeräten
- 🕹️ **Gamification** – Leben, Timer, Audio/Visuelles Feedback und Jubel-Effekte

---

## 🛠️ Tech Stack

### 🔍 Frontend

- HTML5 + EJS Templates
- CSS3 mit Animationen
- JavaScript (ES6)
- Party.js für visuelle Effekte
- Socket.io für Live-Chat

### 🧠 Backend

- Node.js mit Express
- MongoDB + Mongoose für Benutzer- und Spieledaten
- Session-basierte Authentifizierung (bcrypt)
- WebSockets für Echtzeit-Kommunikation

### 🚢 Deployment

- PM2 für Prozessverwaltung
- Render (oder ähnliche Plattformen) für Hosting

---

## ⚙️ Installation

1. **Repository klonen**:

   ```bash
   git clone https://github.com/yourusername/zahlenmeister.git
   cd zahlenmeister
   ```
````

2. **Abhängigkeiten installieren**:

   ```bash
   npm install
   ```

3. **`.env`-Datei erstellen**:

   ```env
   MONGO_URI=mongodb+srv://your-db-url
   SESSION_SECRET=your-secret-key
   NODE_ENV=development
   PORT=10000
   ```

4. **Entwicklungsserver starten**:

   ```bash
   npm run dev
   ```

5. **In Produktion ausführen**:

   ```bash
   npm start
   ```

---

## 🗂️ Projektstruktur

```php
zahlenmeister/
├── config/            # MongoDB Modelle und Datenbankkonfiguration
│   ├── db.js
│   ├── messages.js
│   └── user.js
├── public/
│   ├── js/           # Frontend-Spiellogik
│   ├── shared/       # Gemeinsame Spieldaten
│   └── styles/       # CSS
├── views/            # EJS Templates
├── index.js          # Express App Einstiegspunkt
└── package.json
```

---

## 🕹️ Spielmechaniken

### 🏠 Haus-System

- Jedes Haus = 1 Mathe-Thema
- 15 Level pro Haus
- Sequenzielles Freischalt-System
- Einzigartige Kunst, Logikfallen und Dialoge in jedem

### 🎮 Spielablauf

- 3 Leben pro Haus
- Zeitbegrenzte Aufgaben
- Sofortiges Feedback und Audio-Signale
- Jubel mit Animationen (bei richtigen Antworten)

### 👥 Spielererlebnis

- Gastmodus: Sofort spielen mit lokalen Speicherständen
- Registrierte Nutzer: Cloud-gespeicherter Fortschritt
- Anpassbare Profile: Benutzername & Avatar festlegen
- Globaler Chat: Live mit Spielern verbinden

---

## 🌐 API-Endpunkte

| Route                      | Methode  | Beschreibung                     |
| -------------------------- | -------- | -------------------------------- |
| `/`                        | GET      | Begrüßungsbildschirm             |
| `/home`                    | GET      | Spielmenü                        |
| `/login`                   | GET/POST | Benutzeranmeldung                |
| `/signup`                  | GET/POST | Benutzer erstellen               |
| `/rechnen/:houseId/:level` | GET      | Level starten                    |
| `/complete-house`          | POST     | Haus als abgeschlossen markieren |
| `/settings`                | GET      | Einstellungen ändern             |
| `/change-username`         | POST     | Benutzernamen bearbeiten         |
| `/upload-profile-picture`  | POST     | Avatar ändern                    |
| `/logout`                  | GET      | Sitzung beenden                  |
| `/session/refresh`         | GET      | Anmeldesitzung aktualisieren     |

---

## 🎨 Anpassung

- **Mathefragen**: Anpassung in `public/shared/js/variables.js`
- **Häuser**: Bearbeitung im `houseData`-Array
- **Dialoge**: Anpassung in den gemeinsamen JS-Dateien
- **Styling**: CSS in `public/styles/` bearbeiten
- **Audio**: Sound-Assets in `public/assets/audio/` ersetzen

---

## 🚀 Deployment

1. Alle Umgebungsvariablen für die Produktion setzen
2. Build (optional):

   ```bash
   npm run build
   ```

3. Mit PM2 starten:

   ```bash
   npm run prod
   ```

4. Überwachen:

   ```bash
   npm run logs
   ```

---

## 🌟 Zukunftspläne

- Mehrspieler-Modi (Wettkampf/Kooperation)
- Tägliche Herausforderungen & Serien
- Erfolgssystem
- Globale Bestenlisten
- Erweiterte Themen (Brüche, Algebra)
- Mobile App (React Native oder Flutter)

---

## 🙌 Mitwirken

## Pull Requests sind willkommen!

**Viel Spaß beim Zahlenerobern mit Professor Jay!** 🎓💥

> "Zu lösen heißt, sich weiterzuentwickeln."

```

```
