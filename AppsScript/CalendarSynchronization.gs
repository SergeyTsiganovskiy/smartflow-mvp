function syncAppointmentWithCalendar(appointment) {
  if (!appointment || !appointment.calendar_event_id) {
    return appointment;
  }

  const calendarId = getProviderCalendarId(appointment.provider_id);

  if (!calendarId) {
    return appointment;
  }

  const calendar = CalendarApp.getCalendarById(calendarId);

  if (!calendar) {
    return appointment;
  }

  const event = calendar.getEventById(appointment.calendar_event_id);

  if (!event) {
    return appointment;
  }

  const timezone = getSettings().TimeZone || 'Europe/Kyiv';

  const calendarStartAt = Utilities.formatDate(event.getStartTime(), timezone, 'yyyy-MM-dd HH:mm');

  const calendarEndAt = Utilities.formatDate(event.getEndTime(), timezone, 'yyyy-MM-dd HH:mm');

  const currentStartAt = formatDateTimeForStorage(appointment.start_at);

  const currentEndAt = formatDateTimeForStorage(appointment.end_at);

  const changed = currentStartAt !== calendarStartAt || currentEndAt !== calendarEndAt;

  if (!changed) {
    return appointment;
  }

  updateAppointmentDateTime(appointment.appointment_id, calendarStartAt, calendarEndAt);

  appointment.start_at = calendarStartAt;
  appointment.end_at = calendarEndAt;
  appointment.reminder_24h_sent_at = '';
  appointment.reminder_2h_sent_at = '';
  appointment.customer_confirmed = '';
  appointment.customer_confirmed_at = '';

  return appointment;
}
