from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from core.database import get_db
from repositories.university_repository import UniversityRepository
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime, timedelta
from jose import JWTError, jwt
import os

router = APIRouter()

# Секретный ключ для JWT (в production должен быть в переменных окружения)
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24  # 24 часа


class UniversityCreate(BaseModel):
    """Запрос на создание университета
    
    Создает новый университет в системе. По умолчанию устанавливается логин и пароль: admin/admin.
    """
    name: str = Field(..., description="Название университета", example="Чувашский государственный университет")
    
    class Config:
        json_schema_extra = {
            "example": {
                "name": "Чувашский государственный университет"
            }
        }


class UniversityLoginRequest(BaseModel):
    """Запрос на аутентификацию университета
    
    Выполняет аутентификацию университета для доступа к защищенным endpoints (конфигурация и т.д.).
    """
    university_id: int = Field(..., description="ID университета", example=1)
    login: str = Field(..., description="Логин университета", example="admin")
    password: str = Field(..., description="Пароль университета", example="admin")
    
    class Config:
        json_schema_extra = {
            "example": {
                "university_id": 1,
                "login": "admin",
                "password": "admin"
            }
        }


class UniversityLoginResponse(BaseModel):
    """Ответ на запрос аутентификации университета
    
    Содержит JWT токен для доступа к защищенным endpoints и информацию об университете.
    """
    access_token: str = Field(..., description="JWT токен для аутентификации", example="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
    token_type: str = Field(..., description="Тип токена (обычно 'bearer')", example="bearer")
    university_id: int = Field(..., description="ID университета", example=1)
    university_name: str = Field(..., description="Название университета", example="Чувашский государственный университет")
    
    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                "token_type": "bearer",
                "university_id": 1,
                "university_name": "Чувашский государственный университет"
            }
        }


class UniversityResponse(BaseModel):
    """Ответ с данными университета
    
    Содержит информацию об университете.
    """
    id: int = Field(..., description="ID университета", example=1)
    name: str = Field(..., description="Название университета", example="Чувашский государственный университет")

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "id": 1,
                "name": "Чувашский государственный университет"
            }
        }


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Создать JWT токен"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> Optional[dict]:
    """Проверить JWT токен"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


# AUTHENTICATION
@router.post(
    "/universities/login",
    response_model=UniversityLoginResponse,
    summary="Аутентификация университета",
    description="Выполняет аутентификацию университета и возвращает JWT токен для доступа к защищенным endpoints.",
    response_description="JWT токен и информация об университете",
    responses={
        200: {"description": "Аутентификация успешна"},
        401: {"description": "Неверный логин или пароль"},
        404: {"description": "Университет не найден"}
    }
)
async def login_university(request: UniversityLoginRequest, db: Session = Depends(get_db)):
    """Аутентификация университета
    
    Выполняет аутентификацию университета с использованием логина и пароля.
    Возвращает JWT токен, который необходимо использовать в заголовке `Authorization: Bearer <token>`
    для доступа к защищенным endpoints (конфигурация и т.д.).
    
    **Примеры использования:**
    
    ```python
    import requests
    
    # Аутентификация
    response = requests.post(
        "http://localhost:8003/api/v1/universities/login",
        json={
            "university_id": 1,
            "login": "admin",
            "password": "admin"
        }
    )
    
    token = response.json()["access_token"]
    
    # Использование токена для защищенного запроса
    headers = {"Authorization": f"Bearer {token}"}
    config_response = requests.get(
        "http://localhost:8003/api/v1/config/university/1",
        headers=headers
    )
    ```
    """
    university_repo = UniversityRepository(db)
    
    # Получаем университет по ID
    university = university_repo.get_by_id(request.university_id)
    if not university:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="University not found"
        )
    
    # Проверяем логин
    if university.login != request.login:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid login or password"
        )
    
    # Проверяем пароль
    if not university_repo.verify_password(request.university_id, request.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid login or password"
        )
    
    # Создаем токен
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(university.id), "university_id": university.id, "login": university.login},
        expires_delta=access_token_expires
    )
    
    return UniversityLoginResponse(
        access_token=access_token,
        token_type="bearer",
        university_id=university.id,
        university_name=university.name
    )


# CREATE
@router.post(
    "/universities",
    response_model=UniversityResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Создать университет",
    description="Создает новый университет в системе. По умолчанию устанавливается логин и пароль: admin/admin.",
    response_description="Созданный университет",
    responses={
        201: {"description": "Университет успешно создан"},
        400: {"description": "Университет с таким названием уже существует"}
    }
)
async def create_university(university: UniversityCreate, db: Session = Depends(get_db)):
    """Создать новый университет
    
    Создает новый университет в системе. По умолчанию устанавливается логин и пароль: admin/admin.
    
    **Примеры использования:**
    
    ```python
    import requests
    
    response = requests.post(
        "http://localhost:8003/api/v1/universities",
        json={
            "name": "Чувашский государственный университет"
        }
    )
    ```
    """
    university_repo = UniversityRepository(db)
    
    # Проверяем, существует ли университет с таким именем
    existing = university_repo.get_by_name(university.name)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="University with this name already exists"
        )
    
    # Создаем университет с дефолтными логином и паролем (admin/admin)
    db_university = university_repo.create(name=university.name, login="admin", password="admin")
    return db_university


# READ - Get by id
@router.get(
    "/universities/{university_id}",
    response_model=UniversityResponse,
    summary="Получить университет",
    description="Получает информацию об университете по его ID.",
    response_description="Информация об университете",
    responses={
        200: {"description": "Университет найден"},
        404: {"description": "Университет не найден"}
    }
)
async def get_university(university_id: int, db: Session = Depends(get_db)):
    """Получить университет по ID
    
    Возвращает информацию об университете по его ID.
    
    **Параметры:**
    - `university_id`: ID университета
    
    **Примеры использования:**
    
    ```python
    import requests
    
    response = requests.get("http://localhost:8003/api/v1/universities/1")
    ```
    """
    university_repo = UniversityRepository(db)
    db_university = university_repo.get_by_id(university_id)
    
    if not db_university:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="University not found"
        )
    return db_university


# READ - Get all
@router.get(
    "/universities",
    response_model=list[UniversityResponse],
    summary="Получить список университетов",
    description="Получает список всех университетов в системе с пагинацией.",
    response_description="Список университетов",
    responses={
        200: {"description": "Список университетов успешно получен"}
    }
)
async def get_universities(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Получить список всех университетов
    
    Возвращает список всех университетов в системе с поддержкой пагинации.
    
    **Параметры:**
    - `skip`: Количество пропускаемых записей (по умолчанию: 0)
    - `limit`: Максимальное количество записей (по умолчанию: 100)
    
    **Примеры использования:**
    
    ```python
    import requests
    
    # Получить все университеты
    response = requests.get("http://localhost:8003/api/v1/universities")
    
    # Получить первые 10 университетов
    response = requests.get("http://localhost:8003/api/v1/universities?skip=0&limit=10")
    ```
    """
    university_repo = UniversityRepository(db)
    universities = university_repo.get_all(skip=skip, limit=limit)
    return universities


# UPDATE
@router.put(
    "/universities/{university_id}",
    response_model=UniversityResponse,
    summary="Обновить университет",
    description="Обновляет название университета.",
    response_description="Обновленный университет",
    responses={
        200: {"description": "Университет успешно обновлен"},
        404: {"description": "Университет не найден"}
    }
)
async def update_university(
    university_id: int,
    university_update: UniversityCreate,
    db: Session = Depends(get_db)
):
    """Обновить данные университета
    
    Обновляет название университета.
    
    **Параметры:**
    - `university_id`: ID университета
    - `university_update`: Новое название университета
    
    **Примеры использования:**
    
    ```python
    import requests
    
    response = requests.put(
        "http://localhost:8003/api/v1/universities/1",
        json={
            "name": "Новое название университета"
        }
    )
    ```
    """
    university_repo = UniversityRepository(db)
    
    db_university = university_repo.update(
        id=university_id,
        name=university_update.name
    )
    
    if not db_university:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="University not found"
        )
    
    return db_university


# DELETE
@router.delete(
    "/universities/{university_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Удалить университет",
    description="Удаляет университет из системы. Внимание: это действие необратимо! Все связанные данные (пользователи, конфигурация) также будут удалены.",
    response_description="Университет успешно удален",
    responses={
        204: {"description": "Университет успешно удален"},
        404: {"description": "Университет не найден"}
    }
)
async def delete_university(university_id: int, db: Session = Depends(get_db)):
    """Удалить университет
    
    Удаляет университет из системы. Это действие необратимо!
    Также удаляются все связанные данные (пользователи, конфигурация и т.д.).
    
    **Параметры:**
    - `university_id`: ID университета
    
    **Примеры использования:**
    
    ```python
    import requests
    
    response = requests.delete("http://localhost:8003/api/v1/universities/1")
    ```
    """
    university_repo = UniversityRepository(db)
    
    if not university_repo.delete(university_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="University not found"
        )
    
    return None

