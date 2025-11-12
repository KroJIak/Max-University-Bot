#!/bin/bash

# Скрипт для настройки прав доступа для CloudPub
# Использование: ./setup-cloudpub.sh

set -e

echo "Настройка прав доступа для CloudPub..."

# Проверяем, существует ли директория cloudpub-config
if [ -d "cloudpub-config" ]; then
    echo "Директория cloudpub-config существует. Удаляем и создаем заново..."
    rm -rf cloudpub-config
fi

# Создаем директорию и поддиректорию для логов
echo "Создание директории cloudpub-config/logs..."
mkdir -p cloudpub-config/logs

# Устанавливаем права доступа
echo "Установка прав доступа 777..."
chmod -R 777 cloudpub-config

# Проверяем результат
echo "Проверка прав доступа:"
ls -la cloudpub-config

echo ""
echo "✅ Настройка завершена успешно!"
echo "Теперь можно запустить контейнеры CloudPub:"
echo "  docker compose -f docker-compose-arm64.yml up -d cloudpub-api cloudpub-admin-panel cloudpub-university-api cloudpub-mini-app"

