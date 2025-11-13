from sqlalchemy.orm import Session
from models.university_config import UniversityConfig
from typing import Optional, Dict


class UniversityConfigRepository:
    """Репозиторий для работы с конфигурацией University API"""

    def __init__(self, db: Session):
        self.db = db

    def get(self, university_id: int) -> Optional[UniversityConfig]:
        """Получить конфигурацию для конкретного университета"""
        return self.db.query(UniversityConfig).filter(
            UniversityConfig.university_id == university_id
        ).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> list[UniversityConfig]:
        """Получить список всех конфигураций"""
        return self.db.query(UniversityConfig).offset(skip).limit(limit).all()

    def create(self, university_id: int, university_api_base_url: str, endpoints: Dict[str, str]) -> UniversityConfig:
        """Создать конфигурацию для университета"""
        config = UniversityConfig(
            university_id=university_id,
            university_api_base_url=university_api_base_url,
            endpoints=endpoints
        )
        self.db.add(config)
        self.db.commit()
        self.db.refresh(config)
        return config

    def update(self, university_id: int, university_api_base_url: str, endpoints: Dict[str, str]) -> Optional[UniversityConfig]:
        """Обновить конфигурацию университета"""
        config = self.get(university_id)
        if config:
            config.university_api_base_url = university_api_base_url
            config.endpoints = endpoints
            self.db.commit()
            self.db.refresh(config)
            return config
        return None

    def upsert(self, university_id: int, university_api_base_url: str, endpoints: Dict[str, str]) -> UniversityConfig:
        """Создать или обновить конфигурацию для университета"""
        config = self.get(university_id)
        if config:
            return self.update(university_id, university_api_base_url, endpoints)
        else:
            return self.create(university_id, university_api_base_url, endpoints)
    
    def delete(self, university_id: int) -> bool:
        """Удалить конфигурацию университета"""
        config = self.get(university_id)
        if not config:
            return False
        
        self.db.delete(config)
        self.db.commit()
        return True

