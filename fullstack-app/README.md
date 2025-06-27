# Fullstack Application with Next.js and Spring Boot

This is a fullstack application with a Next.js frontend and a Spring Boot backend, featuring a modern tech stack for building scalable web applications.

## Project Structure

- `frontend/`: Next.js frontend application with TypeScript
- `backend/`: Spring Boot backend application with PostgreSQL
- `database/`: Database initialization scripts
- `docker-compose.yml`: Container orchestration
- `README_Docker.md`: Detailed Docker/Podman setup guide

## Tech Stack

### Backend
- **Java 17** with Spring Boot 3.2.5
- **Spring Security** with JWT authentication
- **Spring Data JPA** for database operations
- **PostgreSQL** as primary database
- **H2** for development/testing (optional)
- **Maven** for dependency management

### Frontend
- **Next.js 15.3.2** with React 19
- **TypeScript** for type safety
- **Tailwind CSS 4** for styling
- **Responsive Design** for mobile and desktop

## Prerequisites

- **Node.js** (v18 or later)
- **npm** or yarn
- **Java 17** or later
- **Maven 3.6+**
- **PostgreSQL 15+** (or Docker/Podman for containerized setup)

## Quick Start

### Option 1: Container Setup (Recommended)

```bash
# With Docker
docker-compose up -d

# With Podman
./podman-start.sh

# Or simplified version
docker-compose -f docker-compose.simple.yml up -d
```

### Option 2: Local Development

#### 1. Start PostgreSQL Database
```bash
# Using Docker for database only
docker-compose up -d database

# Or install PostgreSQL locally
sudo pacman -S postgresql  # Arch Linux
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### 2. Setup Database
```sql
-- Connect to PostgreSQL
sudo -u postgres psql

-- Create database and user
CREATE DATABASE cictogive;
CREATE USER cictogive_user WITH PASSWORD 'password';
GRANT ALL PRIVILEGES ON DATABASE cictogive TO cictogive_user;
```

#### 3. Configure Backend
```bash
cd backend

# Update application.properties if needed
# Default configuration points to localhost:5432

# Run the Spring Boot application
./mvnw spring-boot:run
```

#### 4. Start Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Application URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Database**: localhost:5432 (PostgreSQL)

## Database Configuration

### PostgreSQL (Production & Development)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/cictogive
spring.datasource.username=postgres
spring.datasource.password=password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

### H2 (Testing Only)
```properties
# For testing purposes only
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.username=sa
spring.datasource.password=password
spring.h2.console.enabled=true
```

## Features

### Core Functionality
- **User Authentication** with JWT tokens
- **Item Management** (Create, Read, Update, Delete)
- **File Upload** for item images
- **Search & Filter** by category and text
- **Comment System** for items
- **Responsive Design** for all devices

### Security Features
- **BCrypt Password Hashing**
- **JWT Token Authentication**
- **CORS Configuration**
- **Input Validation**
- **SQL Injection Protection**

### Technical Features
- **RESTful API Design**
- **Database Migrations**
- **Health Checks**
- **Docker Support**
- **Production Ready**

## API Endpoints

### Authentication
- `POST /api/auth/register`: User registration
- `POST /api/auth/login`: User login
- `POST /api/auth/logout`: User logout

### Items
- `GET /api/items`: Get all items (with pagination & filters)
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

## Environment Variables

### Backend
```bash
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/cictogive
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=password

# JWT Configuration
JWT_SECRET=your-secret-key
JWT_EXPIRATION=86400000

# CORS
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

### Frontend
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
```

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

# Type checking
npm run type-check
```

## Testing

### Test Accounts (Default Data)
| Username | Email | Password |
|----------|-------|----------|
| admin | admin@cictogive.com | password123 |
| john_doe | john@example.com | password123 |
| jane_smith | jane@example.com | password123 |

### Database Test Data
The application includes sample items and comments for testing purposes.

## Production Deployment

### With Docker/Podman
```bash
# Production build
docker-compose -f docker-compose.yml up -d --build

# Or with Podman
./podman-start.sh
```

### Manual Deployment
1. Build backend: `./mvnw clean package`
2. Build frontend: `npm run build`
3. Setup PostgreSQL database
4. Configure environment variables
5. Deploy JAR file and static assets

## Troubleshooting

### Common Issues

**Port conflicts:**
```bash
# Check which process uses the port
sudo lsof -i :3000
sudo lsof -i :8080
sudo lsof -i :5432

# Kill process if needed
sudo kill -9 <PID>
```

**Database connection issues:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check database connectivity
psql -h localhost -U postgres -d cictogive
```

**Build issues:**
```bash
# Clean Maven cache
./mvnw clean

# Clear npm cache
npm cache clean --force

# Rebuild everything
./mvnw clean package
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Documentation

- **Complete Docker Guide**: See `README_Docker.md`
- **LAP Documentation**: See `LAP_Dokumentation_CIC_to_Give.tex`
- **API Documentation**: Available at `/api/swagger-ui` (when running)

## License

This project is developed for educational purposes as part of a coding apprenticeship final exam (LAP - Lehrabschlussprüfung).

---

**CIC to Give** - A modern, secure platform for free item exchange built with Spring Boot and Next.js.