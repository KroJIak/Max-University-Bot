// Получаем базовый URL для MAX API с приоритетом: сначала домен, потом HOST:PORT
// Переменные встраиваются через envsubst во время запуска контейнера
function getMaxApiUrl() {
    // Приоритет 1: Доменный URL из переменной окружения (если задан)
    const maxApiDomainUrl = '${MAX_API_DOMAIN_URL}';
    if (maxApiDomainUrl && maxApiDomainUrl.trim() !== '' && maxApiDomainUrl !== 'undefined') {
        const cleanUrl = maxApiDomainUrl.trim().replace(/\/+$/, '');
        return cleanUrl + '/api/v1';
    }
    
    // Приоритет 2: HOST:PORT из переменных окружения
    const maxApiHost = '${MAX_API_HOST}';
    const maxApiPort = '${MAX_API_PORT}';
    
    // Если HOST = 0.0.0.0, используем текущий хост (для доступа из браузера)
    if (maxApiHost === '0.0.0.0' || maxApiHost === 'localhost' || !maxApiHost || maxApiHost === 'undefined') {
        // Используем текущий хост, но меняем порт на порт API
        const currentHost = window.location.hostname;
        const port = maxApiPort && maxApiPort !== 'undefined' ? maxApiPort : '8003';
        return `http://${currentHost}:${port}/api/v1`;
    }
    
    const port = maxApiPort && maxApiPort !== 'undefined' ? maxApiPort : '8003';
    return `http://${maxApiHost}:${port}/api/v1`;
}

const API_BASE_URL = getMaxApiUrl();
const UNIVERSITY_STORAGE_KEY = 'selected_university_id';
const AUTH_TOKEN_KEY = 'university_auth_token';

// Функция для обновления состояния кнопки входа
function updateLoginButtonState() {
    const select = document.getElementById('university-select');
    const loginBtn = document.getElementById('login-btn');
    
    if (!select || !loginBtn) {
        console.warn('updateLoginButtonState: select или loginBtn не найдены');
        return;
    }
    
    const universityId = select.value;
    console.log('updateLoginButtonState: universityId =', universityId);
    
    // Всегда включаем кнопку после загрузки университетов
    // Проверка выбора университета будет в handleLogin()
    if (universityId && universityId !== '' && universityId !== 'undefined') {
        loginBtn.disabled = false;
        console.log('Кнопка входа включена (университет выбран)');
    } else {
        // Если университет не выбран, кнопка все равно активна, но при клике покажется сообщение
        loginBtn.disabled = false;
        console.log('Кнопка входа включена (университет не выбран, будет показано сообщение при клике)');
    }
}

// Загрузка списка университетов
async function loadUniversities() {
    const select = document.getElementById('university-select');
    const loginBtn = document.getElementById('login-btn');
    const errorMessage = document.getElementById('error-message');
    const createBtn = document.getElementById('create-university-btn');
    
    // Очищаем предыдущие ошибки
    errorMessage.classList.remove('show');
    
    try {
        const response = await fetch(`${API_BASE_URL}/universities`);
        
        if (!response.ok) {
            // Если ошибка, но не критичная, показываем возможность создать университет
            if (response.status === 404 || response.status >= 500) {
                throw new Error('Ошибка загрузки университетов');
            }
            throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
        }
        
        const universities = await response.json();
        
        // Очищаем select
        select.innerHTML = '';
        
        if (universities.length === 0) {
            select.innerHTML = '<option value="">Университеты не найдены. Создайте новую организацию.</option>';
            updateLoginButtonState();
            return;
        }
        
        // Добавляем опцию по умолчанию
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Выберите университет...';
        select.appendChild(defaultOption);
        
        // Добавляем университеты
        universities.forEach(university => {
            const option = document.createElement('option');
            option.value = university.id;
            option.textContent = university.name;
            select.appendChild(option);
        });
        
        // Проверяем, есть ли сохраненный университет
        const savedUniversityId = localStorage.getItem(UNIVERSITY_STORAGE_KEY);
        if (savedUniversityId) {
            const savedOption = Array.from(select.options).find(opt => opt.value === savedUniversityId);
            if (savedOption) {
                select.value = savedUniversityId;
            }
        }
        
        // Обновляем состояние кнопки в зависимости от выбранного университета
        updateLoginButtonState();
        
        // Если выбран университет, НЕ показываем поля для логина и пароля сразу
        // Поля покажутся при первом клике на кнопку "Войти"
        // Это делается для улучшения UX: сначала выбираем университет, потом вводим логин/пароль
        
    } catch (error) {
        console.error('Ошибка загрузки университетов:', error);
        select.innerHTML = '<option value="">Ошибка загрузки. Проверьте подключение к API.</option>';
        errorMessage.textContent = `Не удалось загрузить список университетов: ${error.message}`;
        errorMessage.classList.add('show');
        updateLoginButtonState();
        // Кнопка создания всегда видна, даже если API недоступен
    }
}

// Создание нового университета
async function createUniversity(name) {
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    const createBtn = document.getElementById('create-submit-btn');
    
    // Очищаем сообщения
    errorMessage.classList.remove('show');
    successMessage.classList.remove('show');
    
    if (!name || name.trim() === '') {
        errorMessage.textContent = 'Введите название организации';
        errorMessage.classList.add('show');
        return;
    }
    
    // Отключаем кнопку
    createBtn.disabled = true;
    createBtn.textContent = 'Создание...';
    
    try {
        const response = await fetch(`${API_BASE_URL}/universities`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name.trim()
            })
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Ошибка создания организации');
        }
        
        const university = await response.json();
        
        // Показываем сообщение об успехе
        successMessage.textContent = `Организация "${university.name}" успешно создана!`;
        successMessage.classList.add('show');
        
        // Скрываем форму создания
        document.getElementById('create-form').classList.remove('show');
        document.getElementById('university-name-input').value = '';
        
        // Перезагружаем список университетов
        await loadUniversities();
        
        // Автоматически выбираем созданный университет
        const select = document.getElementById('university-select');
        select.value = university.id.toString();
        
        // Показываем поля для логина и пароля
        const credentialsGroup = document.getElementById('credentials-group');
        if (credentialsGroup) {
            credentialsGroup.style.display = 'block';
        }
        
        // Устанавливаем дефолтные логин и пароль
        const loginInput = document.getElementById('login-input');
        const passwordInput = document.getElementById('password-input');
        if (loginInput) {
            loginInput.value = 'admin';
        }
        if (passwordInput) {
            passwordInput.value = 'admin';
        }
        
        // Через 1 секунду автоматически входим с дефолтными логином и паролем
        setTimeout(async () => {
            try {
                // Выполняем аутентификацию
                const response = await fetch(`${API_BASE_URL}/universities/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        university_id: university.id,
                        login: 'admin',
                        password: 'admin'
                    })
                });
                
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.detail || 'Ошибка аутентификации');
                }
                
                const authData = await response.json();
                
                // Сохраняем токен и данные университета
                localStorage.setItem(UNIVERSITY_STORAGE_KEY, university.id.toString());
                localStorage.setItem(AUTH_TOKEN_KEY, authData.access_token);
                localStorage.setItem('university_name', authData.university_name);
                
                // Переходим на главную страницу
                window.location.href = `index.html?university_id=${university.id}`;
            } catch (error) {
                console.error('Ошибка при автоматическом входе:', error);
                // Если автоматический вход не удался, просто показываем поля для ввода
                if (errorMessage) {
                    errorMessage.textContent = 'Университет создан. Пожалуйста, введите логин и пароль для входа.';
                    errorMessage.classList.add('show');
                }
            }
        }, 1000);
        
    } catch (error) {
        console.error('Ошибка создания организации:', error);
        errorMessage.textContent = error.message || 'Не удалось создать организацию';
        errorMessage.classList.add('show');
        createBtn.disabled = false;
        createBtn.textContent = 'Создать';
    }
}

// Загрузка университетов при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded: Начало инициализации');
    
    // Обработка формы логина (ДО загрузки университетов, чтобы обработчик был установлен)
    const loginForm = document.getElementById('login-form');
    const loginBtn = document.getElementById('login-btn');
    
    if (!loginForm) {
        console.error('Ошибка: форма login-form не найдена');
        return;
    }
    
    console.log('Форма login-form найдена, добавляем обработчик клика на кнопку');
    
    // Обработчик клика по кнопке входа
    if (loginBtn) {
        loginBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('Клик по кнопке входа');
            console.log('Кнопка disabled:', this.disabled);
            console.log('Кнопка type:', this.type);
            
            handleLogin();
            return false;
        });
        
        console.log('Обработчик клика добавлен на кнопку входа');
    } else {
        console.error('Кнопка login-btn не найдена!');
    }
    
    // Функция обработки входа
    async function handleLogin() {
        console.log('handleLogin вызвана');
        
        const select = document.getElementById('university-select');
        const errorMessage = document.getElementById('error-message');
        const loginBtn = document.getElementById('login-btn');
        const credentialsGroup = document.getElementById('credentials-group');
        const loginInput = document.getElementById('login-input');
        const passwordInput = document.getElementById('password-input');
        
        if (!select) {
            console.error('Ошибка: select не найден');
            if (errorMessage) {
                errorMessage.textContent = 'Ошибка: элемент формы не найден';
                errorMessage.classList.add('show');
            }
            return;
        }
        
        const universityId = select.value;
        console.log('Выбранный university_id:', universityId);
        
        // Проверяем, что университет выбран (это основная проверка)
        if (!universityId || universityId === '' || universityId === 'undefined') {
            if (errorMessage) {
                errorMessage.textContent = 'Выберите университет из списка';
                errorMessage.classList.add('show');
            }
            console.warn('Университет не выбран');
            // Фокусируемся на select для удобства пользователя
            select.focus();
            return;
        }
        
        // Если поля для логина и пароля скрыты, показываем их
        if (credentialsGroup && credentialsGroup.style.display === 'none') {
            credentialsGroup.style.display = 'block';
            if (loginInput) {
                loginInput.focus();
            }
            if (loginBtn) {
                loginBtn.textContent = 'Войти';
            }
            return;
        }
        
        // Получаем логин и пароль
        const login = loginInput ? loginInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value.trim() : '';
        
        if (!login || !password) {
            if (errorMessage) {
                errorMessage.textContent = 'Введите логин и пароль';
                errorMessage.classList.add('show');
            }
            console.warn('Логин или пароль не введены');
            if (loginInput) {
                loginInput.focus();
            }
            return;
        }
        
        // Отключаем кнопку и меняем текст
        if (loginBtn) {
            loginBtn.disabled = true;
            loginBtn.textContent = 'Авторизация...';
        }
        
        // Скрываем сообщение об ошибке
        if (errorMessage) {
            errorMessage.classList.remove('show');
        }
        
        try {
            // Выполняем аутентификацию
            console.log('Отправка запроса на аутентификацию:', { university_id: universityId, login });
            const response = await fetch(`${API_BASE_URL}/universities/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    university_id: parseInt(universityId),
                    login: login,
                    password: password
                })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.detail || 'Ошибка аутентификации');
            }
            
            const authData = await response.json();
            console.log('Аутентификация успешна:', authData);
            
            // Сохраняем токен и данные университета
            localStorage.setItem(UNIVERSITY_STORAGE_KEY, universityId);
            localStorage.setItem(AUTH_TOKEN_KEY, authData.access_token);
            localStorage.setItem('university_name', authData.university_name);
            
            console.log('Токен сохранен в localStorage');
            
            // Переходим на главную страницу
            console.log('Переход на index.html с university_id:', universityId);
            window.location.href = `index.html?university_id=${universityId}`;
            
        } catch (error) {
            console.error('Ошибка при аутентификации:', error);
            if (errorMessage) {
                errorMessage.textContent = error.message || 'Ошибка при аутентификации. Проверьте логин и пароль.';
                errorMessage.classList.add('show');
            }
            // Включаем кнопку обратно в случае ошибки
            if (loginBtn) {
                loginBtn.disabled = false;
                loginBtn.textContent = 'Войти';
            }
            // Фокусируемся на поле пароля для повторного ввода
            if (passwordInput) {
                passwordInput.focus();
                passwordInput.select();
            }
        }
    }
    
    // Добавляем обработчик изменения select для управления состоянием кнопки
    const select = document.getElementById('university-select');
    const credentialsGroup = document.getElementById('credentials-group');
    
    if (select) {
        select.addEventListener('change', function() {
            updateLoginButtonState();
            // При изменении выбора университета скрываем поля для логина и пароля
            // и сбрасываем значения на дефолтные
            if (credentialsGroup) {
                credentialsGroup.style.display = 'none';
                const loginInput = document.getElementById('login-input');
                const passwordInput = document.getElementById('password-input');
                if (loginInput) {
                    loginInput.value = 'admin';
                }
                if (passwordInput) {
                    passwordInput.value = 'admin';
                }
            }
            // Обновляем текст кнопки
            const loginBtn = document.getElementById('login-btn');
            if (loginBtn) {
                loginBtn.textContent = 'Войти';
            }
        });
    }
    
    // Загружаем список университетов
    loadUniversities();
    
    // Обработчик кнопки создания организации
    const createBtn = document.getElementById('create-university-btn');
    const createForm = document.getElementById('create-form');
    const createSubmitBtn = document.getElementById('create-submit-btn');
    const createCancelBtn = document.getElementById('create-cancel-btn');
    const universityNameInput = document.getElementById('university-name-input');
    
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            createForm.classList.add('show');
            universityNameInput.focus();
        });
    }
    
    if (createCancelBtn) {
        createCancelBtn.addEventListener('click', () => {
            createForm.classList.remove('show');
            universityNameInput.value = '';
            document.getElementById('error-message').classList.remove('show');
            document.getElementById('success-message').classList.remove('show');
        });
    }
    
    if (createSubmitBtn) {
        createSubmitBtn.addEventListener('click', () => {
            const name = universityNameInput.value.trim();
            createUniversity(name);
        });
    }
    
    // Обработка нажатия Enter в поле ввода названия
    if (universityNameInput) {
        universityNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                createSubmitBtn.click();
            }
        });
    }
    
    // Обработка нажатия Enter в полях логина и пароля
    const loginInput = document.getElementById('login-input');
    const passwordInput = document.getElementById('password-input');
    
    if (loginInput) {
        loginInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (passwordInput) {
                    passwordInput.focus();
                } else {
                    handleLogin();
                }
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleLogin();
            }
        });
    }
});

