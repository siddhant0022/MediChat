# MediChat

MediChat is a healthcare-focused AI assistant that lets users ask questions about medical documents and receive grounded answers based on indexed PDF content. The app combines a modern React frontend with a Node.js/Express backend, Google Gemini for chat and embeddings, and Pinecone for vector-based retrieval.

## Overview

This project is designed to:

- let users ask medical questions through a polished web interface
- retrieve relevant information from indexed document chunks
- use AI to rewrite and answer questions based only on retrieved context
- provide a foundation for document-grounded medical Q&A workflows

## Key Features

- responsive landing page and healthcare-focused UI
- chat experience via the /chat route
- query rewriting for clearer standalone medical questions
- semantic search using embeddings
- context-based answer generation with Gemini
- PDF ingestion pipeline for storing document embeddings in Pinecone
- Express API for the frontend chat flow

## Tech Stack

- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS and custom UI components
- Backend: Express.js
- AI model: Google Gemini (gemini-2.0-flash)
- Embeddings: @langchain/google-genai
- Vector database: Pinecone
- Document processing: LangChain + PDF parsing

## Project Structure

```text
MediChat/
├── backend/
│   └── server/
│       └── index.ts
├── public/
├── src/
│   ├── api/
│   │   └── chat.ts
│   ├── components/
│   │   ├── chatScreen.tsx
│   │   ├── homePage.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── pdfUtils.ts
│   │   ├── queryUtils.ts
│   │   └── ...
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env.example
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── README.md
└── ...
```

## How It Works

1. The frontend loads the landing page and chat interface.
2. A user submits a medical question.
3. The backend receives the request at /api/chat.
4. The app rewrites the question into a clearer standalone medical prompt.
5. Embeddings are created for the query.
6. Pinecone retrieves the most relevant document chunks.
7. Gemini uses that retrieved context to generate a grounded answer.
8. The result is returned to the user.

## Required Environment Variables

Create a .env file in the project root using the values from .env.example:

```env
GEMINI_API_KEY=your_google_gemini_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_INDEX_NAME=your_pinecone_index_name
```

### Notes

- GEMINI_API_KEY is used for embeddings and response generation.
- PINECONE_API_KEY is required to connect to your Pinecone project.
- PINECONE_INDEX_NAME should match your existing vector index.

## Installation

```bash
npm install
```

## Running the App

### Start the frontend

```bash
npm run dev
```

The Vite app usually runs at:

```text
http://localhost:5173
```

### Start the backend

```bash
npm run server
```

The Express API runs at:

```text
http://localhost:5000
```

### Run backend in watch mode

```bash
npm run server:dev
```

## PDF Indexing

The project includes a PDF ingestion script in src/lib/pdfUtils.ts to load a PDF, split it into chunks, generate embeddings, and store them in Pinecone.

To run it:

```bash
npx tsx src/lib/pdfUtils.ts
```

Make sure the PDF exists at:

```ts
const PDF_PATH = './src/lib/MediChat-dataSet.pdf';
```

If the file name or location changes, update the path before running the script.

## API Endpoint

### POST /api/chat

Request body:

```json
{
  "question": "What are the symptoms of diabetes?"
}
```

Example response:

```json
{
  "answer": "The retrieved documents indicate..."
}
```

## Scripts

```json
{
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "server": "tsx backend/server/index.ts",
  "server:dev": "tsx watch backend/server/index.ts"
}
```

## Important Notes

- This is a document-grounded medical assistant and should be treated as an experimental or prototype healthcare application.
- The system answers only from the indexed document context and will avoid inventing unsupported information.
- Ensure your Pinecone index already exists and contains the vectorized medical content before testing the app.
- Medical advice should not replace professional diagnosis or consultation.

## License

This project does not currently declare a license in the repository.

## Contributing

Contributions are welcome. Areas that may be improved include:

- retrieval quality and document preparation
- UI/UX improvements
- safety and accuracy of medical prompts
- better environment configuration and deployment setup

## Quick Start Checklist

1. Copy .env.example to .env
2. Add your Gemini and Pinecone keys
3. Ensure your Pinecone index is created and configured
4. Run npm install
5. Start frontend with npm run dev
6. Start backend with npm run server
7. Ask a medical question through the app
