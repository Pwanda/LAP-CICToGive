# Container Setup für CIC to Give (Docker & Podman)

Dieses README erklärt, wie du die komplette CIC to Give Anwendung mit Docker oder Podman starten kannst.

## 📋 Voraussetzungen

### Docker Setup
- Docker (Version 20.10 oder höher)
- Docker Compose (Version 2.0 oder höher)
- Mindestens 4GB freier RAM
- Ports 3000, 8080, und 5432 müssen frei sein

### Podman Setup (Alternative zu Docker)
- Podman (Version 4.0 oder höher)
- Podman Compose oder docker-compose
- Mindestens 4GB freier RAM
- Ports 3000, 8080, und 5432 müssen frei sein

### Installation prüfen

**Docker:**
```bash
docker --version
docker-compose --version
```

**Podman:**
```bash
podman --version
podman-compose --version
# oder
docker-compose --version  # funktioniert auch mit Podman
```

## 🐳 Docker vs 🦭 Podman - Was ist der Unterschied?

| Feature | Docker | Podman |
|---------|--------|---------|
| **Daemon** | Benötigt Docker-Daemon | Daemonless (direkter Kernel-Zugriff) |
| **Root-Rechte** | Oft erforderlich | Rootless möglich |
| **Sicherheit** | Daemon läuft als root | Bessere Sicherheit durch Rootless |
| **Systemd** | Separate Lösung | Native Systemd-Integration |
| **Kubernetes** | Separate Tools | Eingebaute Kubernetes YAML-Unterstützung |
| **Performance** | Etabliert | Oft schneller beim Start |

**Warum Podman?**
- ✅ Keine Root-Rechte erforderlich
- ✅ Bessere Sicherheit
- ✅ Kompatibel mit Docker-Befehlen
- ✅ Native Systemd-Integration
- ✅ Ideal für Entwicklung und Produktion

## 🚀 Schnellstart

### Mit Docker

```bash
# Automatisches Setup (Empfohlen)
./docker-start.sh

# Oder für einen sauberen Neustart (löscht alle Daten)
./docker-start.sh --clean

# Oder manuell
docker-compose up -d
```

### Mit Podman

```bash
# Podman-Compose verwenden (empfohlen)
podman-compose up -d

# Oder mit docker-compose (funktioniert auch mit Podman)
docker-compose up -d

# Oder mit Podman-spezifischen Befehlen
podman play kube docker-compose.yml
```

### Podman-spezifische Installation

**Arch Linux:**
```bash
sudo pacman -S podman podman-compose
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install podman podman-compose
```

**Fedora/RHEL:**
```bash
sudo dnf install podman podman-compose
```

**macOS:**
```bash
brew install podman podman-compose
```

## 🏗️ Services

Das Container-Setup startet folgende Services:

### 1. PostgreSQL Database (`database`)
- **Port:** 5432
- **Database:** cictogive
- **Username:** postgres
- **Password:** password
- **Volume:** `postgres_data` (persistente Datenspeicherung)

### 2. Spring Boot Backend (`backend`)
- **Port:** 8080
- **API Endpoints:** http://localhost:8080/api
- **Health Check:** http://localhost:8080/actuator/health
- **Volume:** `backend_uploads` (für hochgeladene Bilder)

### 3. Next.js Frontend (`frontend`)
- **Port:** 3000
- **URL:** http://localhost:3000
- **Umgebung:** Production Build

## 🔧 Konfiguration

### Environment Variables

Die wichtigsten Umgebungsvariablen sind in der `docker-compose.yml` definiert:

**Backend:**
```yaml
- SPRING_DATASOURCE_URL=jdbc:postgresql://database:5432/cictogive
- SPRING_DATASOURCE_USERNAME=postgres
- SPRING_DATASOURCE_PASSWORD=password
- JWT_SECRET=mySecretKeyForCICtoGiveApplication2024
- CORS_ALLOWED_ORIGINS=http://localhost:3000,http://frontend:3000
```

**Frontend:**
```yaml
- NEXT_PUBLIC_API_URL=http://localhost:8080
- NODE_ENV=production
```

### Volumes

- `postgres_data`: Persistente Datenbankspeicherung
- `backend_uploads`: Hochgeladene Bilder und Dateien

## 📊 Testdaten

Das System wird automatisch mit Testdaten initialisiert:

### Benutzer-Accounts
| Username | E-Mail | Passwort |
|----------|--------|----------|
| admin | admin@cictogive.com | password123 |
| john_doe | john@example.com | password123 |
| jane_smith | jane@example.com | password123 |

### Beispiel-Items
- Alter Laptop (Electronics)
- Küchengeschirr Set (Other)
- Bücher Sammlung (Books)
- Fahrrad (Vehicles)
- Sofa (Furniture)

## 🛠️ Häufige Befehle

### Mit Docker

```bash
# Anwendung starten
docker-compose up -d

# Anwendung stoppen
docker-compose down

# Logs anzeigen
docker-compose logs -f

# Container Status
docker-compose ps

# In Container einsteigen
docker-compose exec backend bash
```

### Mit Podman

```bash
# Anwendung starten
podman-compose up -d
# oder
podman play kube docker-compose.yml

# Anwendung stoppen
podman-compose down
# oder
podman pod stop cictogive

# Logs anzeigen
podman-compose logs -f
# oder
podman logs -f cictogive-backend

# Container Status
podman-compose ps
# oder
podman pod ps

# In Container einsteigen
podman-compose exec backend bash
# oder
podman exec -it cictogive-backend bash
```

### Podman-spezifische Befehle

```bash
# Rootless starten (ohne sudo)
podman-compose up -d

# Als Service registrieren (Systemd)
podman generate systemd --new --name cictogive-backend > ~/.config/systemd/user/cictogive-backend.service
systemctl --user daemon-reload
systemctl --user enable cictogive-backend
systemctl --user start cictogive-backend

# Pods anzeigen
podman pod ls

# Pod-Informationen
podman pod inspect cictogive

# Alle Container eines Pods stoppen
podman pod stop cictogive

# Pod komplett löschen
podman pod rm cictogive
```

## 🔒 Podman Rootless Setup

### Vorteile von Rootless Podman:
- Keine Root-Rechte erforderlich
- Bessere Sicherheit
- Isolation zwischen Benutzern

### Rootless konfigurieren:

```bash
# Subuid und subgid konfigurieren
echo "$USER:100000:65536" | sudo tee -a /etc/subuid
echo "$USER:100000:65536" | sudo tee -a /etc/subgid

# Podman-Konfiguration
podman system migrate

# Rootless starten
podman-compose up -d
```

### Port-Mapping für Rootless:

```bash
# Ports < 1024 erfordern spezielle Konfiguration
echo 'net.ipv4.ip_unprivileged_port_start=80' | sudo tee -a /etc/sysctl.conf
sudo sysctl -p
```

## 🐛 Troubleshooting

### Docker-spezifische Probleme

```bash
# Docker-Daemon Status
sudo systemctl status docker

# Docker-Daemon starten
sudo systemctl start docker

# Docker ohne sudo (nach Gruppenzugehörigkeit)
sudo usermod -aG docker $USER
newgrp docker
```

### Podman-spezifische Probleme

```bash
# Podman-Sockets aktivieren
systemctl --user enable podman.socket
systemctl --user start podman.socket

# Podman-Compose mit Docker-Compose verwenden
export DOCKER_HOST=unix:///run/user/$UID/podman/podman.sock

# Rootless-Probleme beheben
podman system reset  # ACHTUNG: Löscht alle Daten!
```

### Allgemeine Probleme

```bash
# Port bereits belegt
sudo lsof -i :3000
sudo lsof -i :8080
sudo lsof -i :5432

# Prozess beenden
sudo kill -9 <PID>

# Container-Netzwerk zurücksetzen
# Docker:
docker network prune
# Podman:
podman network prune
```

## 📈 Performance-Vergleich

### Docker vs Podman Performance:

| Metrik | Docker | Podman |
|--------|--------|---------|
| **Startup-Zeit** | ~5-10s | ~3-7s |
| **Memory-Overhead** | Daemon + Container | Nur Container |
| **CPU-Overhead** | Daemon-Layer | Direkter Kernel-Zugriff |
| **Disk I/O** | Über Daemon | Direkter Zugriff |

### Optimierungen:

**Für Docker:**
```yaml
# docker-compose.yml
services:
  backend:
    deploy:
      resources:
        limits:
          memory: 2G
          cpus: '1.5'
```

**Für Podman:**
```bash
# Rootless mit besserer Performance
podman run --memory=2g --cpus=1.5 --security-opt=no-new-privileges
```

## 🔄 Migration von Docker zu Podman

### Schritt-für-Schritt Migration:

```bash
# 1. Docker-Container exportieren
docker save -o cictogive-images.tar cictogive-backend cictogive-frontend

# 2. In Podman importieren
podman load -i cictogive-images.tar

# 3. Docker-Compose mit Podman verwenden
alias docker=podman
alias docker-compose=podman-compose

# 4. Normale docker-compose Befehle verwenden
docker-compose up -d
```

### Podman-Compose Alternative:

```bash
# Anstatt docker-compose.yml
# Verwende podman-compose oder erstelle pod-spec.yml
podman play kube pod-spec.yml
```

## 🚀 Erweiterte Podman-Features

### Pods (Kubernetes-ähnlich):

```bash
# Pod erstellen
podman pod create --name cictogive-pod -p 3000:3000 -p 8080:8080 -p 5432:5432

# Container zum Pod hinzufügen
podman run -d --pod cictogive-pod --name database postgres:15
podman run -d --pod cictogive-pod --name backend cictogive-backend
podman run -d --pod cictogive-pod --name frontend cictogive-frontend
```

### Systemd-Integration:

```bash
# Container als Systemd-Service
podman generate systemd --new --name cictogive-backend > ~/.config/systemd/user/cictogive.service

# Service aktivieren
systemctl --user daemon-reload
systemctl --user enable cictogive
systemctl --user start cictogive

# Auto-Start beim Boot
loginctl enable-linger $USER
```

## 🔒 Sicherheit

### Podman-Sicherheitsvorteile:

```bash
# Rootless ausführen
podman-compose up -d  # Läuft als normaler User

# Security-Optionen
podman run --security-opt=no-new-privileges \
           --cap-drop=ALL \
           --read-only \
           --tmpfs /tmp \
           cictogive-backend
```

### Produktionsumgebung:

```bash
# Für Docker:
echo "POSTGRES_PASSWORD=sicher123" > .env
echo "JWT_SECRET=super-sicher-jwt-key" >> .env

# Für Podman:
podman secret create postgres_password postgres_password.txt
podman secret create jwt_secret jwt_secret.txt
```

## 📞 Support

### Docker-Probleme:
1. `docker-compose logs -f`
2. `docker-compose ps`
3. `docker system df`

### Podman-Probleme:
1. `podman-compose logs -f`
2. `podman pod ps`
3. `podman system df`
4. `podman info` (Systeminfo)

## 🏁 Fazit

Sowohl Docker als auch Podman eignen sich hervorragend für CIC to Give:

**Wähle Docker wenn:**
- Du bereits Docker-Erfahrung hast
- Du in einem Team mit Docker-Workflow arbeitest
- Du Docker Desktop verwenden möchtest

**Wähle Podman wenn:**
- Du bessere Sicherheit möchtest (Rootless)
- Du Linux verwendest
- Du keine Daemon-Architektur möchtest
- Du mit Kubernetes arbeitest

Beide Setups sind vollständig kompatibel und verwenden die gleichen Container-Images und Compose-Files!