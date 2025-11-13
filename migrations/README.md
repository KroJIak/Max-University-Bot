# Миграции базы данных

Этот каталог содержит SQL-скрипты для миграции базы данных.

## Выполненные миграции

### 1. Добавление `university_id` в таблицу `university_config`

**Файл:** `add_university_id_to_university_config.sql`

**Описание:** Добавляет колонку `university_id` в таблицу `university_config` для поддержки мультитенантности.

**Выполнение:**
```bash
docker compose -f docker-compose-arm64.yml exec -T postgres psql -U maxbot -d maxbot_db < migrations/add_university_id_to_university_config.sql
```

**Что делает:**
- Добавляет колонку `university_id` (INTEGER, NOT NULL)
- Обновляет существующие записи (присваивает `university_id = 1`)
- Добавляет внешний ключ на таблицу `universities`
- Создает уникальный индекс на `university_id`
- Создает обычный индекс для быстрого поиска

### 2. Добавление `university_id` в таблицу `users`

**Файл:** `add_university_id_to_users.sql`

**Описание:** Добавляет колонку `university_id` в таблицу `users` для поддержки мультитенантности.

**Выполнение:**
```bash
docker compose -f docker-compose-arm64.yml exec -T postgres psql -U maxbot -d maxbot_db < migrations/add_university_id_to_users.sql
```

**Что делает:**
- Добавляет колонку `university_id` (INTEGER, NOT NULL)
- Обновляет существующие записи (присваивает `university_id = 1`)
- Добавляет внешний ключ на таблицу `universities`
- Создает индекс для быстрого поиска по `university_id`

## Важные замечания

1. **Существующие данные:** Все существующие записи в таблицах `users` и `university_config` получат `university_id = 1` (первый университет).

2. **Удаление данных:** При удалении университета все связанные записи в `users` и `university_config` будут автоматически удалены (ON DELETE CASCADE).

3. **Уникальность:** В таблице `university_config` каждый университет может иметь только одну конфигурацию (уникальный индекс на `university_id`).

## Проверка миграций

Проверить структуру таблиц можно следующими командами:

```bash
# Проверить структуру university_config
docker compose -f docker-compose-arm64.yml exec -T postgres psql -U maxbot -d maxbot_db -c "\d university_config"

# Проверить структуру users
docker compose -f docker-compose-arm64.yml exec -T postgres psql -U maxbot -d maxbot_db -c "\d users"

# Проверить данные
docker compose -f docker-compose-arm64.yml exec -T postgres psql -U maxbot -d maxbot_db -c "SELECT * FROM university_config;"
docker compose -f docker-compose-arm64.yml exec -T postgres psql -U maxbot -d maxbot_db -c "SELECT * FROM users;"
```

### 3. Добавление `login` и `password_hash` в таблицу `universities`

**Файл:** `add_login_password_to_universities.sql`

**Описание:** Добавляет колонки `login` и `password_hash` в таблицу `universities` для аутентификации университетов.

**Выполнение:**
```bash
docker compose -f docker-compose-arm64.yml exec -T postgres psql -U maxbot -d maxbot_db < migrations/add_login_password_to_universities.sql
```

**Что делает:**
- Добавляет колонку `login` (VARCHAR, NOT NULL, default='admin')
- Добавляет колонку `password_hash` (VARCHAR, NULL - будет обновлен через Python код)
- Обновляет существующие записи: устанавливает `login = 'admin'`
- Пароли будут установлены через Python код при запуске приложения (startup_event в main.py)

**Важно:** После выполнения миграции необходимо перезапустить API контейнер, чтобы Python код установил пароли для существующих университетов.

**Дефолтные значения:**
- Логин: `admin`
- Пароль: `admin` (хэшируется через bcrypt)

## Будущие миграции

Для новых миграций:
1. Создайте SQL-скрипт в этом каталоге
2. Документируйте изменения в этом файле
3. Протестируйте миграцию на тестовой базе данных
4. Выполните миграцию на production базе данных после резервного копирования

