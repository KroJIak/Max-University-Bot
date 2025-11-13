-- Миграция: установка паролей для существующих университетов
-- ВАЖНО: Этот скрипт НЕ устанавливает пароли, так как нужен bcrypt для хэширования
-- Пароли будут установлены через Python код при запуске приложения
-- Выполнить: docker compose -f docker-compose-arm64.yml exec -T postgres psql -U maxbot -d maxbot_db < migrations/update_existing_universities_passwords.sql

-- Этот скрипт только проверяет состояние
-- Пароли должны быть установлены через Python код (main.py startup_event)

-- Проверяем текущее состояние
SELECT 
    id, 
    name, 
    login, 
    CASE 
        WHEN password_hash IS NULL THEN 'NO PASSWORD' 
        ELSE 'HAS PASSWORD' 
    END as password_status
FROM universities 
ORDER BY id;


