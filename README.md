//todo расписать разбивку по этапам

# Заметки во время просмотра исходника, до правок

## `/src/`

**`./index.js`**
Фактически является точкой монтирования для компонента `App`, который хранит основную массу кода.

**`./index.css`**
Является точкой импорта стилей из блоков `blocks` и `vendor`.

## `/blocks`

Здесь находятся стили без кода, вероятно, использующие BEM-подход/нотацию.

## `/vendor`

Некоторые внешние стили и шрифты. С точки зрения разделения на микрофронтенды этот блок не очень информативен, но нужно будет подумать, как его расшарить между модулями.

## `/images`

Картинки из разных доменов.

## `/components`

### `./App.js`
Корневой компонент, содержащий множество колбэков для обработки разнородной информации и обращений к API. Хотя код небольшой, он нарушает принцип единственной ответственности (SRP). Его стоит порефакторить так, чтобы он оставался лишь точкой компоновки остальных элементов, например, работы с авторизацией и т.п.

Компоненты, монтируемые на верхнем уровне: `Main`, `Register`, `Login`, `Footer`, `EditProfilePopup`, `AddPlacePopup`, `PopupWithForm`, `ImagePopup`, `InfoTooltip`, `ProtectedRoute`.

### `./Main.js` (Профиль, карточки)
Хранит информацию профиля: имя пользователя, его аватар, а также кнопки для инициализации его редактирования. Также включает коллекцию карточек. В целом, компонент сильно связан сразу с двумя областями: контентом и данными профиля.

### `./Register.js` (Авторизация, регистрация)
Форма регистрации. Имеет чёткое назначение и зависит только от состояния. Запросы данных идут через колбэк.

### `./Login.js` (Авторизация)
Форма входа. Просто набор инпутов в форме. Работа с бекендом осуществляется через колбэк.

### `./EditProfilePopup.js` (Профиль)
Фактически простая форма с инпутами для редактирования профиля. Опирается на контекст для получения данных и обновляет их через колбэк.

### `./AddPlacePopup.js` (Карточки)
Форма с инпутами для добавления информации по карточкам мест.

### `./PopupWithForm.js`
Контейнер для всплывающих окон формы добавления карточек, редактирования аватара и редактирования профиля.

### `./ImagePopup.js` (Картинки)
Всплывающее окно с картинкой карточки. Открывается с уровня `App`.

### `./InfoTooltip.js` (Авторизация, регистрация)
Отображение ошибок при регистрации.

### `./ProtectedRoute.js` (Утилиты)
Обёртка маршрутов, которая перенаправляет на страницу логина, если пользователь не авторизован.

### `./Cards.js` (Карточки)
Непосредственно сама карточка. Внутри есть функциональность для лайков и удаления карточки.

### `./Footer.js` (Элемент верстки)
Компонент без свойств и полей. Просто статический элемент с информацией о копирайте.

## маршрутизация
### `/`
основная страница приложения содержит данные о пользователе, а также спсиок фотографий
роут требует авторизации если авторизации нет пользователь будет перенаправлен на страницу  `/signin`
### `/signin`
страница логина, которая содержит только непосредственно форму логина и перенаправление на регистраю
### `/signup`
страница регистрации
## зависимости проекта
проект основывается на react версии 17, каких либо дополнительных библиотек из "экосистемы" реакта, типа redux store, не используется 
## стили
стили организованы как бем компоненты, но есть проблема с тем что чать функционала профиля зависит от стиля попапов


# Проектирование

четко выделяются следующее области

- авторизация - логин регистрация 
- профиль - редактирование
- карточки - просмотр карточек, добавление, удаление, лайки

стретегия реализации
все 3ри могут быть разделены исходя из стратегии _вертикальной нарезки_,
в необходимости следовать стратегии _автономности команд(стека)_ нет, т.к. при условии того, что по условию задачи разделяется существующий проект с одним единственным подходом основанном на реакте, это также позволит организовывать более простое взаимодействие, например через props, а также переиспользовать код, если в этом будет потребность

работа с общими данными
приложение мнонлит распростряняет через контекст данные о пользователе, решение основанное на микрофронтенде, будет использовать гибридный подход, частично данными через события(шину), а также спускать данные через пропс (вариант с единным стейтом)

стили
разделение стилей было основано на бем, но в данными момент есть технический долг в том, что компоненты профиля, и добавления изображений зависят от стилей всплывающего окна которое находится в хост приложении, что в последствии можно устранить выделив функционал всплывающих окон в отдельный npm модуль либо микрофронтенд

## запуск решения
реализован через использование докера

`docker compose up -d`

докер использует порты
`:3100` - backend
`:27017` - mongodb
`:3000-3003` - фронтенды

после успешного запуска фронтенд будет доступен по адресу

http://localhost:3000