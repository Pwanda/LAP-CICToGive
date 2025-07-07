# LAP - Local Application Platform

A modern full-stack web application built with React, Spring Boot, and PostgreSQL, featuring JWT authentication and containerized development with Podman.

## 🚀 Quick Start for New Developers

### Prerequisites
- **Podman** (containerized development)
- **Git** (version control)
- **curl** (for testing APIs)

### One-Command Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd LAP

# Start everything (first-time setup included)
./start-dev.sh
```

**That's it!** ✨ The script will:
- Build all containers
- Set up PostgreSQL database  
- Create test user with proper authentication
- Start all services with hot reload

### Access Your Application

- 📱 **Frontend**: http://localhost:5173
- 🔧 **Backend API**: http://localhost:8080
- 🗄️ **Database**: localhost:5433
- 🔍 **PgAdmin**: http://localhost:5050 (with --with-pgadmin)

### Test Credentials

- **App Login**: `testuser` / `password123`
- **PgAdmin**: `admin@lap.com` / `admin123`
- **Database**: `lapuser` / `lappassword`

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    LAP Technology Stack                     │
├─────────────────────────────────────────────────────────────┤
│  Frontend                    │  Backend                     │
│  • React 18 + TypeScript    │  • Spring Boot 3.2          │
│  • Vite + Hot Reload        │  • Spring Security + JWT    │
│  • TailwindCSS + DaisyUI    │  • JPA/Hibernate           │
│  • React Router v7          │  • PostgreSQL Database      │
│  • React Query              │  • Maven Build System       │
├─────────────────────────────────────────────────────────────┤
│  Development Environment                                    │
│  • Podman Containers        │  • Hot Reload Enabled      │
│  • PostgreSQL Database      │  • PgAdmin Web Interface    │
│  • Volume Mounting          │  • Automated Setup         │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ Development Workflow

### Daily Development

```bash
# Start development environment
./start-dev.sh

# Your app is now running with hot reload:
# - Edit Frontend code in ./Frontend/src → instant browser updates
# - Edit Backend code in ./backend/src → automatic restart (~2-3s)
# - Database changes via JPA → automatic schema updates

# Stop when done
./start-dev.sh stop
```

### Available Commands

```bash
# Start all services (default)
./start-dev.sh

# Start with PgAdmin web interface
./start-dev.sh --with-pgadmin

# Clean start (removes containers/volumes)
./start-dev.sh --clean

# Stop all services  
./start-dev.sh stop

# Restart everything
./start-dev.sh restart

# View recent logs
./start-dev.sh logs

# Check container status
./start-dev.sh status

# Connect to database
./start-dev.sh db

# Clean everything (destructive)
./start-dev.sh clean
```

### Hot Reload Features

✅ **Frontend (React)**
- Instant UI updates on file save
- CSS/Tailwind changes apply immediately
- Component state preserved during updates
- TypeScript errors shown in browser

✅ **Backend (Spring Boot)**
- Automatic application restart on Java changes
- Database schema updates via JPA
- Live reload of configuration files
- DevTools integration

## 🔐 Authentication System

### JWT-Based Authentication
- **Registration**: Create new user accounts
- **Login**: Get JWT token for authenticated requests
- **Protected Routes**: Automatic redirect to login
- **Token Validation**: Server-side JWT verification
- **Secure Storage**: Client-side token management

### API Endpoints

```bash
# Register new user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"newuser","email":"user@example.com","password":"password123"}'

# Login to get JWT token
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Access protected endpoint
curl -X GET http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer <your-jwt-token>"
```

## 📁 Project Structure

```
LAP/
├── Frontend/                     # React TypeScript Application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── auth/           # Authentication components
│   │   │   └── Navigation.tsx   # App navigation
│   │   ├── pages/              # Page components
│   │   │   ├── HomePage.tsx    # Dashboard with DaisyUI card
│   │   │   ├── LoginPage.tsx   # User login
│   │   │   ├── RegisterPage.tsx # User registration
│   │   │   └── LandingPage.tsx # Public landing page
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── useAuth.tsx     # Authentication hook
│   │   │   └── useAuthProvider.tsx # Auth context provider
│   │   ├── services/           # API services
│   │   │   └── AuthService.ts  # Authentication API calls
│   │   ├── types/              # TypeScript type definitions
│   │   └── contexts/           # React contexts
│   ├── Dockerfile              # Frontend container config
│   ├── package.json            # Node dependencies
│   └── vite.config.ts          # Vite configuration
├── backend/                      # Spring Boot Application
│   ├── src/main/java/com/lap/
│   │   ├── config/             # Security & JWT configuration
│   │   │   ├── SecurityConfig.java      # Spring Security setup
│   │   │   ├── JwtUtil.java             # JWT token utilities
│   │   │   └── JwtAuthenticationFilter.java # JWT filter
│   │   ├── controller/         # REST API controllers
│   │   │   └── AuthController.java      # Authentication endpoints
│   │   ├── dto/                # Data Transfer Objects
│   │   │   └── AuthDTO.java             # Auth request/response DTOs
│   │   ├── entity/             # JPA entities
│   │   │   └── User.java                # User database entity
│   │   ├── repository/         # Data access layer
│   │   │   └── UserRepository.java      # User database operations
│   │   ├── service/            # Business logic layer
│   │   │   ├── AuthService.java         # Authentication business logic
│   │   │   └── CustomUserDetailsService.java # Spring Security user service
│   │   └── LapBackendApplication.java   # Main Spring Boot class
│   ├── src/main/resources/
│   │   ├── application.properties       # App configuration
│   │   └── db/init.sql                 # Database initialization
│   ├── Dockerfile                      # Backend container config
│   └── pom.xml                         # Maven dependencies
├── start-dev.sh                        # Development environment script
└── README.md                           # This file
```

## 🗄️ Database

### PostgreSQL Database
- **Host**: localhost:5433 (external) / lap-postgres:5432 (internal)
- **Database**: lapdb
- **User**: lapuser / lappassword
- **Schema**: Auto-created by JPA/Hibernate

### Database Access

```bash
# Direct PostgreSQL access
podman exec -it lap-postgres psql -U lapuser -d lapdb

# Web interface (PgAdmin)
# URL: http://localhost:5050
# Login: admin@lap.com / admin123
```

### Schema Management
- **JPA/Hibernate**: Automatic schema creation and updates
- **Migrations**: Handled by Spring Boot + JPA
- **Test Data**: Automatically created test user on startup

## 🔧 Configuration

### Environment Variables

The application uses the following environment variables (automatically set in containers):

**Backend:**
```env
SPRING_DATASOURCE_URL=jdbc:postgresql://lap-postgres:5432/lapdb
SPRING_DATASOURCE_USERNAME=lapuser
SPRING_DATASOURCE_PASSWORD=lappassword
JWT_SECRET=mySecretKey123456789012345678901234567890123456789012345678901234567890
JWT_EXPIRATION=86400000
```

**Frontend:**
```env
VITE_API_URL=http://localhost:8080
```

### Customization

**Backend Ports & Database:**
- Edit `start-dev.sh` to change ports
- Edit `backend/src/main/resources/application.properties` for database config

**Frontend Styling:**
- Modify `Frontend/tailwind.config.js` for Tailwind customization
- Edit `Frontend/src/index.css` for global styles

## 🚨 Troubleshooting

### Common Issues

**1. Permission denied error**
```bash
# If you get "Permission denied" when running the script
chmod +x ./start-dev.sh

# Then run the script
./start-dev.sh
```

**2. Containers won't start**
```bash
# Clean everything and restart
./start-dev.sh stop
./start-dev.sh clean
./start-dev.sh
```

**3. Port already in use**
```bash
# Check what's using the port
ss -tulpn | grep :8080

# Kill the process or change ports in start-dev.sh
```

**4. Database connection issues**
```bash
# Check PostgreSQL container
podman logs lap-postgres

# Test database connection
podman exec lap-postgres pg_isready -U lapuser -d lapdb
```

**5. Hot reload not working**
```bash
# Restart specific container
podman restart lap-frontend  # or lap-backend

# Check volume mounts
podman inspect lap-frontend | grep -A 5 Mounts
```

**6. Login not working**
```bash
# Check if test user exists
podman exec lap-postgres psql -U lapuser -d lapdb -c "SELECT * FROM users;"

# Re-create test user
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'
```

### Health Checks

```bash
# Check all services
curl http://localhost:5173          # Frontend
curl http://localhost:8080/api/auth/me  # Backend  
curl http://localhost:5050          # PgAdmin

```bash
# Container status
podman ps
./start-dev.sh status
```

## 📚 Adding Features

### Frontend Development

**Adding a new page:**
1. Create component in `Frontend/src/pages/`
2. Add route in `Frontend/src/App.tsx`
3. Hot reload will show changes instantly

**Adding components:**
1. Create in `Frontend/src/components/`
2. Use TypeScript for type safety
3. Leverage DaisyUI classes for styling

**API integration:**
1. Add service in `Frontend/src/services/`
2. Use React Query for data fetching
3. Handle authentication with useAuth hook

### Backend Development

**Adding REST endpoints:**
1. Create controller in `backend/src/main/java/com/lap/controller/`
2. Add DTOs in `dto/` package
3. Implement service logic in `service/` package

**Database entities:**
1. Create entity in `entity/` package
2. Add repository interface in `repository/`
3. JPA will auto-create tables

**Security:**
- Protected endpoints automatically require JWT
- Public endpoints: configure in `SecurityConfig.java`

## 🔄 Deployment

### Development → Production

**Environment-specific configs:**
- Use environment variables for sensitive data
- Separate `application-prod.properties` for production
- Build optimized Docker images for production

**Database Migration:**
- Export development data: `pg_dump`
- Use proper PostgreSQL instance for production
- Configure connection pooling and performance settings

## 🤝 Contributing

### Development Setup
1. Follow Quick Start guide
2. Create feature branch: `git checkout -b feature/your-feature`
3. Develop with hot reload enabled
4. Test authentication flows
5. Submit pull request

### Code Standards
- **Frontend**: TypeScript, ESLint, Prettier
- **Backend**: Java 21, Spring Boot conventions
- **Database**: JPA annotations, meaningful table names
- **Git**: Conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎯 Next Steps

After setup, you might want to:

1. **Explore the codebase** - Start with `App.tsx` and `AuthController.java`
2. **Test authentication** - Register a new user and login  
3. **Modify the HomePage** - It has a DaisyUI card component ready to customize
4. **Add new features** - The hot reload environment makes development fast
5. **Check the database** - Use `./start-dev.sh --with-pgadmin` to explore the schema

**Happy coding!** 🚀

For questions or issues, check the troubleshooting section or create an issue in the repository.