from unittest.mock import AsyncMock, MagicMock, patch

import pytest
from fastapi import UploadFile
from langchain.schema import Document

from src.rag.services import RagService


@pytest.fixture
def mock_qdrant():
    return MagicMock()


@pytest.fixture
def mock_embedding():
    return MagicMock()


@pytest.fixture
def rag_service(mock_qdrant, mock_embedding):
    return RagService(mock_qdrant, mock_embedding)


def test_split_documents(rag_service):
    doc = Document(page_content="a" * 4000, metadata={})
    docs = [doc]
    result = rag_service.split_documents(docs)
    assert isinstance(result, list)
    assert len(result) > 1


def test_store_documents_creates_collection(rag_service, mock_qdrant, mock_embedding):
    docs = [Document(page_content="abc", metadata={})]
    mock_qdrant.get_collections.return_value.collections = []
    with patch("src.rag.services.QdrantVectorStore"):
        rag_service.store_documents(docs, "tenant1")
    mock_qdrant.recreate_collection.assert_called_once()
    assert docs[0].metadata["tenant_id"] == "tenant1"


def test_store_documents_no_create_if_exists(rag_service, mock_qdrant):
    class Collection:
        def __init__(self, name):
            self.name = name

    docs = [Document(page_content="abc", metadata={})]
    mock_qdrant.get_collections.return_value.collections = [Collection("tenant_docs")]
    with patch("src.rag.services.QdrantVectorStore"):
        rag_service.store_documents(docs, "tenant1")
    mock_qdrant.recreate_collection.assert_not_called()


def test_get_vectorstore(rag_service):
    with patch("src.rag.services.QdrantVectorStore") as MockVS, patch("src.rag.services.models"):
        retriever = MagicMock()
        MockVS.return_value.as_retriever.return_value = retriever
        result = rag_service.get_vectorstore("tenant1")
        assert result == retriever


@pytest.mark.asyncio
async def test_upload_file(rag_service):
    rag_service.load_file = AsyncMock(return_value=["doc"])
    rag_service.split_documents = MagicMock(return_value=["split_doc"])
    rag_service.store_documents = MagicMock()
    file = MagicMock(spec=UploadFile)
    await rag_service.upload_file("tenant1", file)
    rag_service.load_file.assert_awaited_once()
    rag_service.split_documents.assert_called_once()
    rag_service.store_documents.assert_called_once()


def test_get_qa_chain(rag_service):
    with (
        patch("src.rag.services.QdrantVectorStore"),
        patch("src.rag.services.ChatOpenAI"),
        patch("src.rag.services.ChatPromptTemplate"),
        patch("src.rag.services.create_stuff_documents_chain") as mock_chain,
        patch("src.rag.services.create_retrieval_chain") as mock_retrieval,
    ):
        mock_chain.return_value = MagicMock()
        mock_retrieval.return_value = "chain"
        result = rag_service.get_qa_chain("tenant1")
        assert result == "chain"
