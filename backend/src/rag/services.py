from pathlib import Path

import aiofiles
from fastapi import UploadFile
from langchain.chains.combine_documents.stuff import create_stuff_documents_chain
from langchain.chains.retrieval import create_retrieval_chain
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import Docx2txtLoader, PyPDFLoader, TextLoader
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import Runnable
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_qdrant import QdrantVectorStore
from qdrant_client import QdrantClient, models
from qdrant_client.http.models import Distance, VectorParams

from src.core.config import settings
from src.rag.interface import IRagService


class RagService(IRagService):
    def __init__(self, qdrant_client: QdrantClient, embedding: OpenAIEmbeddings):
        self.qdrant_client = qdrant_client
        self.embedding = embedding
        self.COLLECTION_NAME = "tenant_docs"

    async def load_file(self, file: UploadFile) -> list[Document]:
        suffix = Path(file.filename).suffix.lower()

        if suffix not in [".pdf", ".docx", "doc", ".txt"]:
            raise ValueError("Unsupported file type.")

        # Create temp file
        async with aiofiles.tempfile.NamedTemporaryFile(suffix=suffix, delete=False) as tmp:
            await tmp.write(await file.read())
            temp_file = tmp.name

        if suffix == ".pdf":
            loader = PyPDFLoader(temp_file)
        elif suffix in [".docx", "doc"]:
            loader = Docx2txtLoader(temp_file)
        else:
            loader = TextLoader(temp_file)

        return loader.load()

    def split_documents(self, docs: list[Document]):
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1500, chunk_overlap=150)
        return text_splitter.split_documents(docs)

    def store_documents(self, docs: list[Document], tenant_id: str):
        for doc in docs:
            doc.metadata["tenant_id"] = tenant_id

        existing_collections = self.qdrant_client.get_collections().collections
        if self.COLLECTION_NAME not in [col.name for col in existing_collections]:
            self.qdrant_client.recreate_collection(
                collection_name=self.COLLECTION_NAME,
                vectors_config=VectorParams(size=1536, distance=Distance.COSINE),
            )

        vector_store = QdrantVectorStore(
            client=self.qdrant_client,
            collection_name=self.COLLECTION_NAME,
            embedding=self.embedding,
        )
        vector_store.add_documents(docs)

    def get_vectorstore(self, tenant_id: str):
        vector_store = QdrantVectorStore(
            client=self.qdrant_client,
            collection_name=self.COLLECTION_NAME,
            embedding=self.embedding,
        )

        filter_condition = models.Filter(
            must=[models.FieldCondition(key="metadata.tenant_id", match=models.MatchValue(value=tenant_id))]
        )

        return vector_store.as_retriever(search_kwargs={"filter": filter_condition})

    async def upload_file(self, tenant_id: str, file: UploadFile):
        docs = await self.load_file(file)
        docs = self.split_documents(docs)
        self.store_documents(docs, tenant_id)

    def get_qa_chain(self, tenant_id: str) -> Runnable:
        retriever = self.get_vectorstore(tenant_id)
        llm = ChatOpenAI(model_name="gpt-3.5-turbo", api_key=settings.OPENAI_API_KEY, temperature=0)

        system_prompt = (
            "Use the given context to answer the question. "
            "If you don't know the answer, say you don't know. "
            "Use three sentences maximum and keep the answer concise. "
            "Context: {context}"
        )

        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", system_prompt),
                ("human", "{input}"),
            ]
        )

        question_answer_chain = create_stuff_documents_chain(llm, prompt)

        return create_retrieval_chain(retriever, question_answer_chain)
