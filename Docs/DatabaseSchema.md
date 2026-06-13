# Database Schema

## Customers

```text
customer_id
telegram_id
name
phone
language
created_at
updated_at
last_visit_at
status
notes
```

## Requests

```text
request_id
customer_id
service_id
provider_id
location_id
status
created_at
```

## RequestOptions

```text
option_id
request_id
preferred_date
preferred_time
priority
status
created_at
```

## Appointments

```text
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
```

## UserSessions

```text
telegram_id
location_id
service_id
provider_id
option_count

current_option_date
current_option_time

option1_date
option1_time

option2_date
option2_time

option3_date
option3_time

customer_name
customer_phone

updated_at
```

## Appointment Statuses

```text
confirmed
cancelled
completed
```

## Request Statuses

```text
pending
confirmed
rejected
```

## Customer Statuses

```text
lead
confirmed
```