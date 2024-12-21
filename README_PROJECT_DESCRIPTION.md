# <table>
<tr>
    <td>
        <img src="./readme-img/diamond_original.png" alt="Калькулятор алмазной вышивки" style="width:80px;height:80px">
    </td>
    <td>
        Diamond-Embroidery-Calculator<br>Калькулятор алмазной вышивки
    </td>
</tr>
</table>

## Описание проекта React-Electron на TypeScript на с Webpack
- В качестве рабочего инструмента использовался Visual Studio Code
- В качестве основного языка программирования использовался **TypeScript**
- А также использовался **HTML** и **SCSS**
- Использовался фреймворк **Electron** 
- В UI написан с использовался **React.js**
- Для сохранения данных приложения использовался **electron-store** 

## Описание окружения для сборки проекта
Были использованы следующие инструменты:
- **node.js** - программная платформа
- **npm** - менеджер пакетов для **node.js**
- **Webpack** - использовался для сборки проекта

### Общая концепция
Вся работа осуществляется в каталоге `src/`.

Для ускорения сборки проекта при разработке, было решено сборку тем приложения собирать отдельно. **Перед первым запуском сборки проекта в режиме разработки** необходимо собрать темы (это делается npm script'ом `build-themes-dev`), и уже потом запускать сборку проекта в режиме разработки (npm script'ом `start`). Все последующие запуски можно просто запускать npm script'ом `start`, т.к. код тем приложения не менялся и он будет просто скопирован.
При сборке проекта в режиме разработки, все темы просто копируются из папки `build-themes`, и это быстрее чем их собирать при каждом запуске.

Для проекта версии production происходи тоже самое, но темы приложения пересобираются всегда при запуске npm script'а `build-setup`.  

- `src/` - каталог для размещения исходного кода приложения (html, scss, ts, tsx, изображений, и др.)
    - `app` - каталог с фронтендом приложения
    - `preload` - каталог со скриптом предварительной загрузки
    - `electron` - каталог с бэкендом приложения 
    - `assets` - ассэты(активы) программы - файлы, на который ссылается веб-страница
    - `shared` - каталог с общим функционалом, который используется в бэкенде и фронтенде
- `build/` - каталог для размещения собранного проекта(версии development) для разработки и отладки, без минимизации и без 
name mangling'а. С темами приложения.
- `prod` - каталог для размещения собранного проекта(версии production), c минимизацией и c name mangling'ом. С темами приложения.
- `build-themes/` - каталог для размещения собранных скриптов тем приложения(версии development) для разработки и отладки, без минимизации и без name mangling'а.
- `build-themes-prod/` - каталог для размещения собранных скриптов тем приложения(версии production), с минимизации и с name mangling'а.
- `dist/` - каталог для размещения собранного проекта(версии production) готового для распространению, с файлом инсталлятором и скриптами для автообновления приложения.


### Все npm скрипты проекта:

Основные npm скрипты:
- `start-only` - только запускает собранное ранне приложение в режиме отладки (из папки `build`),
- `start` - собирает и запускает приложение в режиме отладки (в папки `build`),
- `build-setup` - собирает проект в режиме производства (в папку `prod`) и создаёт файлы для установки приложения(в папке `dist`)

Вспомогательные npm скрипты:
- `build-dev` - очищает папку `build`, собирает проект в режиме отладки (в папке `build`) и копирует темы в режиме отладки (из папки `build-themes` в папку `build`),
- `build-prod` - очищает папку `prod`, собирает темы проекта (в папке `build-themes-prod`), собирает проект в режиме производства (в папке `prod`) и копирует темы в режиме производства (из папки `build-themes-prod` в папку `prod`),
- `clean-dev` - очищает папку `build`,
- `clean-prod` - очищает папку `prod`,
- `copy-themes-dev` - копирует содержимое из папки `build-themes` в папку `build`. Копирование тем приложения в режиме отладки,
- `copy-themes-prod` - копирует содержимое из папки `build-themes-prod` в папку `prod`. Копирование тем приложения в режиме производства,
- `build-themes-dev` - сборка тем в режиме отладки в папку `build-themes`,
- `build-themes-prod` - сборка тем в режиме производства в папку `build-themes-prod`

Прочие npm скрипты:
- `test` - запуск тестов приложения,
- `npm-clear-cache` - очистка кэша npm,
- `better-audit`- запуск аудита

### Были использованы следующие npm пакеты:
- Для сборки и отладки проекта:

    - Основные пакеты:
        - [webpack](https://www.npmjs.com/package/webpack) - это сборщик модулей. Его основная цель — сборка файлов JavaScript для использования в браузере, но он также способен преобразовывать, объединять или упаковывать практически любой ресурс или ассэт(актив),
        - [webpack-cli](https://www.npmjs.com/package/webpack-cli) - предоставляет разработчикам гибкий набор команд для повышения скорости при настройке проекта на webpack
        - [electron](https://www.npmjs.com/package/electron) - фреймворк, который позволяет писать кроссплатформенные настольные приложения с использованием JavaScript, HTML и CSS, основан на Node.js и Chromium.
        - [electron-builder](https://www.npmjs.com/package/electron-builder) - полноценное решение для упаковки и создания готового к использованию приложения Electron. Он добавляет одну единственную зависимость, ориентированную на простоту, и управляет всеми дополнительными требованиями изнутри. Заменяет функции и модули, используемые разработчиками Electron (например, автообновление), на пользовательские.
        
        - [typescript](https://www.npmjs.com/package/typescript) - транспилятор TypeScript, преобразует код на TypeScript в код на JavaScript. Добавляет необязательные типы в JavaScript, которые поддерживают инструменты для крупномасштабных приложений JavaScript для любого браузера, для любого хоста, на любой ОС

    - Загрузчики для Webpack:
        - [css-loader](https://www.npmjs.com/package/css-loader) - загрузчик, нужен, чтобы Webpack мог обработать импорты CSS файлов в файлах,
        - [sass-loader](https://www.npmjs.com/package/sass-loader) - загрузчик Sass/SCSS, загружает файл Sass/SCSS и компилирует его в CSS,
        - [file-loader](https://www.npmjs.com/package/file-loader) - загрузчик файлов, преобразует import/require() файла в URL-адрес и отправляет файл в выходной каталог,
        - [ts-loader](https://www.npmjs.com/package/ts-loader) - загрузчик TypeScript,

    - Плагины для Webpack:
        - [html-webpack-plugin](https://www.npmjs.com/package/html-webpack-plugin) - плагин, который упрощает создание HTML-файлов в webpack. Это особенно важно, когда включают хэш в имени файла, который меняется при каждой компиляции. Вы можете либо позволить плагину сгенерировать HTML-файл для вас, либо предоставить свой собственный шаблон с помощью шаблонов lodash, либо использовать свой собственный загрузчик
        - [mini-css-extract-plugin](https://www.npmjs.com/package/mini-css-extract-plugin) - плагин извлекает CSS в отдельные файлы. Он создает файл CSS для каждого файла JS, который содержит CSS. Он поддерживает загрузку CSS и SourceMaps по требованию,
        - [image-minimizer-webpack-plugin](https://www.npmjs.com/package/image-minimizer-webpack-plugin) - плагин и загрузчик для webpack для оптимизации (сжатия) всех изображений с помощью imagemin.

    - Пакеты для обработки изображений:
        - [imagemin](https://www.npmjs.com/package/imagemin) - пакет для сжатия файлов png, jpg, gif и svg,
        - [imagemin-gifsicle](https://www.npmjs.com/package/imagemin-gifsicle) - пакет для оптимизации и сжатия файлов gif,
        - [imagemin-jpegtran](https://www.npmjs.com/package/imagemin-jpegtran) -  пакет для сжатия файлов jpeg,
        - [imagemin-optipng](https://www.npmjs.com/package/imagemin-optipng) - пакет для оптимизации и сжатия файлов png,
        - [imagemin-svgo](https://www.npmjs.com/package/imagemin-svgo) - пакет для оптимизации и сжатия файлов svg,

- Для работы приложения:
    - [@tanstack/react-table](https://www.npmjs.com/package/@tanstack/react-table) - пакет содержит определения типов для react-table и material-react-table,
    - [@types/electron-progressbar](https://www.npmjs.com/package/@types/electron-progressbar) - пакет содержит определения типов для electron-progressbar
    - [@types/react](https://www.npmjs.com/package/@types/react) - пакет содержит определения типов для React,
    - [@types/react-dom](https://www.npmjs.com/package/@types/react-dom) - пакет содержит определения типов для react-dom,
    - [@types/react-text-mask](https://www.npmjs.com/package/@types/react-text-mask) - пакет содержит определения типов для react-text-mask,
    - [@types/text-mask-addons](https://www.npmjs.com/package/@types/text-mask-addons) - пакет содержит определения типов для text-mask-addons,
    - [bootstrap](https://www.npmjs.com/package/bootstrap) - элегантный, интуитивно понятный и мощный интерфейсный фреймворк для более быстрой и простой веб-разработки,
    - [bootstrap-icons](https://www.npmjs.com/package/bootstrap-icons) - библиотека иконок SVG с открытым исходным кодом для Bootstrap,
    - [bootswatch](https://www.npmjs.com/package/bootswatch) - коллекция тем с открытым исходным кодом для Bootstrap,
    - [electron-log](https://www.npmjs.com/package/electron-log) - простой модуль логирования для Electron/Node.js/NW.js приложений,
    - [electron-progressbar](https://www.npmjs.com/package/electron-progressbar) - пакет для создания индикаторов прогресса, включая визуальные аспекты с помощью CSS, а также текст и любую другую видимую информацию. А так же, библиотека позволяет настраивать Electron BrowserWindow, содержащий индикаторы прогресса,
    - [electron-store](https://www.npmjs.com/package/electron-store) - пакет для простого сохранения данных приложения или модуля Electron — сохранение и загрузка пользовательских настроек, состояния приложения, кэша и т. д.,
    - [electron-updater](https://www.npmjs.com/package/electron-updater) -  модуль позволяет автоматически обновлять ваше приложение. Вам нужно всего лишь установить этот модуль и написать две строки кода! Для публикации ваших обновлений вам понадобится только простой файловый хостинг,
    - [formik](https://www.npmjs.com/package/formik) - библиотека форм с открытым исходным кодом для React и React Native для работы с html формами,
    - [material-react-table](https://www.npmjs.com/package/material-react-table) - пакет для создания мощных таблиц и списков данных на React и TS/JS,
    - [react](https://www.npmjs.com/package/react) - библиотека для создания пользовательских интерфейсов,
    - [react-bootstrap](https://www.npmjs.com/package/react-bootstrap) - это библиотека React-компонентов, для  переиспользования, которая реализует возможности популярного шаблона Bootstrap,
    - [react-dom](https://www.npmjs.com/package/react-dom) - пакет служит точкой входа в DOM и серверные рендеры для React. Он предназначен для работы в паре с общим пакетом React, который поставляется как react в npm,
    - [react-dropzone](https://www.npmjs.com/package/react-dropzone) - пакет с хуком React для создания зоны перетаскивания файлов, совместимой с HTML5,
    - [react-number-format](https://www.npmjs.com/package/react-number-format) - библиотека форматирования ввода с современным и легким механизмом каретки. Она гарантирует, что пользователь может вводить только текст, который соответствует определенным числовым или строковым шаблонам, и форматирует вводимое значение для отображения,
    - [react-router-dom](https://www.npmjs.com/package/react-router-dom) - это маршрутизатор для React,
    - [react-text-mask](https://www.npmjs.com/package/react-text-mask) - это библиотека масок ввода. Она может создавать маски ввода для телефона, даты, валюты, почтового индекса, процента, электронной почты и буквально чего угодно,
    - [rxjs](https://www.npmjs.com/package/rxjs) - RxJS - Reactive Extensions Library на JavaScript. Это библиотека для "Продвинутого управления событиями" и "Более мощная альтернатива промисам" в одном лице. Она позволяет удобно организовать работу с событиями и асинхронным кодом, а также писать сложную логику декларативно,
    - [sass](https://www.npmjs.com/package/sass) - преобразует sass и scss файлы в css и минифицырует их,
    - [short-unique-id](https://www.npmjs.com/package/short-unique-id) - это библиотека для генерации случайных или последовательных UUID любой длины с исключительно малой вероятностью дублирования идентификаторов,
    - [text-mask-addons](https://www.npmjs.com/package/text-mask-addons) - это дополнение представляют собой готовые к использованию pipe'ы и маски, которые можно использовать с Text Mask,
    - [yup](https://www.npmjs.com/package/yup) - это конструктор схем для анализа и проверки значений во время выполнения.  Схемы Yup чрезвычайно выразительны и позволяют моделировать сложные, взаимозависимые проверки или преобразование значений.
