function getCalendarEventByAppointment(appointment) {
  const calendarEventId = String(appointment.calendar_event_id || '').trim();

  if (!calendarEventId) {
    return null;
  }

  const calendarId = getProviderCalendarId(appointment.provider_id);

  if (!calendarId) {
    return null;
  }

  const calendar = CalendarApp.getCalendarById(calendarId);

  if (!calendar) {
    return null;
  }

  try {
    const start = new Date(parseDateTimeForCalendar(appointment.start_at).getTime() - 60000);

    const end = new Date(parseDateTimeForCalendar(appointment.end_at).getTime() + 60000);

    const events = calendar.getEvents(start, end);

    for (let i = 0; i < events.length; i++) {
      if (String(events[i].getId()) === String(calendarEventId)) {
        return events[i];
      }
    }

    return null;
  } catch (error) {
    addAuditLog(
      'GET_CALENDAR_EVENT_BY_APPOINTMENT_ERROR',
      JSON.stringify({
        appointment_id: appointment.appointment_id,
        provider_id: appointment.provider_id,
        calendar_id: calendarId,
        calendar_event_id: calendarEventId,
        error: String(error)
      })
    );

    return null;
  }
}
