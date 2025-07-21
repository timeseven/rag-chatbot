from unittest.mock import AsyncMock, MagicMock

import pytest
from fastapi.testclient import TestClient

from src.core.config import settings
from src.main import app
from src.rag.deps import get_rag_service


@pytest.fixture(autouse=True)
def override_rag_service():
    mock_service = MagicMock()
    mock_service.upload_file = AsyncMock()
    mock_chain = MagicMock()
    mock_chain.ainvoke = AsyncMock(return_value={"answer": "content"})
    mock_service.get_qa_chain.return_value = mock_chain
    app.dependency_overrides[get_rag_service] = lambda: mock_service
    yield
    app.dependency_overrides.clear()


@pytest.fixture
def client():
    return TestClient(app)


def test_upload_file(client):
    response = client.post(
        f"{settings.API_V1_STR}/rag/upload",
        headers={"X-Tenant-ID": "tenant1"},
        files={"file": ("test.txt", b"content")},
    )
    assert response.status_code == 200
    assert response.json()["message"] == "File uploaded successfully."


def test_ask_question(client):
    response = client.post(
        f"{settings.API_V1_STR}/rag/ask",
        headers={"X-Tenant-ID": "tenant1"},
        json={"question": "What is the answer?"},
    )
    assert response.status_code == 200
    assert response.json()["answer"] == "content"
