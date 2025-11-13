from fastapi import APIRouter

router = APIRouter()


@router.get(
    "/health",
    summary="Health Check",
    description="Проверяет работоспособность API. Возвращает статус сервиса.",
    response_description="Статус сервиса",
    responses={
        200: {"description": "Сервис работает"}
    }
)
async def health_check():
    """Health Check
    
    Проверяет работоспособность API. Возвращает статус сервиса.
    
    **Примеры использования:**
    
    ```python
    import requests
    
    response = requests.get("http://localhost:8003/api/v1/health")
    ```
    """
    return {"status": "ok", "service": "max-bot-api"}

