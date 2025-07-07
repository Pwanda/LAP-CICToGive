# 🔐 Security & Configuration Guide

## ⚠️ WICHTIG: Sensible Daten schützen

Diese Anwendung verwendet externe Services und API-Keys, die **niemals** in Git committed werden dürfen!

## 🛡️ Setup für sichere Entwicklung

### 1. Erstmalige Einrichtung

```bash
# 1. Repository klonen
git clone <your-repo-url>
cd LAP

# 2. Environment-Dateien erstellen
cp backend/.env.example backend/.env
cp Frontend/.env.example Frontend/.env

# 3. Backend-Konfiguration erstellen
cp backend/src/main/resources/application.properties.example backend/src/main/resources/application.properties
```

### 2. Backblaze B2 Setup

1. **Account erstellen**: https://www.backblaze.com/
2. **B2 Cloud Storage** aktivieren
3. **Neuen Bucket erstellen**:
   - Name: `lap-[your-name]` (z.B. `lap-johndoe`)
   - Bucket Type: `Private`
   - Region: EU (empfohlen)

4. **Application Key erstellen**:
   - Gehe zu "App Keys"
   - Klicke "Add a New Application Key"
   - Name: `LAP-Backend`
   - Bucket: Deinen erstellten Bucket auswählen
   - Permissions: `Read and Write`
   - **Kopiere Key ID und Key sofort!** (werden nur einmal angezeigt)

### 3. Konfiguration ausfüllen

**Backend `.env` Datei bearbeiten:**
```bash
nano backend/.env
```

Fülle diese Werte aus:
```env
# Deine B2 Credentials
B2_APPLICATION_KEY_ID=dein_key_id_hier
B2_APPLICATION_KEY=dein_application_key_hier
B2_BUCKET_NAME=dein_bucket_name_hier

# JWT Secret für Production ÄNDERN!
JWT_SECRET=dein_super_sicherer_jwt_secret_mindestens_64_zeichen_lang
```

**Frontend `.env` Datei (falls nötig):**
```bash
nano Frontend/.env
```

## 🚫 Was NIEMALS committed werden darf

### Sensible Dateien (bereits in .gitignore):
- `backend/.env`
- `Frontend/.env`
- `**/*.key`
- `**/credentials/`
- `**/secrets/`

### Sensible Daten:
- ❌ API Keys (B2, JWT, etc.)
- ❌ Datenbankpasswörter
- ❌ Produktions-URLs
- ❌ Persönliche Zugangsdaten

## ✅ Sichere Entwicklung

### Environment Variables verwenden

**Richtig** (in application.properties):
```properties
b2.application.key.id=${B2_APPLICATION_KEY_ID:fallback_value}
b2.application.key=${B2_APPLICATION_KEY:fallback_value}
```

**Falsch** (niemals so):
```properties
b2.application.key.id=f605d9065411
b2.application.key=0035005d40d86e5a15d72de04f9106adf98325aff6
```

### Docker/Container Setup

Das `start-dev.sh` Script lädt automatisch die `.env` Dateien:

```bash
# Automatisches Laden der Environment Variables
./start-dev.sh
```

## 🔧 Deployment & Production

### Staging/Production

Für Staging und Production **niemals** .env Dateien verwenden!

**Stattdessen:**
- Kubernetes Secrets
- Docker Secrets
- CI/CD Environment Variables
- Cloud Provider Secret Managers (AWS Secrets Manager, etc.)

### Environment-spezifische Configs

```bash
# Verschiedene Umgebungen
application.properties              # Basis-Config
application-dev.properties         # Development (nicht committen)
application-staging.properties     # Staging (nicht committen)
application-prod.properties        # Production (nicht committen)
```

## 🔍 Security Checklist

### Vor jedem Commit:
- [ ] `.env` Dateien sind in .gitignore
- [ ] Keine API Keys im Code
- [ ] Keine Passwörter committed
- [ ] Secrets über Environment Variables geladen

### Vor Deployment:
- [ ] JWT Secret geändert (Production)
- [ ] Starke Passwörter verwendet
- [ ] HTTPS aktiviert
- [ ] CORS richtig konfiguriert
- [ ] Sichere Container-Konfiguration

## 🆘 Falls versehentlich committed

### Sofort handeln:

1. **Repository-History bereinigen:**
```bash
# Alle Commits mit sensiblen Daten entfernen
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch backend/.env' \
  --prune-empty --tag-name-filter cat -- --all

# Force Push (ACHTUNG: Gefährlich!)
git push origin --force --all
```

2. **API Keys sofort erneuern:**
   - B2 Application Keys löschen und neu erstellen
   - JWT Secrets ändern
   - Datenbankpasswörter rotieren

3. **Team informieren:**
   - Alle Entwickler über Compromise informieren
   - Neue Credentials verteilen (sicher!)

## 📱 Team-Setup

### Neuer Entwickler im Team:

1. **Onboarding:**
```bash
# Repository setup
git clone <repo-url>
cd LAP
cp backend/.env.example backend/.env
cp Frontend/.env.example Frontend/.env
```

2. **Credentials erhalten:**
   - B2 Bucket Zugang (separater Key pro Entwickler)
   - JWT Secret (gemeinsam für Development)
   - Database Zugang

3. **Erste Schritte:**
```bash
# Alles testen
./start-dev.sh
```

## 🔄 Credential Rotation

### Regelmäßig erneuern (empfohlen):
- **JWT Secrets**: Alle 90 Tage
- **API Keys**: Alle 180 Tage
- **Database Passwords**: Alle 365 Tage

### Script für Rotation:
```bash
#!/bin/bash
# rotate-credentials.sh
echo "🔄 Rotating credentials..."
echo "1. Generate new JWT secret"
echo "2. Create new B2 application key"
echo "3. Update all environments"
echo "4. Test connections"
echo "5. Revoke old credentials"
```

## 🎓 Best Practices

### Development:
- Verwende separate B2 Buckets pro Entwickler
- Nie Production-Credentials in Development
- Regelmäßige Security-Reviews

### Code:
- Secrets nur über Environment Variables
- Input-Validierung für alle API-Endpunkte
- Sichere Error-Handling (keine sensiblen Daten in Logs)

### Monitoring:
- Failed Authentication Attempts loggen
- Unusual API Usage überwachen
- Regular Security Scans

## 📞 Support

Bei Sicherheitsproblemen oder Fragen:
1. Nicht in öffentlichen Channels posten
2. Direkt an Projektleitung wenden
3. Bei Compromise sofort handeln

---

**🔒 Sicherheit ist Verantwortung aller!**

Jeder Entwickler ist verantwortlich für den Schutz sensibler Daten.