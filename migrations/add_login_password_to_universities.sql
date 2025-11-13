-- Миграция: добавление login и password_hash в таблицу universities
-- Выполнить: docker compose -f docker-compose-arm64.yml exec -T postgres psql -U maxbot -d maxbot_db < migrations/add_login_password_to_universities.sql

-- Шаг 1: Добавляем колонку login (по умолчанию 'admin')
ALTER TABLE universities 
ADD COLUMN IF NOT EXISTS login VARCHAR DEFAULT 'admin';

-- Шаг 2: Обновляем существующие записи, устанавливая login = 'admin', если он NULL
UPDATE universities 
SET login = 'admin' 
WHERE login IS NULL;

-- Шаг 3: Делаем колонку login NOT NULL
ALTER TABLE universities 
ALTER COLUMN login SET NOT NULL;

-- Шаг 4: Добавляем колонку password_hash
-- ВАЖНО: password_hash будет установлен через Python код после миграции, так как нужен bcrypt
ALTER TABLE universities 
ADD COLUMN IF NOT EXISTS password_hash VARCHAR;

-- Шаг 5: Для существующих записей устанавливаем временный пароль (будет обновлен через Python)
-- Но мы не можем хэшировать пароль в SQL, поэтому оставляем NULL и обновим через Python

-- Шаг 6: Делаем колонку password_hash NOT NULL после того, как Python обновит все записи
-- ALTER TABLE universities 
-- ALTER COLUMN password_hash SET NOT NULL;
-- (Этот шаг будет выполнен после обновления всех записей через Python)

-- Проверяем результат
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'universities' 
ORDER BY ordinal_position;


