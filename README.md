# lost-and-found

> **Warning**
> 
> Development in progress

Бюро находок Mirea Ninja.

## Скриншоты

<p float="left">
  <img width="300" src="https://github.com/mirea-ninja/lost-and-found/assets/70258211/5ae9ad01-b23d-408e-a37f-de13b0ed4b3d">
  <img width="300" src="https://github.com/mirea-ninja/lost-and-found/assets/70258211/00e6084f-60dc-496e-92a8-8bd24a57717e">
  <img width="300" src="https://github.com/mirea-ninja/lost-and-found/assets/70258211/74091316-8ac7-4a4a-b7cd-7b949ff38de5">
  <img width="300" src="https://github.com/mirea-ninja/lost-and-found/assets/70258211/41af2712-55cc-4efe-9be8-0fba5533de89">
  <img width="300" src="https://github.com/mirea-ninja/lost-and-found/assets/70258211/d46e1f7c-15e6-456f-bab5-ecdc08288cc3">
  <img width="300" src="https://github.com/mirea-ninja/lost-and-found/assets/70258211/2697c55a-d006-4500-9efa-6f711a59b023">
  <img width="300" src="https://github.com/mirea-ninja/lost-and-found/assets/70258211/9a20cc4f-6826-4237-97d2-10e420c126b0">
  <img width="300" src="https://github.com/mirea-ninja/lost-and-found/assets/70258211/ac9b01d1-9334-411a-b095-effd736e8ee7">
</p>

<p float="left">
  <img width="450" src="https://github.com/mirea-ninja/lost-and-found/assets/70258211/2ed96812-5b25-4aaf-ac70-acf95e2d6b71">
  <img width="450" src="https://github.com/mirea-ninja/lost-and-found/assets/70258211/77606c5a-dfa6-4fc2-b501-0e36b97b6862">
  <img width="450" src="https://github.com/mirea-ninja/lost-and-found/assets/70258211/304e0594-943c-48c6-9e12-50de71f8a746">
</p>

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
