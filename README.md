# AI-Enhanced Knowledge Management System

<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

## Description

This project is an AI-Enhanced Knowledge Management System that allows users to store, retrieve, and analyze documents with AI-powered features. The system combines document management capabilities with artificial intelligence to provide enhanced document analysis, categorization, and question answering.

## Features

### Document Management
- Document Creation: Store documents with title, content, and tags
- Document Retrieval: Get individual documents by ID or list all documents
- Document Update: Modify existing document content, title, or tags
- Document Deletion: Remove documents from the system
- Document Search: Search documents by title or content with case-insensitive matching
- Document Tagging: Associate multiple tags with documents for categorization

### AI-Powered Analysis
- Document Summarization: Generate concise summaries of document content using AI
- Automatic Categorization: Analyze document content to suggest appropriate categories/tags
- Question Answering: Answer user questions based on the content of specific documents

## Tech Stack

- **Backend Framework**: NestJS (TypeScript)
- **Database**: SQLite with TypeORM
- **AI Integration**: OpenAI API
- **API Documentation**: Swagger
- **Validation**: class-validator and class-transformer

## Prerequisites

- Node.js (v16+)
- npm or yarn
- OpenAI API key

## Installation

```bash
# Clone the repository
$ git clone <repository-url>

# Navigate to the project directory
$ cd knowledge-management-system

# Install dependencies
$ npm install

# Set up environment variables
# Copy the example .env file and update with your values
$ cp .env.example .env

# The database will be automatically created when you start the application
# TypeORM is configured to synchronize the schema automatically in development
```

## Running the Application

```bash
# Development mode
$ npm run start:dev

# Production mode
$ npm run build
$ npm run start:prod
```

The application will be available at http://localhost:3000 by default.
Swagger API documentation will be available at http://localhost:3000/api/docs

## API Endpoints

### Document Endpoints
- `GET /api/documents` - Retrieve all documents
- `GET /api/documents/:id` - Get a specific document by ID
- `POST /api/documents` - Create a new document
- `PUT /api/documents/:id` - Update an existing document
- `DELETE /api/documents/:id` - Delete a document
- `GET /api/documents/search?query=` - Search documents by title or content

### Analysis Endpoints
- `GET /api/analysis/:documentId` - Get AI-generated analysis for a document
- `POST /api/analysis/:documentId/analyze` - Generate new analysis for a document
- `POST /api/analysis/:documentId/question` - Answer a question about a specific document

## Environment Variables

```
DATABASE_URL="./database.sqlite"
OPENAI_API_KEY="your-openai-api-key"
PORT=3000
```

## License

This project is [MIT licensed](LICENSE).
