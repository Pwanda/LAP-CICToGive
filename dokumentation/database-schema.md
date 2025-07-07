# 🗄️ Datenbankschema - LAP Verschenke-Plattform

Ein übersichtliches Diagramm der Datenbankstruktur und Beziehungen.

## 📊 Entity-Relationship-Diagram (ERD)

```
┌─────────────────────────┐       ┌─────────────────────────┐       ┌─────────────────────────┐
│         USERS           │       │         ITEMS           │       │       COMMENTS          │
├─────────────────────────┤       ├─────────────────────────┤       ├─────────────────────────┤
│ 🔑 id (PK)             │       │ 🔑 id (PK)             │       │ 🔑 id (PK)             │
│ 📧 username (UNIQUE)    │       │ 📝 title               │       │ 💬 content             │
│ ✉️  email (UNIQUE)      │       │ 📄 description         │       │ 🔗 item_id (FK)        │
│ 🔒 password             │◄──────┤ 🔗 user_id (FK)        │◄──────┤ 🔗 user_id (FK)        │
│ 🖼️  avatar_url          │  1:n  │ 🏷️  category            │  1:n  │ 📅 created_at          │
│ 📅 created_at           │       │ 📍 location            │       └─────────────────────────┘
│ 📅 updated_at           │       │ ⚡ condition           │
│ ✅ is_active            │       │ 🔄 is_reserved         │
└─────────────────────────┘       │ 📅 created_at          │
                                  │ 📅 updated_at          │
                                  └─────────────────────────┘
                                             │
                                             │ 1:n
                                             ▼
                                  ┌─────────────────────────┐
                                  │      ITEM_IMAGES        │
                                  ├─────────────────────────┤
                                  │ 🔗 item_id (FK)        │
                                  │ 🖼️  image_url           │
                                  └─────────────────────────┘
```

## 🔗 Beziehungen

### Hauptbeziehungen
- **User → Items**: `1:n` (Ein User kann mehrere Items besitzen)
- **User → Comments**: `1:n` (Ein User kann mehrere Kommentare schreiben)
- **Item → Comments**: `1:n` (Ein Item kann mehrere Kommentare haben)
- **Item → Item_Images**: `1:n` (Ein Item kann mehrere Bilder haben)

### Datenfluss-Diagramm
```
Frontend (React)
       ↕ HTTP/REST
API Layer (Spring Boot)
       ↕ JPA/Hibernate
PostgreSQL Database
       ↕ Foreign Keys
Referentielle Integrität

Seitlich:
API Layer ↔ Backblaze B2 (File Storage)
```

## 📋 Tabellen-Details

### 👤 users
| Spalte | Typ | Constraints | Beschreibung |
|--------|-----|-------------|--------------|
| `id` | BIGINT | PK, NOT NULL, AUTO_INCREMENT | Eindeutige Benutzer-ID |
| `username` | VARCHAR(50) | NOT NULL, UNIQUE | Benutzername (3-50 Zeichen) |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | E-Mail-Adresse |
| `password` | VARCHAR(255) | NOT NULL | BCrypt-verschlüsselt (Strength 12) |
| `avatar_url` | VARCHAR(500) | NULL | Profilbild-URL (Backblaze B2) |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Registrierungsdatum |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Letzte Profiländerung |
| `is_active` | BOOLEAN | DEFAULT TRUE | Account-Status |

### 📦 items
| Spalte | Typ | Constraints | Beschreibung |
|--------|-----|-------------|--------------|
| `id` | BIGINT | PK, NOT NULL, AUTO_INCREMENT | Eindeutige Artikel-ID |
| `title` | VARCHAR(100) | NOT NULL | Artikel-Titel |
| `description` | VARCHAR(500) | NOT NULL | Artikel-Beschreibung |
| `category` | VARCHAR(50) | NOT NULL | Kategorie (Elektronik, Möbel, etc.) |
| `location` | VARCHAR(100) | NOT NULL | Abholort |
| `condition` | VARCHAR(20) | NOT NULL | Zustand (Neu, Gut, Gebraucht) |
| `is_reserved` | BOOLEAN | DEFAULT FALSE | Reservierungsstatus |
| `user_id` | BIGINT | FK, NOT NULL | Besitzer-Referenz → users.id |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Erstellungsdatum |
| `updated_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Letzte Änderung |

### 💬 comments
| Spalte | Typ | Constraints | Beschreibung |
|--------|-----|-------------|--------------|
| `id` | BIGINT | PK, NOT NULL, AUTO_INCREMENT | Eindeutige Kommentar-ID |
| `content` | TEXT | NOT NULL | Kommentar-Text |
| `item_id` | BIGINT | FK, NOT NULL | Artikel-Referenz → items.id |
| `user_id` | BIGINT | FK, NOT NULL | Autor-Referenz → users.id |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Kommentar-Datum |

### 🖼️ item_images
| Spalte | Typ | Constraints | Beschreibung |
|--------|-----|-------------|--------------|
| `item_id` | BIGINT | FK, NOT NULL | Artikel-Referenz → items.id |
| `image_url` | VARCHAR(500) | NOT NULL | Bild-URL (Backblaze B2) |

## 🔗 Foreign Key Constraints

```sql
-- Items gehören zu Users
ALTER TABLE items 
ADD CONSTRAINT fk_items_user 
FOREIGN KEY (user_id) REFERENCES users(id) 
ON DELETE CASCADE;

-- Comments gehören zu Items
ALTER TABLE comments 
ADD CONSTRAINT fk_comments_item 
FOREIGN KEY (item_id) REFERENCES items(id) 
ON DELETE CASCADE;

-- Comments gehören zu Users
ALTER TABLE comments 
ADD CONSTRAINT fk_comments_user 
FOREIGN KEY (user_id) REFERENCES users(id) 
ON DELETE CASCADE;

-- Item Images gehören zu Items
ALTER TABLE item_images 
ADD CONSTRAINT fk_item_images_item 
FOREIGN KEY (item_id) REFERENCES items(id) 
ON DELETE CASCADE;
```

## 🚀 Performance-Indizes

```sql
-- Benutzer-Suche (Login)
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Artikel-Suche und Filter
CREATE INDEX idx_items_category ON items(category);
CREATE INDEX idx_items_location ON items(location);
CREATE INDEX idx_items_created_at ON items(created_at DESC);
CREATE INDEX idx_items_user_id ON items(user_id);
CREATE INDEX idx_items_is_reserved ON items(is_reserved);

-- Kommentar-Zugriff
CREATE INDEX idx_comments_item_id ON comments(item_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);

-- Volltext-Suche (PostgreSQL-spezifisch)
CREATE INDEX idx_items_search ON items 
USING gin(to_tsvector('german', title || ' ' || description));
```

## 🏗️ Systemarchitektur-Flow

```
┌─────────────────┐    HTTP/HTTPS     ┌─────────────────┐
│                 │◄─────────────────►│                 │
│  React Frontend │                   │ Spring Boot API │
│                 │    REST + JWT     │                 │
│ • TypeScript    │                   │ • Controllers   │
│ • TailwindCSS   │                   │ • Services      │
│ • DaisyUI       │                   │ • Repositories  │
│ • React Query   │                   │ • Security      │
└─────────────────┘                   └─────────────────┘
                                              │
                                              │ JPA/Hibernate
                                              ▼
                        ┌─────────────────┐         ┌─────────────────┐
                        │                 │         │                 │
                        │  PostgreSQL 14  │         │  Backblaze B2   │
                        │                 │         │                 │
                        │ • Tables        │◄────────┤ • File Storage  │
                        │ • Indexes       │         │ • CDN           │
                        │ • Constraints   │         │ • Image URLs    │
                        │ • ACID          │         │                 │
                        └─────────────────┘         └─────────────────┘
```

## 📱 API-Endpunkte vs. Datenbank-Operationen

| API Endpunkt | HTTP | Datenbank-Operation | Tabellen |
|--------------|------|---------------------|----------|
| `POST /api/auth/register` | POST | INSERT INTO users | users |
| `POST /api/auth/login` | POST | SELECT FROM users WHERE username | users |
| `GET /api/items` | GET | SELECT FROM items JOIN users | items, users |
| `POST /api/items` | POST | INSERT INTO items + item_images | items, item_images |
| `PUT /api/items/{id}` | PUT | UPDATE items WHERE id AND user_id | items |
| `DELETE /api/items/{id}` | DELETE | DELETE FROM items WHERE id AND user_id | items, comments, item_images |
| `POST /api/comments` | POST | INSERT INTO comments | comments |
| `GET /api/items/{id}/comments` | GET | SELECT FROM comments WHERE item_id | comments, users |

## 🔍 Häufige Queries

### Top-Performance-Queries:
```sql
-- 1. Artikel-Suche mit Filter (Hauptfunktion)
SELECT i.*, u.username, u.avatar_url 
FROM items i 
JOIN users u ON i.user_id = u.id 
WHERE i.category = ? 
  AND i.location ILIKE ? 
  AND i.is_reserved = false
ORDER BY i.created_at DESC 
LIMIT 12;

-- 2. Meine Artikel (Dashboard)
SELECT * FROM items 
WHERE user_id = ? 
ORDER BY created_at DESC;

-- 3. Artikel mit Kommentaren (Detail-Seite)
SELECT i.*, u.username,
       c.content, c.created_at as comment_date,
       cu.username as comment_author
FROM items i 
JOIN users u ON i.user_id = u.id
LEFT JOIN comments c ON i.id = c.item_id
LEFT JOIN users cu ON c.user_id = cu.id
WHERE i.id = ?
ORDER BY c.created_at ASC;

-- 4. Volltext-Suche
SELECT * FROM items 
WHERE to_tsvector('german', title || ' ' || description) 
      @@ plainto_tsquery('german', ?);
```

## 🛡️ Sicherheitsfeatures

### Datenbank-Ebene:
- ✅ **Foreign Key Constraints** - Referentielle Integrität
- ✅ **CASCADE DELETE** - Automatische Bereinigung
- ✅ **UNIQUE Constraints** - Keine Duplikate
- ✅ **NOT NULL** - Datenqualität
- ✅ **Indizierung** - Performance + Security

### Anwendungs-Ebene:
- ✅ **JPA/Hibernate** - SQL-Injection-Schutz
- ✅ **Bean Validation** - Input-Validierung
- ✅ **JWT Authentication** - Sichere API-Zugriffe
- ✅ **BCrypt Passwords** - Verschlüsselte Passwörter
- ✅ **User Ownership** - Benutzer können nur eigene Daten ändern

## 📊 Datenbank-Statistiken (Beispiel)

```
Geschätzte Datensätze (nach 1 Jahr):
┌─────────────┬─────────────┬──────────────┬─────────────────┐
│   Tabelle   │   Anzahl    │   Ø Größe    │   Total Größe   │
├─────────────┼─────────────┼──────────────┼─────────────────┤
│ users       │     1.000   │    200 Bytes │      200 KB     │
│ items       │    10.000   │    500 Bytes │        5 MB     │
│ comments    │    50.000   │    150 Bytes │      7.5 MB     │
│ item_images │    30.000   │    100 Bytes │        3 MB     │
├─────────────┼─────────────┼──────────────┼─────────────────┤
│ TOTAL       │    91.000   │              │     15.7 MB     │
└─────────────┴─────────────┴──────────────┴─────────────────┘

+ Backblaze B2 Files: ~300 MB (Bilder)
= Gesamte Datenmenge: ~316 MB
```

## 🚀 Skalierungsstrategien

### Kurzfristig (< 10.000 Users):
- ✅ Single PostgreSQL Instance
- ✅ Connection Pooling (HikariCP)
- ✅ Redis Cache für Sessions
- ✅ CDN für Bilder (Backblaze B2)

### Mittelfristig (< 100.000 Users):
- 📈 Read Replicas für Queries
- 📈 Sharding nach Regionen
- 📈 Elasticsearch für Volltext-Suche
- 📈 Microservices-Aufteilung

### Langfristig (> 100.000 Users):
- 🚀 Multi-Region Setup
- 🚀 Event-Driven Architecture
- 🚀 Kafka für Messaging
- 🚀 Kubernetes Orchestrierung

---

**💡 Dieses Schema ist optimiert für:**
- ⚡ Schnelle Artikel-Suche
- 🔒 Sichere Benutzerdaten
- 📱 Mobile-First Performance
- 🛠️ Einfache Wartung
- 📈 Horizontale Skalierung

**🎓 Entwickelt für die Lehrabschlussprüfung Applikationsentwicklung**