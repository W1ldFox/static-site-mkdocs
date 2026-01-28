# Отчёт о проекте

## Введение

Данный проект представляет собой статический сайт, созданный с помощью генератора **MkDocs** с кастомной темой и автоматизированным CI/CD пайплайном через GitHub Actions.

## Что сделано

### Кастомная тема

Создана собственная тема со следующими компонентами:

**Структура темы:**

```
custom_theme/
├── main.html      # Базовый Jinja2 шаблон
├── css/
│   └── style.css  # Стили 
└── js/
    └── main.js    # Интерактивность (мобильное меню, копирование кода)
```

**Особенности темы:**

- **Header**: фиксированный, с логотипом и навигацией, адаптивное мобильное меню
- **Footer**: тёмный, с тремя колонками (описание, навигация, ссылки)
- **Главная страница**: hero-секция с градиентом, карточки фич
- **Метаданные**: title, description, author, Open Graph теги
- **Адаптивность**: корректное отображение на разных форматах экрана
- **Дополнительно**: кнопка "Наверх", копирование кода, плавный скролл

### CI/CD пайплайн

Настроен GitHub Actions workflow со следующими этапами:

```yaml
# .github/workflows/deploy.yml
```

| Этап | Описание |
|------|----------|
| Checkout | Клонирование репозитория |
| Setup Python | Установка Python 3.x |
| Setup Node.js | Установка Node.js для инструментов сборки |
| Install dependencies | Установка Python и npm зависимостей |
| Build MkDocs | Сборка статического сайта |
| PostCSS processing | Autoprefixer для CSS |
| HTML validation | Проверка валидности HTML |
| Minify HTML | Минификация HTML файлов |
| Minify CSS | Минификация CSS через cssnano |
| Minify JS | Минификация JS через terser |
| Deploy | Публикация на GitHub Pages |

### Минификация и оптимизация

**Используемые инструменты:**

- **PostCSS + Autoprefixer** — автоматическое добавление вендорных префиксов
- **html-minifier-terser** — минификация HTML
- **cssnano** — минификация CSS
- **terser** — минификация JavaScript
- **html-validate** — валидация HTML

## 3. Содержимое workflow файла

```yaml
name: Deploy MkDocs with Custom Theme

on:
  push:
    branches:
      - main

permissions:
  contents: write

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
      
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.x'
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install Python dependencies
        run: pip install -r requirements.txt
      
      - name: Install Node.js dependencies
        run: npm ci
      
      - name: Build MkDocs site
        run: mkdocs build
      
      - name: Process CSS with PostCSS
        run: npx postcss site/css/style.css -o site/css/style.css
      
      - name: Validate HTML
        run: npx html-validate "site/**/*.html" || true
      
      - name: Minify HTML files
        run: |
          for file in site/*.html site/**/*.html; do
            if [ -f "$file" ]; then
              npx html-minifier-terser --collapse-whitespace --remove-comments \
                --minify-css true --minify-js true \
                -o "$file" "$file"
            fi
          done
      
      - name: Minify CSS
        run: npx postcss site/css/style.css -o site/css/style.css --use cssnano
      
      - name: Minify JavaScript
        run: npx terser site/js/main.js -o site/js/main.js -c -m
      
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./site
```

## Исследование

### Отечественные CDN

**Что такое CDN:**
Content Delivery Network — сеть серверов для быстрой доставки контента пользователям из географически ближайшей точки.

**Отечественные CDN-провайдеры:**

| Провайдер | Особенности |
|-----------|-------------|
| **Selectel CDN** | Интеграция с облаком Selectel, HTTPS, защита от DDoS |
| **VK Cloud CDN** | Часть экосистемы VK Cloud, API, кэширование |
| **Yandex Cloud CDN** | Интеграция с Object Storage, глобальное покрытие |
| **NGENIX** | Enterprise-решение, защита от атак |
| **G-Core Labs** | Глобальная сеть, стриминг |

**Как подключить (на примере Yandex Cloud CDN):**

1. Создать бакет в Object Storage
2. Загрузить статику (HTML, CSS, JS)
3. Создать CDN-ресурс в консоли
4. Указать origin (бакет)
5. Получить CDN-домен или привязать свой

### GitVerse и CI/CD

**GitVerse** — отечественная платформа для хостинга Git-репозиториев (аналог GitHub/GitLab).

**Возможности CI/CD:**

- Поддержка YAML-конфигурации пайплайнов
- Интеграция с Docker
- Параллельные и последовательные jobs
- Артефакты и кэширование
- Секреты и переменные окружения

**Сравнение с GitHub Actions:**

| Функция | GitHub Actions | GitVerse CI |
|---------|---------------|-------------|
| Конфигурация | YAML | YAML |
| Marketplace | 15000+ actions | Ограниченный |
| Бесплатный лимит | 2000 мин/мес | Зависит от тарифа |
| Self-hosted runners | Да | Да |
| Матричные сборки | Да | Да |

### Варианты деплоя статики

| Вариант | Плюсы | Минусы |
|---------|-------|--------|
| **GitHub Pages** | Бесплатно, интеграция с Actions | Только публичные репо (бесплатно) |
| **GitLab Pages** | Бесплатно, мощный CI | Сложнее настройка |
| **Netlify** | Бесплатно, превью PR, формы | Лимиты bandwidth |
| **Vercel** | Быстро, serverless functions | Ориентирован на JS |
| **Nginx на VPS** | Полный контроль, гибкость | Требует администрирования |
| **S3 + CloudFront** | Масштабируемость | Сложнее, платно |
| **Yandex Object Storage** | Отечественное решение | Требует настройки |

## Локальная разработка

```bash
# Клонирование
git clone https://github.com/W1ldFox/static-site-mkdocs.git
cd static-site-mkdocs

# Python окружение
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt

# Node.js зависимости
npm install

# Dev-сервер
mkdocs serve

# Сборка
mkdocs build
```

## Результат

- **Сайт:** [https://w1ldfox.github.io/static-site-mkdocs/](https://w1ldfox.github.io/static-site-mkdocs/)
- **Репозиторий:** [https://github.com/W1ldFox/static-site-mkdocs](https://github.com/W1ldFox/static-site-mkdocs)

## Заключение

В ходе выполнения задания:

1. ✅ Создана кастомная тема с header, footer и стилизованной главной страницей
2. ✅ Добавлены метаданные (title, description, author)
3. ✅ Настроен CI/CD пайплайн с валидацией, минификацией и деплоем
4. ✅ Исследованы отечественные CDN, GitVerse CI и варианты деплоя

---

*Автор: W1ldFox*  
*Дата: 2025*