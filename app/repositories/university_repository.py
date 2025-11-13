from sqlalchemy.orm import Session
from models.university import University
from typing import Optional, List
from core.password import hash_password, verify_password


class UniversityRepository:
    """Репозиторий для работы с университетами"""
    
    def __init__(self, db: Session):
        self.db = db

    def create(self, name: str, login: str = "admin", password: str = "admin") -> University:
        """Создать новый университет"""
        password_hash = hash_password(password)
        university = University(
            name=name,
            login=login,
            password_hash=password_hash
        )
        self.db.add(university)
        self.db.commit()
        self.db.refresh(university)
        return university

    def get_by_id(self, id: int) -> Optional[University]:
        """Получить университет по ID"""
        return self.db.query(University).filter(University.id == id).first()

    def get_by_name(self, name: str) -> Optional[University]:
        """Получить университет по названию"""
        return self.db.query(University).filter(University.name == name).first()

    def get_by_login(self, login: str) -> Optional[University]:
        """Получить университет по логину"""
        return self.db.query(University).filter(University.login == login).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> List[University]:
        """Получить список всех университетов"""
        return self.db.query(University).offset(skip).limit(limit).all()

    def exists(self, id: int) -> bool:
        """Проверить, существует ли университет"""
        return self.get_by_id(id) is not None

    def verify_password(self, university_id: int, password: str) -> bool:
        """Проверить пароль университета"""
        university = self.get_by_id(university_id)
        if not university:
            return False
        return verify_password(password, university.password_hash)

    def update(self, id: int, name: Optional[str] = None, login: Optional[str] = None, password: Optional[str] = None) -> Optional[University]:
        """Обновить данные университета"""
        university = self.get_by_id(id)
        if not university:
            return None
        
        if name is not None:
            university.name = name
        
        if login is not None:
            university.login = login
        
        if password is not None:
            university.password_hash = hash_password(password)
        
        self.db.commit()
        self.db.refresh(university)
        return university

    def delete(self, id: int) -> bool:
        """Удалить университет"""
        university = self.get_by_id(id)
        if not university:
            return False
        
        self.db.delete(university)
        self.db.commit()
        return True

