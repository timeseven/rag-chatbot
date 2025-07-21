from src.core.config import Config


def test_parse_cors_string():
    config = Config(
        BACKEND_CORS_ORIGINS="http://a.com, http://b.com",
        FRONTEND_HOST="http://frontend.com",
        PROJECT_NAME="test",
        OPENAI_API_KEY="key",
    )
    assert config.BACKEND_CORS_ORIGINS == ["http://a.com", "http://b.com"]


def test_all_cors_origins():
    config = Config(
        BACKEND_CORS_ORIGINS=["http://a.com"],
        FRONTEND_HOST="http://frontend.com",
        PROJECT_NAME="test",
        OPENAI_API_KEY="key",
    )
    assert "http://frontend.com" in config.all_cors_origins
    assert "http://a.com" in config.all_cors_origins
