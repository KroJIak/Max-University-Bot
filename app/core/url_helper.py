import os
from typing import Optional
from urllib.parse import urlparse, urlunparse


def get_service_url(domain_url_env: str, host_env: str, port_env: str, default_host: str = "0.0.0.0", default_port: int = 8003) -> str:
    """
    Получить URL сервиса с приоритетом: сначала домен (если задан), потом HOST:PORT
    
    Args:
        domain_url_env: Имя переменной окружения с доменным URL (например, "MAX_API_DOMAIN_URL")
        host_env: Имя переменной окружения с хостом (например, "MAX_API_HOST")
        port_env: Имя переменной окружения с портом (например, "MAX_API_PORT")
        default_host: Хост по умолчанию, если переменная окружения не задана
        default_port: Порт по умолчанию, если переменная окружения не задана
    
    Returns:
        URL сервиса (доменный URL или http://HOST:PORT)
    """
    # Приоритет 1: Доменный URL (если задан и не пустой)
    domain_url = os.getenv(domain_url_env, "").strip()
    if domain_url:
        return domain_url.rstrip("/")
    
    # Приоритет 2: HOST:PORT
    host = os.getenv(host_env, default_host)
    port = os.getenv(port_env, str(default_port))
    
    # Всегда используем http для внутренних сервисов
    return f"http://{host}:{port}"


async def get_url_with_fallback(domain_url: Optional[str] = None, host: Optional[str] = None, port: Optional[int] = None) -> str:
    """
    Получить URL с приоритетом: сначала домен (если задан), потом HOST:PORT
    
    Args:
        domain_url: Доменный URL (приоритет 1)
        host: Хост для формирования URL (приоритет 2)
        port: Порт для формирования URL (приоритет 2)
    
    Returns:
        URL (доменный URL или http://HOST:PORT)
    """
    # Приоритет 1: Доменный URL
    if domain_url and domain_url.strip():
        return domain_url.strip().rstrip("/")
    
    # Приоритет 2: HOST:PORT
    if host and port:
        # Всегда используем http для внутренних сервисов
        return f"http://{host}:{port}"
    
    # Fallback на значения по умолчанию
    return "http://0.0.0.0:8003"

