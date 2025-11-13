from sqlalchemy import Column, Integer, String, JSON, DateTime, ForeignKey, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from core.database import Base


class UniversityConfig(Base):
    """Конфигурация University API для конкретного университета"""
    __tablename__ = "university_config"

    id = Column(Integer, primary_key=True, index=True)
    university_id = Column(Integer, ForeignKey("universities.id"), unique=True, nullable=False, index=True)
    university_api_base_url = Column(String, nullable=False)
    endpoints = Column(JSON, nullable=False, default={})  # {"feature_id": "endpoint"}
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    university = relationship("University", back_populates="config")
    
    # Уникальность: один университет - одна конфигурация
    __table_args__ = (UniqueConstraint('university_id', name='_university_config_uc'),)

