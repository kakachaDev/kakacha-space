# Комментарии в блоге — как включить

Виджет уже встроен (`src/components/CommentsSection.vue`), но скрыт, пока не задан бэкенд.
Поддерживаются два варианта; какой активен — определяется env-переменными на этапе сборки.

## Вариант 1: Remark42 (решение Умпутуна, нужен VPS)

Remark42 — self-hosted движок комментариев: свои данные, вход через соцсети/анонимно, русский интерфейс.
Нужен любой дешёвый VPS с Docker (хватит 1 ГБ RAM).

1. Заведи поддомен `comments.kakacha.space` → IP сервера.
2. На сервере:

```yaml
# docker-compose.yml
services:
  remark42:
    image: umputun/remark42:latest
    restart: always
    environment:
      - REMARK_URL=https://comments.kakacha.space
      - SITE=kakacha-space
      - SECRET=<случайная-длинная-строка>
      - AUTH_ANON=true
      - AUTH_TELEGRAM=false
      - ADMIN_SHARED_ID=<твой-id-после-первого-входа>
    volumes:
      - ./var:/srv/var
    ports:
      - "8080:8080"
```

3. Перед ним — любой reverse-proxy с TLS (caddy проще всего: `caddy reverse-proxy --from comments.kakacha.space --to localhost:8080`).
4. В `.env` сборки сайта:

```
VITE_REMARK42_HOST=https://comments.kakacha.space
VITE_REMARK42_SITE_ID=kakacha-space
```

5. Пересобери и задеплой сайт — блок «Комментарии» появится под постами.

## Вариант 2: giscus (без сервера, 5 минут)

Комментарии живут в GitHub Discussions этого репозитория. Бесплатно, без сервера,
но комментировать смогут только люди с GitHub-аккаунтом (для дев-блога это ок).

1. Репозиторий `kakachaDev/kakacha-space` должен быть публичным.
2. В настройках репо включи Discussions, создай категорию `Blog` (тип Announcement).
3. Установи приложение giscus: https://github.com/apps/giscus (доступ только к этому репо).
4. Зайди на https://giscus.app, укажи репо — сайт выдаст `data-repo-id` и `data-category-id`.
5. В `.env`:

```
VITE_GISCUS_REPO=kakachaDev/kakacha-space
VITE_GISCUS_REPO_ID=<из giscus.app>
VITE_GISCUS_CATEGORY=Blog
VITE_GISCUS_CATEGORY_ID=<из giscus.app>
```

6. Пересобери и задеплой.

## Приоритет

Если заданы обе группы переменных, выигрывает Remark42.
