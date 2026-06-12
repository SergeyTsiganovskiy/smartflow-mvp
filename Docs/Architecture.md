# SmartFlow Architecture

## Концепция

SmartFlow — универсальная система автоматизации малого бизнеса.

Основная идея:

Telegram является единым окном управления бизнесом.

Клиенты могут обращаться через:

* Telegram
* Instagram
* Сайт
* OLX
* Prom
* другие источники

Но все заявки приводятся к единой внутренней модели данных.

---

## Бизнес-модель

SmartFlow продаётся как услуга настройки готового решения.

Клиент получает:

* собственного Telegram-бота
* собственную Google таблицу
* собственный Apps Script
* полный контроль над данными

Исполнитель предоставляет:

* шаблон SmartFlow
* настройку
* поддержку
* доработки

---

## Архитектура установки

Один клиент:

Telegram Bot
↓
Google Apps Script
↓
Google Sheets

Каждый клиент имеет собственную установку.

---

## Принцип хранения данных

Все данные принадлежат клиенту.

Исполнитель не хранит:

* клиентскую базу
* записи
* телефоны
* расписания

Всё находится в Google аккаунте клиента.

---

## MVP-философия

Сначала максимально простая система.

Клиент предлагает до 3 вариантов времени.

Мастер выбирает подходящий вариант вручную.

Никакой сложной автоматической логики на первом этапе.

---

## Масштабирование

После MVP планируется:

* Admin Bot
* Google Calendar
* Instagram Integration
* OLX Integration
* Website Booking
* AI Assistant
* Analytics Dashboard

Текущая версия:

SmartFlow Beauty MVP v0.1-alpha

## Localization Rule

All user-facing text must be stored in Messages sheet.

Apps Script code must never contain business-facing text.

Code may only use message keys.

Example:

GOOD:
getMessage('SELECT_PROVIDER')

BAD:
'Выберите мастера'

## State Update Rule

When moving user to a new step:

1. Save state
2. Send message

GOOD:

setUserState(...)
sendTelegramMessage(...)

BAD:

sendTelegramMessage(...)
setUserState(...)

## Customer Identification

Primary customer identifier:

* phone

Secondary identifiers:

* telegram_id

Reason:

* One Telegram account may be used to create appointments for multiple family members.
* Future integrations (website, Instagram, manual entry, OLX, etc.) may not have Telegram IDs.
* Phone number is the universal identifier across channels.

Customer matching logic:

1. Search by phone.
2. If customer exists, update profile.
3. If customer does not exist, create customer.

## Customer Lifecycle

Client creates request
↓
Customer created with status = lead
↓
Request created with status = pending
↓
Owner reviews request
↓
Owner approves selected option
↓
Appointment created
↓
Customer status = confirmed
↓
Request status = confirmed

Entities:

Customers
Requests
RequestOptions
Appointments

Customer identity:

Primary key:

* phone

Secondary identifiers:

* telegram_id

Reason:

* one Telegram account may create appointments for multiple family members
* future integrations may not provide Telegram ID

