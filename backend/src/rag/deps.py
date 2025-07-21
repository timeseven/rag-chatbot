from typing import Annotated

from fastapi import Depends
from langchain_openai import OpenAIEmbeddings
from qdrant_client import QdrantClient

from src.core.config import settings
from src.rag.interface import IRagService
from src.rag.services import RagService


def get_embedding() -> OpenAIEmbeddings:
    return OpenAIEmbeddings(model="text-embedding-3-small", openai_api_key=settings.OPENAI_API_KEY)


def get_qdrant_client() -> QdrantClient:
    return QdrantClient(host=settings.QDRANT_HOST, port=settings.QDRANT_PORT)


def get_rag_service(
    qdrant_client: Annotated[QdrantClient, Depends(get_qdrant_client)],
    embedding: Annotated[OpenAIEmbeddings, Depends(get_embedding)],
) -> IRagService:
    return RagService(qdrant_client, embedding)


RagServiceDep = Annotated[IRagService, Depends(get_rag_service)]
