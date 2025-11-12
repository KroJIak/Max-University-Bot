FROM node:20-alpine

WORKDIR /app

# Копируем package files
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем исходники
COPY . .

# Открываем порт
EXPOSE 8002

# Запускаем dev сервер через npm
CMD ["sh", "-c", "npm run dev -- --host ${MINI_APP_HOST:-0.0.0.0} --port ${MINI_APP_PORT:-8002}"]

