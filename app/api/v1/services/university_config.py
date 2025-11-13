"""Сервис для работы с конфигурацией University API"""
from sqlalchemy.orm import Session
from repositories.university_config_repository import UniversityConfigRepository
from typing import Optional, Dict, Any


async def get_university_config(db: Session, university_id: int) -> Optional[Dict[str, Any]]:
    """Получить конфигурацию University API из БД для конкретного университета
    
    Args:
        db: Сессия базы данных
        university_id: ID университета
    
    Returns:
        dict с ключами base_url и endpoints, или None если конфигурация не найдена
    """
    repo = UniversityConfigRepository(db)
    config = repo.get(university_id)
    
    if not config:
        return None
    
    return {
        "base_url": config.university_api_base_url,
        "endpoints": config.endpoints
    }

