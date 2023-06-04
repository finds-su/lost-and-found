# lost-and-found

> **Warning**
> 
> Development in progress

Бюро находок Mirea Ninja.

## Сборка проекта

### В режиме разработки

```shell
npm run dev
# OR
docker compose up --build
```

### На проде

```shell
docker compose up
```

## S3

### Жизненный цикл

#### Временные файлы (временный аватар, сгенерированнная картинка)

Префикс tmp
Тип Expiration
Срабатывание через 1 день

#### Файлы, загружаемые к постам

Префикс posts
Тип Expiration
Срабатывание через 90 дней

## Лицензия

<a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/"><img alt="Лицензия Creative Commons" style="border-width:0" src="https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png" /></a><br />Это произведение доступно по <a rel="license" href="http://creativecommons.org/licenses/by-nc-sa/4.0/">лицензии Creative Commons «Attribution-NonCommercial-ShareAlike» («Атрибуция-Некоммерчески-СохранениеУсловий») 4.0 Всемирная</a>
