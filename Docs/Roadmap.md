## roadmap.md

```markdown
# SmartFlow Beauty Demo Roadmap

## Completed in ClientBot v1

### Client UX

- Main menu
- Main menu button available during flows
- Book appointment
- My appointments
- Contacts
- Name is collected before booking details
- Phone is collected before booking details
- Customer note is collected before request creation

---

### Booking

- Location selection
- Service selection
- Provider selection
- Date selection
- Custom date selection
- Time selection
- Up to 3 preferred time options
- Request creation
- Owner notification

---

### Availability

- Provider weekly schedule
- Provider date overrides
- Current-day past slot filtering
- 30-minute slot step
- Rounded current-day slots
- Provider-specific busy slots
- Customer-specific duration
- Customer conflict blocking

---

### Customer-Specific Settings

- Customer lookup by phone
- CustomerServiceSettings support
- Individual duration by:
  - customer
  - service
  - provider
- Fallback to default service duration

---

### Customer Conflicts

- CustomerConflicts table
- Conflict customer lookup
- Conflict appointments block availability
- Supports salon-level conflict rule:
  - conflicting customers should not be present at the same time

---

### Owner Approval

- Owner receives request
- Owner can approve selected option
- Owner can reject request
- Duplicate approval protection
- Customer receives confirmed appointment details

---

### Appointments

- Appointment creation
- Appointment cancellation
- Appointment reschedule
- Appointment status updates
- Google Calendar event creation
- Google Calendar event update
- Google Calendar event deletion

---

### Google Calendar

- Shared salon calendar
- Bot-created Calendar events
- Calendar event ID storage
- Manual Calendar event lookup
- Manual Calendar event cancellation
- Manual Calendar event reschedule
- Sync Appointment time from Calendar when event is manually moved

---

### My Appointments

- Lookup by phone
- Shows bot-created appointments
- Shows manual Calendar events
- Shows customer note
- Cancel action
- Reschedule action

---

### Reminders

- 24h appointment reminder
- Reminder sending window: 08:00–21:00
- Reminder is sent only once
- Reminder is reset after appointment time change

---

### Contacts

- Contacts shown from Locations
- Multilingual location names and addresses through Messages
- Supports:
  - address
  - working hours
  - phone 1
  - phone 2
  - Instagram
  - Telegram
  - website
  - Google Maps URL

---

## Next Major Phase

### AdminBot v1

Primary goal:

```text
make data entry easy for salon owner/admin

AdminBot should manage:

customers
services
providers
schedules
schedule overrides
customer-specific duration
customer conflicts
AdminBot Priority 1
1. Customers
Search customer by phone
Create customer
Edit customer
View customer card
View customer appointments
2. Services
Add service
Edit service
Set default duration
Set base price
Activate/deactivate service
3. Providers
Add provider
Edit provider
Assign location
Set provider Telegram ID
Set provider calendar ID
Activate/deactivate provider
4. Schedules
Set weekly schedule
Add date override
Mark day off
Set short working day
Set extra working day
5. CustomerServiceSettings
Search customer
Select service
Select provider
Set individual duration
Set individual price
6. CustomerConflicts
Search customer A
Search customer B
Add conflict
Remove conflict
List conflicts
AdminBot Priority 2
Today's appointments
Tomorrow's appointments
Appointments by provider
Cancel appointment
Reschedule appointment
Mark appointment as completed
Mark no-show
Create manual appointment
AdminBot Priority 3
Broadcasts to customers
Statistics
Visit history
Revenue reports
Service popularity
Provider workload
Customer retention
Future Option

Telegram Web App may be added later for complex forms.

For now, AdminBot should use step-by-step Telegram flows.