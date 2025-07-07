#!/bin/bash

# LAP Backend Development Startup Script
# This script sets up and starts the development environment

set -e

echo "🚀 Starting LAP Backend Development Environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if Docker is installed and running
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! docker info &> /dev/null; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi

    print_status "Docker is available and running"
}

# Check if Java is installed
check_java() {
    if ! command -v java &> /dev/null; then
        print_error "Java is not installed. Please install Java 17 or higher."
        exit 1
    fi

    JAVA_VERSION=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | cut -d'.' -f1)
    if [ "$JAVA_VERSION" -lt 17 ]; then
        print_error "Java 17 or higher is required. Current version: $JAVA_VERSION"
        exit 1
    fi

    print_status "Java $JAVA_VERSION is available"
}

# Check if Maven is installed
check_maven() {
    if ! command -v mvn &> /dev/null; then
        print_error "Maven is not installed. Please install Maven 3.6+ first."
        exit 1
    fi

    print_status "Maven is available"
}

# Start PostgreSQL with Docker
start_database() {
    print_header "Starting PostgreSQL database..."

    # Check if postgres container is already running
    if docker ps | grep -q "lap-postgres"; then
        print_warning "PostgreSQL container is already running"
    else
        # Start the database
        docker-compose up -d postgres
        print_status "PostgreSQL container started"

        # Wait for database to be ready
        print_status "Waiting for database to be ready..."
        sleep 10

        # Check if database is healthy
        for i in {1..30}; do
            if docker exec lap-postgres pg_isready -U lapuser -d lapdb &> /dev/null; then
                print_status "Database is ready!"
                break
            fi
            if [ $i -eq 30 ]; then
                print_error "Database failed to start within 30 seconds"
                exit 1
            fi
            sleep 1
        done
    fi
}

# Start PgAdmin (optional)
start_pgadmin() {
    if [ "$1" = "--with-pgadmin" ]; then
        print_header "Starting PgAdmin..."
        docker-compose up -d pgadmin
        print_status "PgAdmin started at http://localhost:5050"
        print_status "Login: admin@lap.com / admin123"
    fi
}

# Install Maven dependencies
install_dependencies() {
    print_header "Installing Maven dependencies..."
    mvn clean install -DskipTests
    print_status "Dependencies installed successfully"
}

# Run database migrations/setup
setup_database() {
    print_header "Setting up database..."

    # Check if we can connect to the database
    if docker exec lap-postgres psql -U lapuser -d lapdb -c "\dt" &> /dev/null; then
        print_status "Database connection successful"
    else
        print_error "Cannot connect to database"
        exit 1
    fi
}

# Start the Spring Boot application
start_application() {
    print_header "Starting Spring Boot application..."
    print_status "The application will start on http://localhost:8080"
    print_status "API documentation available at http://localhost:8080/api/auth"
    print_status "Press Ctrl+C to stop the application"

    # Start the application with development profile
    mvn spring-boot:run -Dspring-boot.run.profiles=dev
}

# Cleanup function
cleanup() {
    print_header "Cleaning up..."
    if [ "$1" = "--stop-containers" ]; then
        docker-compose down
        print_status "Containers stopped"
    fi
}

# Main execution
main() {
    echo "======================================"
    echo "  LAP Backend Development Setup"
    echo "======================================"
    echo ""

    # Parse command line arguments
    WITH_PGADMIN=false
    STOP_CONTAINERS=false

    for arg in "$@"; do
        case $arg in
            --with-pgadmin)
                WITH_PGADMIN=true
                shift
                ;;
            --stop)
                STOP_CONTAINERS=true
                shift
                ;;
            --help|-h)
                echo "Usage: $0 [OPTIONS]"
                echo ""
                echo "Options:"
                echo "  --with-pgadmin    Start PgAdmin alongside the database"
                echo "  --stop           Stop all containers and exit"
                echo "  --help, -h       Show this help message"
                echo ""
                echo "Examples:"
                echo "  $0                    # Start with database only"
                echo "  $0 --with-pgadmin     # Start with database and PgAdmin"
                echo "  $0 --stop             # Stop all containers"
                exit 0
                ;;
            *)
                print_error "Unknown option: $arg"
                echo "Use --help for usage information"
                exit 1
                ;;
        esac
    done

    if [ "$STOP_CONTAINERS" = true ]; then
        cleanup --stop-containers
        exit 0
    fi

    # Run all checks and setup steps
    check_docker
    check_java
    check_maven
    start_database

    if [ "$WITH_PGADMIN" = true ]; then
        start_pgadmin --with-pgadmin
    fi

    install_dependencies
    setup_database

    echo ""
    print_status "Development environment is ready!"
    echo ""
    print_status "Database: postgresql://lapuser:lappassword@localhost:5432/lapdb"
    if [ "$WITH_PGADMIN" = true ]; then
        print_status "PgAdmin: http://localhost:5050 (admin@lap.com / admin123)"
    fi
    print_status "Backend API: http://localhost:8080"
    echo ""

    # Trap Ctrl+C to cleanup
    trap 'cleanup' INT

    start_application
}

# Run main function with all arguments
main "$@"
