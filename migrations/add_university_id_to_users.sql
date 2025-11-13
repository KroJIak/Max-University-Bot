-- Миграция: добавление university_id в таблицу users
-- Выполнить: docker compose -f docker-compose-arm64.yml exec -T postgres psql -U maxbot -d maxbot_db < migrations/add_university_id_to_users.sql

-- Шаг 1: Добавляем колонку university_id (пока NULL, чтобы существующие данные не вызвали ошибку)
ALTER TABLE users 
ADD COLUMN university_id INTEGER;

-- Шаг 2: Обновляем существующие записи (присваиваем им university_id = 1, так как это первый университет)
UPDATE users 
SET university_id = 1 
WHERE university_id IS NULL;

-- Шаг 3: Делаем колонку NOT NULL
ALTER TABLE users 
ALTER COLUMN university_id SET NOT NULL;

-- Шаг 4: Добавляем внешний ключ на таблицу universities
ALTER TABLE users 
ADD CONSTRAINT fk_users_university_id 
FOREIGN KEY (university_id) 
REFERENCES universities(id) 
ON DELETE CASCADE;

-- Шаг 5: Добавляем индекс для быстрого поиска по university_id
CREATE INDEX IF NOT EXISTS ix_users_university_id 
ON users(university_id);

-- Проверяем результат
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;


