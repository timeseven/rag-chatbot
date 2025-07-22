# RAG Chatbot

A full-stack Retrieval-Augmented Generation (RAG) chatbot system that allows users to upload documents and ask context-aware questions.

---

## ✨ Features

- Upload PDF, DOCX, TXT documents
- Ask questions based on uploaded content
- View source documents alongside answers
- Multi-tenant support via `X-Tenant-ID`
- File upload progress & modern mobile-first UI
- Basic rate limiting to prevent abuse

---

## 🛠️ Tech Stack

### Backend

- **FastAPI** – API framework
- **LangChain** – RAG pipeline and orchestration
- **Qdrant** – Vector database for document indexing
- **OpenAI** – Embedding and answer generation
- **Pydantic** – Schema validation and settings

### Frontend

- **React Native + Expo** – Cross-platform app
- **Tailwind CSS / NativeWind** – Modern responsive UI
- **UI library** – React Native Reusables - Universal shadcn/ui for React Native

---

## 🧠 How RAG Works

1. **Document Loading**  
   Supports PDF, DOCX, and TXT using LangChain loaders.

2. **Document Splitting**  
   Files are split into smaller chunks for better retrieval.

3. **Embeddings & Vector Store**  
   - Embeddings generated using OpenAI
   - Stored and indexed in Qdrant

4. **Retrieval**  
   Relevant chunks are retrieved based on user question.

5. **Question Answering**  
   LangChain combines retrieved context and user query to generate a final answer.

---

## 🚀 Getting Started

### 1. Install Docker and Docker Compose
Make sure Docker and Docker Compose are installed. Then start Qdrant using the provided docker-compose.yml.
```
docker-compose up -d
```

### 2. Set up environment variables
Rename .env.dev in both frontend and backend folder to .env and fill in the required configuration variables.

### 3. Install uv and just for backend and bun for frontend
Backend:
Install uv for Python depencency management and just as a command runner.

Frontend:
Install bun for TypeScript and JavaScript dependency management.


### 4. Install depencencies and run the project
Backend:
```
cd backend
uv venv
uv sync
just run
```
Frontend:
```
cd frontend
bun install
bun run start
```


## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.