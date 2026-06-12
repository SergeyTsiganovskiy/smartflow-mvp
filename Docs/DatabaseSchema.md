# SmartFlow Database Schema

## Settings

Настройки системы.

Поля:

* ClientBotToken
* AdminBotToken
* Language
* TimeZone
* OwnerTelegramId
* ClientWebAppUrl

---

## Messages

Локализация интерфейса.

Колонки:

* key
* uk
* ru
* en

---

## Locations

Филиалы.

Поля:

* location_id
* name
* address
* phone
* active

---

## Services

Услуги.

Поля:

* service_id
* name_uk
* name_ru
* name_en
* min_duration
* max_duration
* price_from
* price_to
* active

---

## Providers

Мастера.

Планируемая структура:

* provider_id
* location_id
* name
* phone
* telegram_id
* calendar_id
* active

---

## Customers

Клиенты.

Планируемая структура:

* customer_id
* telegram_id
* full_name
* phone
* language
* created_at

---

## Requests

Заявки.

Планируемая структура:

* request_id
* customer_id
* location_id
* service_id
* provider_id
* status
* created_at

---

## RequestOptions

Варианты времени.

Поля:

* option_id
* request_id
* datetime
* priority

priority:

1 = предпочтительный вариант

0 = дополнительный вариант

---

## Appointments

Подтверждённые записи.

Поля:

* appointment_id
* request_id
* provider_id
* start_datetime
* end_datetime
* status

---

## UserStates

Текущее состояние диалога.

Поля:

* telegram_id
* state
* updated_at

---

## UserSessions

Временные данные мастера записи.

Поля:

* telegram_id
* location_id
* service_id
* provider_id
* option_count
* updated_at

---

## AuditLog

Технический журнал.

Поля:

* timestamp
* action
* details

### Customers

customer_id
telegram_id
name
phone
language
created_at
updated_at
last_visit_at
notes
status

Status values:

lead
confirmed

### RequestOptions

option_id
request_id
preferred_date
preferred_time
priority
status
created_at

### Appointments

appointment_id
request_id
customer_id
service_id
provider_id
location_id
start_at
end_at
status
calendar_event_id
created_at
updated_at

