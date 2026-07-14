function createCalendarEventForAppointment(appointmentId) {
  const appointment = getAppointmentById(appointmentId);

  if (!appointment) {
    return '';
  }

  const calendarId = getProviderCalendarId(appointment.provider_id);

  if (!calendarId) {
    return '';
  }

  const calendar = CalendarApp.getCalendarById(calendarId);

  if (!calendar) {
    return '';
  }

  const customer = getCustomerById(appointment.customer_id);
  const service = findServiceById(appointment.service_id);
  const provider = findProviderById(appointment.provider_id);
  const location = findLocationById(appointment.location_id);

  const providerName = provider ? provider.name : appointment.provider_id;

  const title =
    '[' +
    providerName +
    '] ' +
    (service ? service.name : appointment.service_id) +
    ' — ' +
    (customer ? customer.name : appointment.customer_id);

  const customerNote = String(appointment.customer_note || '').trim() || '-';

  const visibleDescription =
    getMessage(MESSAGE_KEYS.CALENDAR_CUSTOMER) +
    ': ' +
    (customer ? customer.name : '') +
    '\n' +
    getMessage(MESSAGE_KEYS.CALENDAR_PHONE) +
    ': ' +
    (customer ? customer.phone : '') +
    '\n' +
    getMessage(MESSAGE_KEYS.CALENDAR_SERVICE) +
    ': ' +
    (service ? service.name : '') +
    '\n' +
    getMessage(MESSAGE_KEYS.CALENDAR_PROVIDER) +
    ': ' +
    (provider ? provider.name : '') +
    '\n' +
    getMessage(MESSAGE_KEYS.CALENDAR_LOCATION) +
    ': ' +
    (location ? location.name : '') +
    '\n' +
    getMessage(MESSAGE_KEYS.CALENDAR_NOTE) +
    ': ' +
    customerNote;

  const description = visibleDescription + '\n\n[TECH]\n' + 'appointment_id=' + appointment.appointment_id;

  const start = parseDateTimeForCalendar(appointment.start_at);
  const end = parseDateTimeForCalendar(appointment.end_at);

  const existingEvent = findCalendarEventByAppointmentId(calendar, appointment, start, end);

  if (existingEvent) {
    updateAppointmentCalendarEventId(appointmentId, existingEvent.getId());
    return existingEvent.getId();
  }

  const event = calendar.createEvent(title, start, end, {
    description: description
  });

  updateAppointmentCalendarEventId(appointmentId, event.getId());

  return event.getId();
}

function deleteCalendarEvent(appointment) {
  if (!appointment || !appointment.calendar_event_id) {
    return;
  }

  try {
    const calendarId = getProviderCalendarId(appointment.provider_id);
    const calendar = calendarId ? CalendarApp.getCalendarById(calendarId) : null;

    if (!calendar) {
      addAuditLog(
        'DELETE_CALENDAR_EVENT_ERROR',
        JSON.stringify({ appointment_id: appointment.appointment_id, error: 'CALENDAR_NOT_AVAILABLE' })
      );
      return false;
    }

    const event = calendar.getEventById(appointment.calendar_event_id);

    if (event) {
      event.deleteEvent();
    }

    return true;
  } catch (error) {
    addAuditLog('DELETE_CALENDAR_EVENT_ERROR', error.toString());
    return false;
  }
}

function updateCalendarEventForAppointment(appointmentId) {
  const appointment = getAppointmentById(appointmentId);

  if (!appointment || !appointment.calendar_event_id) {
    return '';
  }

  const calendarId = getProviderCalendarId(appointment.provider_id);

  if (!calendarId) {
    return '';
  }

  const calendar = CalendarApp.getCalendarById(calendarId);

  if (!calendar) {
    return '';
  }

  const event = calendar.getEventById(appointment.calendar_event_id);

  if (!event) {
    updateAppointmentCalendarEventId(appointmentId, '');
    return createCalendarEventForAppointment(appointmentId);
  }

  const start = parseDateTimeForCalendar(appointment.start_at);
  const end = parseDateTimeForCalendar(appointment.end_at);

  event.setTime(start, end);

  return event.getId();
}

function findCalendarEventByAppointmentId(calendar, appointment, start, end) {
  const searchStart = new Date(start.getTime() - 60000);
  const searchEnd = new Date(end.getTime() + 60000);
  const marker = 'appointment_id=' + appointment.appointment_id;
  const events = calendar.getEvents(searchStart, searchEnd);

  for (let i = 0; i < events.length; i++) {
    if (String(events[i].getDescription() || '').indexOf(marker) !== -1) {
      return events[i];
    }
  }

  return null;
}
