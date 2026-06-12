# SmartFlow Roadmap

## v0.1-alpha (текущая версия)

Реализовано:

* Webhook Telegram
* Google Apps Script Backend
* Главное меню
* Выбор филиала
* Выбор услуги
* UserStates
* UserSessions
* AuditLog

---

## v0.2

Запись клиента

Реализовать:

Выбор услуги
↓
Выбор мастера
↓
До 3 вариантов времени
↓
Имя клиента
↓
Телефон клиента
↓
Создание заявки

## Technical Debt

### Localization Refactoring

Move all user-facing text from Apps Script code into Messages table.

## Added

- Provider selection
- Date selection
- Period selection
- Localization refactoring
- Constants.gs
- MESSAGE_KEYS
- STATES
- PROVIDER_IDS

Status: In Progress

---

## v0.3

Admin Bot

Функции:

* новые заявки
* подтверждение записи
* отмена записи
* список заявок
* фильтр по мастерам

---

## v0.4

Напоминания

Клиенту:

* за день
* за 2 часа

Возможность отключения каждого типа.

---

## v0.5

Google Calendar

Для каждого мастера:

* создание событий
* отображение занятости
* синхронизация записей

---

## v0.6

Многофилиальность

Поддержка:

* нескольких филиалов
* нескольких мастеров
* отдельных графиков

---

## v0.7

Website Booking

Сайт-визитка:

* услуги
* портфолио
* запись
* переход в Telegram

---

## v0.8

Instagram Integration

Поддержка:

* лидов из Instagram
* перехода в Telegram
* автоматического создания заявок

---

## v0.9

OLX Integration

Поддержка:

* входящих сообщений
* карточек товаров
* уведомлений

---

## v1.0

SmartFlow Platform

Универсальное решение для:

* салонов красоты
* массажистов
* ремонта техники
* мастерских
* частных специалистов
* OLX-магазинов

Статус цели:

Первая коммерческая версия.
