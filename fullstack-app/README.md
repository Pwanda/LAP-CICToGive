# Fullstack Application with Next.js and Spring Boot

This is a fullstack application with a Next.js frontend and a Spring Boot backend, featuring PostgreSQL database and modern authentication.

## Project Structure

- `frontend/`: Next.js frontend application with TypeScript
- `backend/`: Spring Boot backend application with PostgreSQL
- `database/`: Database initialization scripts
- `docker-compose.yml`: Container orchestration for easy setup

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Java 17 or later
- Maven
- PostgreSQL 15+ (or use Docker setup)

## Quick Start with Docker (Recommended)

The easiest way to run the entire application:

```bash
# Start all services (PostgreSQL, Backend, Frontend)
docker-compose up -d

# Or use the automated script
./docker-start.sh

# For Podman users
./podman-start.sh
```

## Manual Setup

### 1. Start PostgreSQL Database

```bash
# Option A: Use Docker for database only
docker-compose up -d database

# Option B: Install PostgreSQL locally (Arch Linux)
sudo pacman -S postgresql
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Setup Database

```sql
-- Connect to PostgreSQL
sudo -u postgres psql

-- Create database and user
CREATE DATABASE cictogive;
CREATE USER postgres WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE cictogive TO postgres;
```

### 3. Running the Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Build and run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

3. The backend will start on http://localhost:8080
   - API endpoints will be available at http://localhost:8080/api
   - Health check: http://localhost:8080/actuator/health

### 4. Running the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. The frontend will start on http://localhost:3000

## Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Database**: localhost:5432 (PostgreSQL)

## Features

- **Authentication**: JWT-based user authentication with registration/login
- **Item Management**: Full CRUD operations for items with image upload
- **Search & Filter**: Filter items by category and search by text
- **Comments**: Users can comment on items
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Security**: BCrypt password hashing, CORS protection, input validation
- **Database**: PostgreSQL with JPA/Hibernate
- **Containerization**: Docker and Podman support

## Tech Stack

### Backend
- Spring Boot 3.2.5
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL
- Maven
- Java 17

### Frontend
- Next.js 15.3.2
- React 19
- TypeScript
- Tailwind CSS 4

## API Endpoints

### Authentication
- `POST /api/auth/register`: User registration
- `POST /api/auth/login`: User login
- `POST /api/auth/logout`: User logout

### Items
- `GET /api/items`: Get all items (with pagination and filters)
- `GET /api/items/{id}`: Get item by ID
- `POST /api/items`: Create a new item
- `PUT /api/items/{id}`: Update an existing item
- `DELETE /api/items/{id}`: Delete an item
- `GET /api/items/my-items`: Get current user's items

### Comments
- `GET /api/items/{id}/comments`: Get comments for an item
- `POST /api/items/{id}/comments`: Add comment to an item

### File Upload
- `POST /api/upload/images`: Upload item images

## Environment Configuration

### Backend (application.properties)
```properties
# PostgreSQL Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/cictogive
spring.datasource.username=postgres
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update

# JWT Configuration
jwt.secret=mySecretKeyForCICtoGiveApplication2024
jwt.expiration=86400000

# File Upload
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=50MB
```

### Frontend Environment Variables
```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

## Test Accounts

The application includes sample data with test accounts:

| Username | Email | Password |
|----------|-------|----------|
| admin | admin@cictogive.com | password123 |
| john_doe | john@example.com | password123 |
| jane_smith | jane@example.com | password123 |

## Development

### Backend Development
```bash
cd backend

# Run with hot reload
./mvnw spring-boot:run

# Run tests
./mvnw test

# Build JAR
./mvnw clean package
```

### Frontend Development
```bash
cd frontend

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Docker Setup

See `README_Docker.md` for detailed Docker and Podman setup instructions, including:
- Multi-container setup with PostgreSQL
- Rootless Podman configuration
- Production deployment options
- Troubleshooting guides

## Documentation

- **Complete Docker Guide**: `README_Docker.md`
- **Technical Documentation**: `LAP_Dokumentation_CIC_to_Give.tex`
- **API Documentation**: Available when backend is running

## Troubleshooting

### Common Issues

**Port conflicts:**
```bash
sudo lsof -i :3000  # Frontend
sudo lsof -i :8080  # Backend
sudo lsof -i :5432  # Database
```

**Database connection:**
```bash
# Test PostgreSQL connection
psql -h localhost -U postgres -d cictogive
```

**Clean build:**
```bash
# Backend
./mvnw clean package

# Frontend
npm cache clean --force && npm install
```

## License

This project is developed for educational purposes as part of a coding apprenticeship final exam (LAP - Lehrabschlussprüfung).