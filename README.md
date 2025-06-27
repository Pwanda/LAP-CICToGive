# LAP CIC - Lehrabschlussprüfung Applikationsentwicklung

Dieses Repository enthält die vollständige Dokumentation und Implementierung für die Lehrabschlussprüfung (LAP) im Bereich Applikationsentwicklung - Coding.

## 🎯 Projektübersicht

**CIC to Give** ist eine moderne Fullstack-Webanwendung für kostenloses Verschenken und Tauschen von Gegenständen. Das Projekt demonstriert professionelle Softwareentwicklung mit aktuellen Technologien und Best Practices.

## 📁 Repository-Struktur

```
LapCIC/
├── fullstack-app/              # Hauptanwendung
│   ├── backend/                # Spring Boot Backend
│   ├── frontend/               # Next.js Frontend
│   ├── database/               # PostgreSQL Scripts
│   ├── docker-compose.yml     # Container-Orchestrierung
│   ├── LAP_Dokumentation_CIC_to_Give.tex  # Technische Dokumentation
│   └── README_Docker.md       # Container-Setup Guide
└── README.md                   # Diese Datei
```

## 🛠️ Technologie-Stack

### Backend (Spring Boot)
- **Java 17** - Moderne JVM-Sprache
- **Spring Boot 3.2.5** - Enterprise-Framework
- **Spring Security** - Authentifizierung & Autorisierung
- **Spring Data JPA** - Datenbankzugriff
- **PostgreSQL** - Relationale Datenbank
- **Maven** - Dependency Management
- **JWT** - Token-basierte Authentifizierung

### Frontend (Next.js)
- **Next.js 15.3.2** - React Framework
- **React 19** - UI-Library
- **TypeScript** - Typsichere Entwicklung
- **Tailwind CSS 4** - Utility-First CSS
- **Responsive Design** - Mobile-First Ansatz

### DevOps & Tools
- **Docker & Podman** - Containerisierung
- **PostgreSQL 15** - Produktionsdatenbank
- **Git** - Versionskontrolle
- **LaTeX** - Dokumentation

## 🚀 Quick Start

### Container-Setup (Empfohlen)

```bash
cd fullstack-app

# Mit Docker
docker-compose up -d

# Mit Podman (Arch Linux)
./podman-start.sh
```

### Lokale Entwicklung

```bash
# 1. PostgreSQL starten
docker-compose up -d database

# 2. Backend starten
cd fullstack-app/backend
./mvnw spring-boot:run

# 3. Frontend starten (neues Terminal)
cd fullstack-app/frontend
npm install && npm run dev
```

## 📚 Dokumentation

### 📄 LAP-Hauptdokument
- **Datei:** `fullstack-app/LAP_Dokumentation_CIC_to_Give.tex`
- **Inhalt:** Vollständige technische Dokumentation mit:
  - Projektarchitektur und Design-Entscheidungen
  - Detaillierte Code-Erklärungen (BCrypt, JWT, etc.)
  - Sicherheitskonzepte und Best Practices
  - Zeitschätzungen und Projektmanagement
  - Performance-Optimierungen

### 🐳 Container-Guide
- **Datei:** `fullstack-app/README_Docker.md`
- **Inhalt:** Umfassende Anleitung für:
  - Docker vs. Podman Unterschiede
  - Rootless Container-Setup
  - Troubleshooting und Performance-Tipps

### 📋 API-Dokumentation
- **Verfügbar unter:** http://localhost:8080/api (wenn Backend läuft)
- **Endpoints:** Authentication, Items, Comments, File Upload

## 🎓 LAP-Relevante Themen

### Backend-Kompetenzen
- ✅ **Spring Boot Framework** - Moderne Java-Entwicklung
- ✅ **REST API Design** - HTTP-Standards und Best Practices
- ✅ **Datenbank-Design** - JPA/Hibernate mit PostgreSQL
- ✅ **Sicherheit** - JWT, BCrypt, Input-Validierung
- ✅ **File Upload** - Multipart-Handling und Validierung
- ✅ **Testing** - Unit und Integration Tests

### Frontend-Kompetenzen
- ✅ **React/Next.js** - Moderne Frontend-Entwicklung
- ✅ **TypeScript** - Typsichere JavaScript-Entwicklung
- ✅ **Responsive Design** - Mobile-First mit Tailwind CSS
- ✅ **State Management** - React Hooks und API-Integration
- ✅ **User Experience** - Intuitive Benutzeroberflächen

### DevOps-Kompetenzen
- ✅ **Containerisierung** - Docker/Podman für Deployment
- ✅ **Database Management** - PostgreSQL Setup und Migration
- ✅ **Environment Configuration** - Development vs. Production
- ✅ **Monitoring** - Health Checks und Logging

## 🔧 Funktionen der Anwendung

### Benutzer-Features
- 👤 **Registrierung & Login** - Sichere JWT-Authentifizierung
- 📝 **Item-Management** - Erstellen, Bearbeiten, Löschen von Angeboten
- 🖼️ **Bildupload** - Mehrere Bilder pro Item
- 🔍 **Suche & Filter** - Nach Kategorie und Text
- 💬 **Kommentarsystem** - Kommunikation zwischen Nutzern
- 📱 **Mobile-Optimiert** - Responsive Design für alle Geräte

### Technische Features
- 🔐 **Sichere Authentifizierung** - BCrypt + JWT
- 🗄️ **Relationale Datenbank** - PostgreSQL mit JPA
- 🚀 **Performance** - Optimierte API-Calls und Caching
- 🐳 **Container-Ready** - Docker/Podman Support
- 📊 **Monitoring** - Health Checks und Metrics

## 🧪 Test-Accounts

| Username | E-Mail | Passwort |
|----------|--------|----------|
| admin | admin@cictogive.com | password123 |
| john_doe | john@example.com | password123 |
| jane_smith | jane@example.com | password123 |

## 📊 Projektmetriken

### Entwicklungszeit
- **Gesamtaufwand:** ~174 Stunden (22 Arbeitstage)
- **Backend:** 68 Stunden
- **Frontend:** 54 Stunden  
- **Testing & Deployment:** 28 Stunden
- **Dokumentation:** 24 Stunden

### Code-Statistiken
- **Java-Klassen:** 17 (Backend)
- **React-Komponenten:** 16 (Frontend)
- **API-Endpoints:** 12
- **Datenbank-Tabellen:** 4

## 🎯 Lernziele & Kompetenzen

### Was dieses Projekt demonstriert:

1. **Fullstack-Entwicklung** - Von der Datenbank bis zur Benutzeroberfläche
2. **Moderne Architektur** - Microservices-ähnliche Trennung
3. **Sicherheitsbewusstsein** - OWASP-konforme Implementierung
4. **DevOps-Praktiken** - Containerisierung und Deployment
5. **Projektmanagement** - Realistische Zeitschätzungen
6. **Dokumentation** - Professionelle technische Dokumentation

## 🏆 LAP-Bewertungskriterien

### Fachkompetenz (40%)
- ✅ Vollständige Anwendungsarchitektur
- ✅ Moderne Technologie-Integration
- ✅ Best Practices umgesetzt
- ✅ Fehlerbehandlung implementiert

### Methodenkompetenz (30%)
- ✅ Strukturierte Entwicklung
- ✅ Testing-Strategien
- ✅ Versionskontrolle
- ✅ Deployment-Prozesse

### Sozialkompetenz (20%)
- ✅ Dokumentation für andere Entwickler
- ✅ Code-Kommentare und Erklärungen
- ✅ API-Design für Teams

### Selbstkompetenz (10%)
- ✅ Eigenständige Problemlösung
- ✅ Technologie-Bewertung
- ✅ Kontinuierliche Verbesserung

## 🔧 Entwicklung & Deployment

### Lokale Entwicklung
```bash
# Repository klonen
git clone <repository-url>
cd LapCIC/fullstack-app

# Container-Setup
docker-compose up -d

# Zugriff auf die Anwendung
open http://localhost:3000
```

### Produktions-Deployment
```bash
# Optimierte Container für Produktion
docker-compose -f docker-compose.yml up -d --build

# Health Checks
curl http://localhost:8080/actuator/health
curl http://localhost:3000
```

## 📞 Support & Hilfe

### Troubleshooting
1. **Container-Probleme:** Siehe `README_Docker.md`
2. **Database-Issues:** PostgreSQL Logs prüfen
3. **Build-Errors:** Maven/npm Cache löschen

### Ressourcen
- **Spring Boot Docs:** https://spring.io/projects/spring-boot
- **Next.js Docs:** https://nextjs.org/docs
- **Docker Docs:** https://docs.docker.com

## 🎓 Fazit

Dieses Projekt zeigt eine vollständige, moderne Webentwicklung von der Konzeption bis zum Deployment. Es demonstriert aktuelle Best Practices und Technologien, die in der professionellen Softwareentwicklung verwendet werden.

Die Implementierung erfüllt alle Anforderungen einer LAP im Bereich Applikationsentwicklung und zeigt sowohl technische Tiefe als auch praktische Anwendbarkeit.

---

**Entwickelt für die Lehrabschlussprüfung Applikationsentwicklung - Coding 2025**

*CIC to Give - Eine moderne Plattform für kostenloses Teilen*
