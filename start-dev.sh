#!/bin/bash

# LAP Development Environment Script
# Single script for all development needs

set -e

echo "🚀 CIC To Give Development Environment"
echo "=============================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Configuration
WITH_PGADMIN=false
CLEAN_START=false

print_status() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

print_header() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

# Show help
show_help() {
    echo "CIC To Give Development Environment Manager"
    echo ""
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  start          Start development environment (default)"
    echo "  stop           Stop all containers"
    echo "  restart        Restart all containers"
    echo "  logs           Show recent logs"
    echo "  status         Show container status"
    echo "  db             Connect to database (psql)"
    echo "  clean          Clean up all containers and volumes"
    echo ""
    echo "Options:"
    echo "  --with-pgadmin Start with PgAdmin web interface"
    echo "  --clean        Clean containers before starting"
    echo "  --help, -h     Show this help"
    echo ""
    echo "Examples:"
    echo "  $0                    # Start minimal environment (3 containers)"
    echo "  $0 --with-pgadmin     # Start with database UI (4 containers)"
    echo "  $0 --clean            # Clean start"
    echo "  $0 stop               # Stop everything"
    echo "  $0 db                 # Connect to database"
    echo ""
    echo "URLs after start:"
    echo "  Frontend:  http://localhost:5173"
    echo "  Backend:   http://localhost:8080"
    echo "  Database:  localhost:5433"
    echo "  PgAdmin:   http://localhost:5050 (if --with-pgadmin)"
    echo ""
    echo "Credentials:"
    echo "  App:       testuser / password123"
    echo "  PgAdmin:   admin@lap.com / admin123"
    echo "  Database:  lapuser / lappassword"
}

# Parse arguments
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --with-pgadmin)
                WITH_PGADMIN=true
                shift
                ;;
            --clean)
                CLEAN_START=true
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            start|stop|restart|logs|status|db|clean)
                COMMAND="$1"
                shift
                ;;
            *)
                print_error "Unknown option: $1"
                echo "Use --help for usage information"
                exit 1
                ;;
        esac
    done

    # Default command
    COMMAND="${COMMAND:-start}"
}

# Check if Podman is installed
check_podman() {
    if ! command -v podman &> /dev/null; then
        print_error "Podman is not installed!"
        echo ""
        echo "Install Podman:"
        echo "  Ubuntu/Debian: sudo apt-get install podman"
        echo "  Fedora:        sudo dnf install podman"
        echo "  Arch:          sudo pacman -S podman"
        echo "  macOS:         brew install podman"
        exit 1
    fi
    print_status "Podman is available"
}

# Create network
create_network() {
    podman network exists lap-network || podman network create lap-network > /dev/null 2>&1
}

# Clean up containers
cleanup() {
    print_header "Cleaning up containers..."

    # Stop containers
    podman stop lap-postgres lap-backend lap-frontend lap-pgadmin 2>/dev/null || true

    # Remove containers
    podman rm lap-postgres lap-backend lap-frontend lap-pgadmin 2>/dev/null || true

    if [[ "$CLEAN_START" == "true" ]]; then
        print_info "Removing volumes and images..."
        podman volume rm lap_postgres_data lap_pgadmin_data 2>/dev/null || true
        podman rmi lap-backend lap-frontend 2>/dev/null || true
    fi

    print_status "Cleanup completed"
}

# Start PostgreSQL
start_postgres() {
    print_header "Starting PostgreSQL..."

    podman run -d \
        --name lap-postgres \
        --network lap-network \
        -p 5433:5432 \
        -e POSTGRES_DB=lapdb \
        -e POSTGRES_USER=lapuser \
        -e POSTGRES_PASSWORD=lappassword \
        -e PGDATA=/var/lib/postgresql/data/pgdata \
        -v lap_postgres_data:/var/lib/postgresql/data:Z \
        docker.io/postgres:15-alpine > /dev/null

    # Wait for postgres
    print_info "Waiting for PostgreSQL..."
    for i in {1..30}; do
        if podman exec lap-postgres pg_isready -U lapuser -d lapdb &> /dev/null; then
            print_status "PostgreSQL ready"
            break
        fi
        if [ $i -eq 30 ]; then
            print_error "PostgreSQL failed to start"
            exit 1
        fi
        sleep 1
    done
}

# Setup database
setup_database() {
    print_header "Setting up database..."

    # Create users table
    podman exec lap-postgres psql -U lapuser -d lapdb -c "
        CREATE TABLE IF NOT EXISTS users (
            id BIGSERIAL PRIMARY KEY,
            username VARCHAR(50) UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT TRUE
        );
    " > /dev/null 2>&1

    print_status "Database schema ready"
}

# Start Backend
start_backend() {
    print_header "Starting Backend..."

    # Build backend image if not exists or clean start
    if [[ "$CLEAN_START" == "true" ]] || ! podman image exists lap-backend; then
        print_info "Building backend image..."
        podman build -t lap-backend backend/ > /dev/null || {
            print_error "Backend build failed"
            exit 1
        }
    fi

    podman run -d \
        --name lap-backend \
        --network lap-network \
        -p 8080:8080 \
        -e SPRING_DATASOURCE_URL=jdbc:postgresql://lap-postgres:5432/lapdb \
        -e SPRING_DATASOURCE_USERNAME=lapuser \
        -e SPRING_DATASOURCE_PASSWORD=lappassword \
        -e SPRING_JPA_HIBERNATE_DDL_AUTO=update \
        -e SPRING_JPA_SHOW_SQL=true \
        -e JWT_SECRET=mySecretKey123456789012345678901234567890123456789012345678901234567890 \
        -e JWT_EXPIRATION=86400000 \
        -v ./backend/src:/app/src:Z \
        lap-backend > /dev/null

    # Wait for backend
    print_info "Waiting for Backend API..."
    for i in {1..60}; do
        if curl -s http://localhost:8080/api/auth/me &> /dev/null; then
            print_status "Backend API ready"
            break
        fi
        if [ $i -eq 60 ]; then
            print_error "Backend failed to start"
            exit 1
        fi
        sleep 2
    done
}

# Create test user
create_test_user() {
    print_info "Creating test user..."
    curl -s -X POST http://localhost:8080/api/auth/register \
        -H "Content-Type: application/json" \
        -d '{"username":"testuser","email":"test@example.com","password":"password123"}' > /dev/null 2>&1 || true
}

# Start Frontend
start_frontend() {
    print_header "Starting Frontend..."

    # Build frontend image if not exists or clean start
    if [[ "$CLEAN_START" == "true" ]] || ! podman image exists lap-frontend; then
        print_info "Building frontend image..."
        podman build -t lap-frontend Frontend/ > /dev/null || {
            print_error "Frontend build failed"
            exit 1
        }
    fi

    podman run -d \
        --name lap-frontend \
        --network lap-network \
        -p 5173:5173 \
        -e VITE_API_URL=http://localhost:8080 \
        -v ./Frontend/src:/app/src:Z \
        -v ./Frontend/public:/app/public:Z \
        lap-frontend > /dev/null

    # Wait for frontend
    print_info "Waiting for Frontend..."
    for i in {1..30}; do
        if curl -s http://localhost:5173 &> /dev/null; then
            print_status "Frontend ready"
            break
        fi
        if [ $i -eq 30 ]; then
            print_error "Frontend failed to start"
            exit 1
        fi
        sleep 1
    done
}

# Start PgAdmin (optional)
start_pgadmin() {
    if [[ "$WITH_PGADMIN" == "true" ]]; then
        print_header "Starting PgAdmin..."

        podman run -d \
            --name lap-pgadmin \
            --network lap-network \
            -p 5050:80 \
            -e PGADMIN_DEFAULT_EMAIL=admin@lap.com \
            -e PGADMIN_DEFAULT_PASSWORD=admin123 \
            -e PGADMIN_CONFIG_SERVER_MODE=False \
            -v lap_pgadmin_data:/var/lib/pgadmin:Z \
            docker.io/dpage/pgadmin4:latest > /dev/null

        print_status "PgAdmin ready"
    fi
}

# Show final status
show_status() {
    echo ""
    print_status "🎉 LAP Development Environment is running!"
    echo ""

    print_info "Access URLs:"
    echo "  📱 Frontend:     http://localhost:5173"
    echo "  🔧 Backend API:  http://localhost:8080"
    echo "  🗄️  Database:     localhost:5433"

    if [[ "$WITH_PGADMIN" == "true" ]]; then
        echo "  🔍 PgAdmin:      http://localhost:5050"
    fi

    echo ""
    print_info "Test Credentials:"
    echo "  🔐 App Login:    testuser / password123"

    if [[ "$WITH_PGADMIN" == "true" ]]; then
        echo "  🔐 PgAdmin:      admin@lap.com / admin123"
    fi

    echo ""
    print_info "Hot Reload Features:"
    echo "  ⚡ Frontend:      Edit ./Frontend/src → instant updates"
    echo "  ⚡ Backend:       Edit ./backend/src → auto restart"
    echo ""

    print_info "Container Status:"
    podman ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep "lap-" || echo "No containers running"

    if [[ "$WITH_PGADMIN" == "false" ]]; then
        echo ""
        print_info "Database Access:"
        echo "  Command: $0 db"
    fi
}

# Command implementations
cmd_start() {
    print_info "Starting LAP Development Environment..."
    if [[ "$WITH_PGADMIN" == "true" ]]; then
        print_info "Mode: Full (with PgAdmin)"
    else
        print_info "Mode: Minimal (3 containers)"
    fi
    echo ""

    check_podman
    create_network
    cleanup
    start_postgres
    setup_database
    start_backend
    create_test_user
    start_frontend
    start_pgadmin
    show_status
}

cmd_stop() {
    print_header "Stopping all containers..."
    cleanup
    print_status "All containers stopped"
}

cmd_restart() {
    cmd_stop
    sleep 2
    cmd_start
}

cmd_logs() {
    echo "=== Backend Logs ==="
    podman logs --tail=20 lap-backend 2>/dev/null || echo "Backend not running"
    echo ""
    echo "=== Frontend Logs ==="
    podman logs --tail=20 lap-frontend 2>/dev/null || echo "Frontend not running"
    echo ""
    echo "=== Database Logs ==="
    podman logs --tail=10 lap-postgres 2>/dev/null || echo "Database not running"
}

cmd_status() {
    echo "Container Status:"
    podman ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep "lap-" || echo "No LAP containers running"
    echo ""

    # Quick health check
    print_info "Service Health:"
    curl -s http://localhost:5173 &> /dev/null && echo "  ✅ Frontend: OK" || echo "  ❌ Frontend: Down"
    curl -s http://localhost:8080/api/auth/me &> /dev/null && echo "  ✅ Backend: OK" || echo "  ❌ Backend: Down"
    podman exec lap-postgres pg_isready -U lapuser -d lapdb &> /dev/null && echo "  ✅ Database: OK" || echo "  ❌ Database: Down"

    if podman ps | grep -q lap-pgadmin; then
        curl -s http://localhost:5050 &> /dev/null && echo "  ✅ PgAdmin: OK" || echo "  ❌ PgAdmin: Down"
    fi
}

cmd_db() {
    print_info "Connecting to database..."
    if ! podman ps | grep -q lap-postgres; then
        print_error "Database container is not running. Start it first with: $0 start"
        exit 1
    fi
    podman exec -it lap-postgres psql -U lapuser -d lapdb
}

cmd_clean() {
    print_warning "This will remove all containers, images, and data!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        CLEAN_START=true
        cleanup
        print_status "Clean up completed"
    else
        echo "Cancelled"
    fi
}

# Main execution
main() {
    parse_args "$@"

    case "$COMMAND" in
        start)   cmd_start ;;
        stop)    cmd_stop ;;
        restart) cmd_restart ;;
        logs)    cmd_logs ;;
        status)  cmd_status ;;
        db)      cmd_db ;;
        clean)   cmd_clean ;;
        *)
            print_error "Unknown command: $COMMAND"
            show_help
            exit 1
            ;;
    esac
}

# Run main function
main "$@"
