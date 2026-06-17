# AI Dev Assistant API

A production-ready AI assistant backend built with TypeScript, featuring a **Planner → Context → Agent** architecture. Goes beyond a simple chatbot: a planner LLM first decides how to handle each request (RAG search, conversation history lookup, direct answer, tool use, or clarification), then routes to the appropriate pipeline before generating a streaming response.

## Architecture

```
User Message
     │
     ▼
┌─────────────────┐
│  Planner Agent  │  ← GPT-4.1-mini with structured output (JSON)
│                 │    Decides: SEARCH_DOCUMENTS | SEARCH_CONVERSATIONS |
│                 │            ANSWER_DIRECTLY | CREATE_TASK | ASK_CLARIFICATION
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Context Builder │  ← Fetches relevant data based on planner decision
│                 │    RAG retrieval (Qdrant) or conversation history (Prisma)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Tool Agent     │  ← OpenAI function calling with custom tools
│                 │    Iterates through tool calls until resolution
└────────┬────────┘
         │
         ▼
  Streaming Response  ← Chunked transfer encoding (SSE-compatible)
```

## Features

- **Planner Agent** — LLM-based routing with structured JSON output; decouples intent classification from response generation
- **RAG Pipeline** — LangChain + Qdrant vector store + OpenAI embeddings; returns answer + source documents with metadata
- **Tool-calling Agent** — OpenAI function calling loop; resolves multi-step tool use before final response
- **Streaming** — Chunked HTTP streaming for real-time UX
- **Conversation Memory** — Full history persisted via Prisma; injected into every agent call for context continuity
- **Document Management** — REST endpoints to ingest and retrieve documents into the knowledge base

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js + TypeScript |
| Framework | Express 5 |
| LLM | OpenAI GPT-4.1-mini (chat + structured output + function calling) |
| RAG | LangChain + `@langchain/qdrant` |
| Vector DB | Qdrant (Docker) |
| Embeddings | OpenAI `text-embedding-*` |
| Persistence | Prisma + PostgreSQL |
| Streaming | HTTP chunked transfer encoding |

## Getting Started

### Prerequisites

- Node.js 18+
- Docker (for Qdrant)
- OpenAI API key
- PostgreSQL instance

### Setup

```bash
# Clone the repo
git clone https://github.com/IvanMelzi/ai-dev-assistant-api.git
cd ai-dev-assistant-api

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
# Add your OPENAI_API_KEY and DATABASE_URL

# Start Qdrant
docker-compose up -d

# Run Prisma migrations
npx prisma migrate dev

# Start the dev server
npm run dev
```

### Initialize the Knowledge Base

```bash
# Create a Qdrant collection
npm run create:collection

# Load documents into the vector store
npm run load:documents

# Test RAG retrieval
npm run test:rag
```

## API Endpoints

### Chat

```
POST /chat
```
Main chat endpoint. Runs the full Planner → Context Builder → Agent pipeline with streaming response.

```json
{
  "conversationId": "uuid",
  "message": "What does the onboarding doc say about access provisioning?"
}
```

```
POST /chat/tools
```
Chat endpoint with explicit tool-calling mode.

### Conversations

```
GET  /conversations          # List all conversations
GET  /conversations/:id      # Get conversation with full message history
```

### Documents

```
POST /documents              # Ingest a document into the knowledge base
GET  /documents              # List all documents
```

Request body for ingestion:
```json
{
  "title": "Onboarding Guide",
  "content": "..."
}
```

## Testing Individual Components

```bash
npm run test:langchain    # Test LangChain setup
npm run test:prompt       # Test prompt templates
npm run test:chain        # Test LLM chain
npm run test:retriever    # Test Qdrant retriever
npm run test:rag          # Test full RAG pipeline
npm run test:simple-agent # Test basic agent
npm run test:tool-agent   # Test tool-calling agent
```

## Design Decisions

**Why a Planner Agent?**  
Separating intent classification from generation avoids forcing the main LLM to make retrieval decisions mid-generation. The planner runs first, produces a structured action + optional search query, and the context builder executes it. This keeps each component focused and makes the system easier to extend with new actions.

**Why Qdrant over pgvector?**  
Qdrant runs as a standalone service with a typed REST client, making it easy to spin up locally via Docker and deploy independently. For a project at this scale, it avoids mixing vector operations into the relational DB.

**Why streaming even in the API?**  
First-token latency matters for UX. The response streams via chunked transfer encoding so a frontend can start rendering while the model is still generating — no buffering.

## Roadmap

- [ ] React frontend with streaming UI
- [ ] LangGraph migration for the planner/agent flow (explicit state graph)
- [ ] Document ingestion from PDF/URL
- [ ] Evaluation pipeline (RAGAS metrics)
- [ ] Docker Compose full stack (API + Qdrant + Postgres)

## Author

**Ivan Martinez Vega**
[LinkedIn](https://www.linkedin.com/in/ivan-martinez-vega/)
