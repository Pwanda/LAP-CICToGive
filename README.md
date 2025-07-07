# LAP - Verschenke-Plattform

Eine moderne Full-Stack-Webanwendung zum Verschenken von Gegenständen - entwickelt mit React, Spring Boot und PostgreSQL.

## 🔐 Sicherheitshinweis

**⚠️ WICHTIG:** Diese Anwendung verwendet externe API-Keys (Backblaze B2), die **niemals** in Git committed werden dürfen!

```bash
# Vor dem ersten Start:
cp backend/.env.example backend/.env
cp Frontend/.env.example Frontend/.env

# Dann .env Dateien mit deinen Credentials ausfüllen
nano backend/.env  # B2_APPLICATION_KEY_ID, B2_APPLICATION_KEY, etc.
```

📖 **Ausführliche Anleitung:** Siehe [SECURITY.md](SECURITY.md)

## 🚀 Schnellstart

```bash
# Repository klonen
git clone <your-repo-url>
cd LAP

# Alles mit einem Befehl starten
./start-dev.sh
```

**Das war's!** ✨ Die Anwendung läuft unter:
- 📱 **Frontend**: http://localhost:5173
- 🔧 **Backend**: http://localhost:8080
- 🗄️ **Database**: localhost:5432

**Testanmeldung:** `testuser` / `password123`

> 💡 **Hinweis:** Falls Bildupload nicht funktioniert, überprüfe deine B2-Konfiguration in `backend/.env`

## 🛠️ Technologie-Stack

### Frontend
- **React 19** + **TypeScript** - Moderne, typsichere UI
- **Vite** - Blitzschnelle Entwicklung
- **TailwindCSS** + **DaisyUI** - Schönes, responsives Design
- **React Query** - Intelligentes Datenmanagement
- **React Hook Form** + **Zod** - Validierung
- **React Router v7** - Navigation

### Backend
- **Spring Boot 3.2** - Robuste API
- **Spring Security** + **JWT** - Sichere Authentifizierung
- **PostgreSQL** - Zuverlässige Datenbank
- **JPA/Hibernate** - Datenzugriff
- **Backblaze B2** - Cloud-Speicher

### DevOps
- **Podman/Docker** - Containerisierung
- **Hot Reload** - Sofortige Entwicklung
- **Maven** - Build-Management

## 🎯 Features

### ✅ Implemented
- **Benutzerregistrierung** und sichere Anmeldung
- **Artikel erstellen** mit Bildern
- **Artikel suchen** und filtern
- **Artikel reservieren**
- **Kommentare** zu Artikeln
- **Profilmanagement**
- **Responsive Design**

### 🔄 In Development
- Push-Benachrichtigungen
- Erweiterte Suchfilter
- Bewertungssystem
- Chat-Funktion

## 📁 Vereinfachte Projektstruktur

```
LAP/
├── Frontend/
│   ├── src/
│   │   ├── lib/
│   │   │   └── auth.ts              # 🔥 EINFACHE Auth-Logik
│   │   ├── hooks/
│   │   │   └── useAuth.tsx          # 🔥 Auth Hook + Context
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx    # 🔥 Vereinfacht
│   │   │   │   ├── RegisterForm.tsx # 🔥 Vereinfacht
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── Footer.tsx
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── LandingPage.tsx
│   │   │   ├── ProfilePage.tsx
│   │   │   └── MyItemsPage.tsx
│   │   ├── schemas/
│   │   │   └── AuthSchemas.ts       # 🔥 Zod-Validierung
│   │   └── App.tsx
│   ├── tailwind.config.js
│   └── package.json
├── backend/
│   ├── src/main/java/com/lap/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── entity/
│   │   └── config/
│   └── pom.xml
├── start-dev.sh                     # 🔥 Ein-Klick-Setup
└── README.md
```

## 🔧 Development Commands

```bash
# Entwicklungsumgebung starten
./start-dev.sh

# Mit PgAdmin Web-Interface
./start-dev.sh --with-pgadmin

# Sauberer Neustart
./start-dev.sh --clean

# Services stoppen
./start-dev.sh stop

# Logs anzeigen
./start-dev.sh logs

# Container-Status
./start-dev.sh status

# Datenbank verbinden
./start-dev.sh db
```

## 📚 Neue vereinfachte Auth-Struktur

### 🔥 Einfache Verwendung:

```typescript
// In einer Komponente
import { useAuth } from './hooks/useAuth';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  // Einfach zu verwenden!
  if (!isAuthenticated) {
    return <LoginForm />;
  }
  
  return <div>Willkommen, {user.username}!</div>;
}
```

### 🔥 Direkte API-Calls:

```typescript
// Überall verwendbar
import { auth } from './lib/auth';

// Login
const user = await auth.login({ username, password });

// Authentifizierte API-Calls
const response = await auth.apiCall('/api/items');
```

## 🏗️ Architektur-Prinzipien

### KISS (Keep It Simple, Stupid)
- **Eine** `auth.ts` statt 5 Dateien
- **Eine** `useAuth.tsx` für alles
- **Direkte** API-Calls ohne Abstraktionen

### Modern Stack
- **React 19** - Neueste Features
- **TypeScript** - Typsicherheit
- **Zod** - Schema-Validierung
- **DaisyUI** - Schöne Komponenten

### Developer Experience
- **Hot Reload** - Sofortige Änderungen
- **Ein-Klick-Setup** - Keine Konfiguration
- **Einfache APIs** - Weniger Boilerplate

## 🚨 Troubleshooting

### Container starten nicht?
```bash
# Komplette Bereinigung
./start-dev.sh clean

# Neu starten
./start-dev.sh
```

### Frontend lädt nicht?
```bash
# Container neu starten
podman restart lap-frontend

# Logs prüfen
./start-dev.sh logs
```

### Backend-Fehler?
```bash
# Java-Logs prüfen
podman logs lap-backend

# Datenbank testen
./start-dev.sh db
```

## 🔐 Sicherheit

- **JWT-Authentifizierung** mit sicheren Tokens
- **BCrypt-Passwort-Hashing** 
- **Input-Validierung** mit Zod
- **CORS-Konfiguration**
- **Sichere Cloud-Speicherung**

## 📈 Performance

- **React Query** - Intelligentes Caching
- **Lazy Loading** - Optimierte Ladezeiten
- **Bildoptimierung** - Automatische Komprimierung
- **Datenbankindizes** - Schnelle Suche

## 🤝 Contributing

1. Repository forken
2. Feature-Branch erstellen
3. Entwickeln mit `./start-dev.sh`
4. Tests schreiben
5. Pull Request erstellen

## 📄 Lizenz

MIT License - Siehe [LICENSE](LICENSE) für Details.

---

## 🎓 Lehrabschlussprüfung

Diese Anwendung wurde als Abschlussprojekt für die Lehrabschlussprüfung Applikationsentwicklung entwickelt und demonstriert:

- **Full-Stack-Entwicklung** mit modernen Technologien
- **Saubere Architektur** nach KISS-Prinzip
- **Sichere Authentifizierung** und Datenschutz
- **Responsive Design** für alle Geräte
- **Professionelle Dokumentation**
- **Containerisierte Entwicklung**

**Entwicklungszeit:** ~33 Arbeitstage (263 Stunden)
**Technologien:** 12+ moderne Frameworks/Tools
**Features:** 30+ funktionale Anforderungen

---

**Happy Coding!** 🚀