## roadmap.md

```markdown
# SmartFlow Beauty Demo Roadmap

## Completed

### Booking

- Client start menu
- Location selection
- Service selection
- Provider selection
- Date selection
- Custom date selection
- 60-day booking window
- Time selection
- Up to 3 preferred options
- Customer name input
- Customer phone input
- Request creation

---

### Availability

- Provider weekly schedule
- Provider date overrides
- Working day detection
- Day-off detection
- Service duration support
- Individual customer-service duration support
- Busy slot detection from Appointments
- Current-day past slot filtering
- 30-minute slot step

---

### Owner Approval

- Request notification to owner
- Approve selected option
- Reject request
- Duplicate approval protection
- Request status update
- Request option status update
- Customer status update

---

### Appointments

- Appointment creation
- Appointment start time
- Appointment end time
- Appointment status
- Appointment calendar_event_id
- Appointment cancellation
- Appointment reschedule

---

### Google Calendar

- Shared salon calendar
- Calendar event creation from Appointment
- Calendar event ID storage
- Calendar event deletion on cancellation
- Calendar event update on reschedule
- Manual Calendar event lookup by phone
- Manual Calendar event cancellation
- Manual Calendar event reschedule

---

### My Appointments

- Lookup by phone
- Phone normalization
- Retry flow if no appointments found
- Active Appointments display
- Manual Calendar events display
- Appointment cards with inline actions

---

### Cancellation

- Confirmation before cancellation
- Back to appointment card
- Appointment status changed to cancelled
- Calendar event deleted
- Client notification
- Owner notification

---

### Reschedule

- Confirmation before reschedule
- Back to appointment card
- New date selection
- Custom date selection
- New time selection
- Appointment date/time update
- Calendar event date/time update
- Client notification
- Owner notification
- Manual Calendar event reschedule

---

## Next Priority

### 1. Cleanup

- Remove temporary debug logs
- Remove unused functions
- Replace hardcoded text with Messages keys
- Review duplicate helper functions
- Check all callback actions naming

---

### 2. Reminders

Planned reminders:

```text
24 hours before appointment
2 hours before appointment

Possible implementation:

time-driven Apps Script trigger
check Appointments with status confirmed
send Telegram reminder
mark reminder as sent

May require new columns:

reminder_24h_sent_at
reminder_2h_sent_at
3. Appointment Completion

Add status flow:

confirmed
↓
completed

Useful for:

visit history
customer last_visit_at
future analytics
4. Customer History

Show:

previous appointments
cancelled appointments
no-show appointments
total visits
last visit date
5. Admin Improvements

Possible features:

owner command to list today's appointments
owner command to list tomorrow's appointments
manual appointment creation from bot
quick customer search
provider daily workload
6. Reporting

Possible reports:

appointments by provider
appointments by service
cancellations
revenue estimate
customer return rate
Later
Multi-branch calendars
Separate provider calendars
Role-based access
Admin bot
Customer language preference per Telegram user
Web dashboard