from slowapi.util import get_remote_address

from src.core.rate_limit import limiter


def test_limiter_key_func():
    # Ensure limiter uses the correct key function
    assert limiter._key_func == get_remote_address
