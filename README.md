# Max University Bot

Проект для управления ботом университета на платформе MAX.

## Структура проекта

- **app/** - Основное API (FastAPI)
- **bot/** - Telegram бот (Go)
- **admin-panel/** - Админ-панель (Nginx)
- **university-app/** - API для работы с университетским сайтом (FastAPI)
- **mini-app/** - Мини-приложение (React + Vite)

## Требования

- Docker и Docker Compose
- Файл `.env` с необходимыми переменными окружения

## Установка и запуск

### 1. Настройка переменных окружения

Скопируйте файл `.env.example` в `.env` и заполните необходимые переменные:

```bash
cp .env.example .env
```

Отредактируйте `.env` и укажите:
- `MAX_BOT_TOKEN` - токен бота (получить можно в диалоге с MasterBot: https://max.ru/MasterBot)
- `CLOUDPUB_TOKEN` - токен для CloudPub (если используется)
- Другие переменные при необходимости

### 2. Исправление прав доступа для CloudPub

**⚠️ ВАЖНО:** Перед запуском необходимо исправить права доступа на директорию `cloudpub-config` и создать директорию для логов, иначе контейнеры CloudPub не смогут создать необходимые файлы и будут постоянно перезапускаться с ошибкой `Permission denied (os error 13)`.

Выполните следующую команду:

```bash
# Вариант 1: Использование скрипта (рекомендуется)
./setup-cloudpub.sh

# Вариант 2: Вручную
rm -rf cloudpub-config
mkdir -p cloudpub-config/logs
chmod -R 777 cloudpub-config
```

**Альтернативный вариант (если директория уже существует):**
```bash
# Исправление прав через Docker (рекомендуется, если нет sudo)
docker run --rm --user root -v "$(pwd)/cloudpub-config:/target" alpine:latest sh -c "mkdir -p /target/logs && chmod -R 777 /target"

# Или через sudo (если доступен)
sudo mkdir -p cloudpub-config/logs && sudo chmod -R 777 cloudpub-config
```

После выполнения команды директория `cloudpub-config` должна иметь права `777`, а внутри должна быть создана директория `logs`.

### 3. Запуск проекта

**Для ARM64 (Raspberry Pi и другие ARM-устройства):**
```bash
docker compose -f docker-compose-arm64.yml up -d
```

**Для AMD64/x86_64:**
```bash
docker compose -f docker-compose-amd64.yml up -d
```

**Без CloudPub:**
```bash
docker compose -f docker-compose-without-cloudpub.yml up -d
```

### 4. Просмотр логов

Просмотр логов всех сервисов:
```bash
docker compose -f docker-compose-arm64.yml logs -f
```

Просмотр логов конкретного сервиса:
```bash
docker compose -f docker-compose-arm64.yml logs -f api
docker compose -f docker-compose-arm64.yml logs -f bot
docker compose -f docker-compose-arm64.yml logs -f cloudpub-api
```

### 5. Остановка проекта

```bash
docker compose -f docker-compose-arm64.yml down
```

Для остановки и удаления volumes (⚠️ удалит данные БД):
```bash
docker compose -f docker-compose-arm64.yml down -v
```

## Полезные команды

### Перезапуск сервиса
```bash
docker compose -f docker-compose-arm64.yml restart api
```

### Просмотр статуса контейнеров
```bash
docker compose -f docker-compose-arm64.yml ps
```

### Пересборка образов
```bash
docker compose -f docker-compose-arm64.yml build --no-cache
```

## Портирование сервисов

После запуска следующие порты будут доступны локально:

- **API**: `http://localhost:8003` (Swagger UI: `http://localhost:8003/docs`)
- **Admin Panel**: `http://localhost:8081`
- **University API**: `http://localhost:8001`
- **Mini App**: `http://localhost:8002`
- **PostgreSQL**: `localhost:5432`

## Устранение проблем

### CloudPub контейнеры перезапускаются

Если контейнеры CloudPub постоянно перезапускаются с ошибкой `Permission denied (os error 13)` или `Can't create log dir`, выполните следующие действия:

1. **Остановите контейнеры CloudPub:**
   ```bash
   docker compose -f docker-compose-arm64.yml stop cloudpub-api cloudpub-admin-panel cloudpub-university-api cloudpub-mini-app
   ```

2. **Исправьте права доступа:**
   ```bash
   rm -rf cloudpub-config
   mkdir -p cloudpub-config/logs
   chmod -R 777 cloudpub-config
   ```

3. **Проверьте права доступа:**
   ```bash
   ls -la cloudpub-config
   ```
   Директория должна иметь права `777`, а внутри должна быть директория `logs`.

4. **Запустите контейнеры заново:**
   ```bash
   docker compose -f docker-compose-arm64.yml up -d cloudpub-api cloudpub-admin-panel cloudpub-university-api cloudpub-mini-app
   ```

5. **Проверьте логи:**
   ```bash
   docker compose -f docker-compose-arm64.yml logs cloudpub-api --tail=20
   ```
   В логах не должно быть ошибок `Permission denied` или `Can't create log dir`. Должны быть сообщения `online` и `Сервис опубликован`.

### API не запускается

1. Проверьте логи API: `docker compose -f docker-compose-arm64.yml logs api`
2. Убедитесь, что PostgreSQL запущен и доступен: `docker compose -f docker-compose-arm64.yml ps postgres`
3. Проверьте переменные окружения в `.env` файле

### База данных не подключается

1. Убедитесь, что контейнер PostgreSQL запущен и здоров: `docker compose -f docker-compose-arm64.yml ps postgres`
2. Проверьте логи PostgreSQL: `docker compose -f docker-compose-arm64.yml logs postgres`
3. Проверьте строку подключения в `.env` файле

## Переменные окружения

Основные переменные окружения описаны в файле `.env.example`. Обязательные переменные:

- `MAX_BOT_TOKEN` - токен бота (обязательно)
- `CLOUDPUB_TOKEN` - токен CloudPub (обязательно, если используется CloudPub)

Остальные переменные имеют значения по умолчанию, указанные в `docker-compose-arm64.yml`.

## Разработка

### Режим разработки

Все сервисы монтируют исходный код как volume, поэтому изменения в коде сразу применяются после перезапуска контейнера.

### Добавление зависимостей

- **Python (app, university-app)**: Добавьте в `requirements.txt` и пересоберите образ
- **Go (bot)**: Добавьте в `go.mod` и выполните `go mod tidy`
- **Node.js (mini-app)**: Добавьте в `package.json` и выполните `npm install`

## Лицензия

[Указать лицензию при необходимости]

