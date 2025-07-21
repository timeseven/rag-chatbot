from unittest.mock import MagicMock, patch

from src.rag.deps import get_embedding, get_qdrant_client, get_rag_service


def test_get_embedding():
    with patch("src.rag.deps.OpenAIEmbeddings") as MockEmbeddings:
        MockEmbeddings.return_value = MagicMock()
        embedding = get_embedding()
        assert embedding is not None
        MockEmbeddings.assert_called_once()


def test_get_qdrant_client():
    with patch("src.rag.deps.QdrantClient") as MockQdrant:
        MockQdrant.return_value = MagicMock()
        client = get_qdrant_client()
        assert client is not None
        MockQdrant.assert_called_once()


def test_get_rag_service():
    mock_client = MagicMock()
    mock_embedding = MagicMock()
    service = get_rag_service(mock_client, mock_embedding)
    assert service is not None
