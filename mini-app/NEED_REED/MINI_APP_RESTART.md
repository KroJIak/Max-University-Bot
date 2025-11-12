## Перезапуск mini-app

делай в корневой папке проекта

1. Перезапустите только mini-app:  
    ```bash
    docker compose -f docker-compose-arm64.yml up -d mini-app --build
    ```
2. Проверьте логи:  
    ```bash
    docker compose -f docker-compose-arm64.yml logs -f mini-app
     ```