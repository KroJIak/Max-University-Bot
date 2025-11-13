#!/bin/sh
set -e

# Подставляем переменные окружения в script.js
envsubst '${MAX_API_DOMAIN_URL} ${MAX_API_HOST} ${MAX_API_PORT}' < /usr/share/nginx/html/script.js.template > /usr/share/nginx/html/script.js

# Подставляем переменные окружения в login.js
envsubst '${MAX_API_DOMAIN_URL} ${MAX_API_HOST} ${MAX_API_PORT}' < /usr/share/nginx/html/login.js.template > /usr/share/nginx/html/login.js

# Подставляем переменные в конфигурацию nginx
envsubst '${ADMIN_PANEL_HOST} ${ADMIN_PANEL_PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Запускаем nginx
exec nginx -g "daemon off;"

