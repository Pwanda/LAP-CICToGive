# Fullstack Application with Next.js and Spring Boot

This is a fullstack application with a Next.js frontend and a Spring Boot backend.

## Project Structure

- `frontend/`: Next.js frontend application
- `backend/`: Spring Boot backend application

## Prerequisites

- Node.js (v18 or later)
- npm or yarn
- Java 17 or later
- Maven

## Running the Backend

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Build and run the Spring Boot application:
   ```
   mvn spring-boot:run
   ```

3. The backend will start on http://localhost:8080
   - API endpoints will be available at http://localhost:8080/api/items
   - H2 Console will be available at http://localhost:8080/h2-console (username: sa, password: password)

## Running the Frontend

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

4. The frontend will start on http://localhost:3000

## Features

- RESTful API with Spring Boot
- H2 in-memory database
- Next.js frontend with TypeScript
- Tailwind CSS for styling
- CRUD operations for items

## API Endpoints

- `GET /api/items`: Get all items
- `GET /api/items/{id}`: Get item by ID
- `POST /api/items`: Create a new item
- `PUT /api/items/{id}`: Update an existing item
- `DELETE /api/items/{id}`: Delete an item
