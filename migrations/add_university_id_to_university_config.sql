-- Миграция: добавление university_id в таблицу university_config
-- Выполнить: docker compose -f docker-compose-arm64.yml exec -T postgres psql -U maxbot -d maxbot_db < migrations/add_university_id_to_university_config.sql

-- Шаг 1: Добавляем колонку university_id (пока NULL, чтобы существующие данные не вызвали ошибку)
ALTER TABLE university_config 
ADD COLUMN university_id INTEGER;

-- Шаг 2: Обновляем существующие записи (присваиваем им university_id = 1, так как это первый университет)
UPDATE university_config 
SET university_id = 1 
WHERE university_id IS NULL;

-- Шаг 3: Делаем колонку NOT NULL
ALTER TABLE university_config 
ALTER COLUMN university_id SET NOT NULL;

-- Шаг 4: Добавляем внешний ключ на таблицу universities
ALTER TABLE university_config 
ADD CONSTRAINT fk_university_config_university_id 
FOREIGN KEY (university_id) 
REFERENCES universities(id) 
ON DELETE CASCADE;

-- Шаг 5: Добавляем уникальный индекс на university_id (так как один университет = одна конфигурация)
CREATE UNIQUE INDEX IF NOT EXISTS ix_university_config_university_id 
ON university_config(university_id);

-- Шаг 6: Добавляем обычный индекс для быстрого поиска
CREATE INDEX IF NOT EXISTS ix_university_config_university_id_idx 
ON university_config(university_id);

-- Шаг 7: Удаляем старый уникальный индекс, если он существует (может конфликтовать с новым)
-- Это необязательно, но на всякий случай

-- Проверяем результат
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'university_config' 
ORDER BY ordinal_position;


