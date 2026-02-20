# Document Signature Application

A DocuSign-like digital signature platform built with Java Spring Boot and React.

## Project Structure

- `signatureapp/` (Root): Contains Backend code (Spring Boot).
- `signatureapp/frontend/`: Contains Frontend code (React + Vite).

## Prerequisites

- Java 17+
- Maven (or use included `mvnw`)
- Node.js 18+
- PostgreSQL Database (`signature_db`)

## Setup & Run

### Database
1.  Ensure PostgreSQL is running.
2.  Create a database named `signature_db`.
3.  Update `src/main/resources/application.properties` with your database credentials.

### Backend
1.  Open a terminal in the root directory.
2.  Run the application:
    ```bash
    ./mvnw spring-boot:run
    ```
    The backend will start on `http://localhost:8080`.

### Frontend
1.  Open a new terminal and navigate to `frontend`:
    ```bash
    cd frontend
    ```
    (Note: On Windows PowerShell, use `cd frontend`)
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
    The frontend will start on `http://localhost:5173`.

## Features

- **Authentication**: Register and Login using JWT.
- **Documents**: Upload PDF documents, view list of uploaded docs.
- **Digital Signature**:
    - View PDF in browser.
    - Drag and drop a signature placeholder.
    - Sign document (embeds signature into PDF).
    - Download signed PDF.
- **Security**: Secured endpoints, CORS configured for frontend.

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/docs/upload`
- `GET /api/docs`
- `GET /api/docs/{id}`
- `GET /api/docs/download/{id}`
- `POST /api/signatures/sign`

## Frontend Routes

- `/login`: User Login
- `/register`: User Registration
- `/dashboard`: view documents
- `/sign/:id`: Sign a document
