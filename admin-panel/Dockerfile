FROM nginx:alpine

# Устанавливаем envsubst для подстановки переменных окружения
RUN apk add --no-cache gettext

# Копируем файлы админ панели
COPY index.html /usr/share/nginx/html/
COPY styles.css /usr/share/nginx/html/
COPY script.js.template /usr/share/nginx/html/script.js.template

# Копируем entrypoint скрипт
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Настройка nginx для SPA (шаблон)
RUN echo 'server { \
    listen 8080; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf.template

EXPOSE 8080

CMD ["/docker-entrypoint.sh"]

