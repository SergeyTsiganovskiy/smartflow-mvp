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

  const providerName =
    provider ? provider.name : appointment.provider_id;

  const title =
    '[' +
    providerName +
    '] ' +
    (service ? service.name : appointment.service_id) +
    ' — ' +
    (customer ? customer.name : appointment.customer_id);

  const customerNote =
    String(appointment.customer_note || '').trim() || '-';

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

    const description =
      visibleDescription +
      '\n\n[TECH]\n' +
      'appointment_id=' +
      appointment.appointment_id;

  const start = parseDateTimeForCalendar(appointment.start_at);
  const end = parseDateTimeForCalendar(appointment.end_at);

  const event = calendar.createEvent(
    title,
    start,
    end,
    {
      description: description
    }
  );

  updateAppointmentCalendarEventId(
    appointmentId,
    event.getId()
  );

  return event.getId();
}

function deleteCalendarEvent(appointment) {
  if (
    !appointment ||
    !appointment.calendar_event_id
  ) {
    return;
  }

  try {
    const calendar = CalendarApp.getDefaultCalendar();

    const event = calendar.getEventById(
      appointment.calendar_event_id
    );

    if (event) {
      event.deleteEvent();
    }
  } catch (error) {
    addAuditLog(
      'DELETE_CALENDAR_EVENT_ERROR',
      error.toString()
    );
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
    return '';
  }

  const start = parseDateTimeForCalendar(appointment.start_at);
  const end = parseDateTimeForCalendar(appointment.end_at);

  event.setTime(start, end);

  return event.getId();
}

function deleteCalendarEventById(calendarEventId) {
  const calendar = CalendarApp.getDefaultCalendar();

  const event = calendar.getEventById(calendarEventId);

  if (event) {
    event.deleteEvent();
    return true;
  }

  return false;
}

function getCalendarEventById(calendarEventId) {
  const settings = getSettings();

  const calendarId =
    settings.DefaultCalendarId || '';

  const calendar = calendarId
    ? CalendarApp.getCalendarById(calendarId)
    : CalendarApp.getDefaultCalendar();

  if (!calendar) {
    return null;
  }

  const event =
    calendar.getEventById(calendarEventId);

  if (!event) {
    return null;
  }

  return {
    calendar_event_id: event.getId(),
    title: event.getTitle(),
    description: event.getDescription() || '',
    start_at: event.getStartTime(),
    end_at: event.getEndTime()
  };
}

function updateCalendarEventDateTimeById(calendarEventId, startAt) {
  addAuditLog(
    'UPDATE_CALENDAR_EVENT_START',
    calendarEventId + ' / ' + startAt
  );

  const calendar = CalendarApp.getDefaultCalendar();

  const event = calendar.getEventById(calendarEventId);

  if (!event) {
    addAuditLog(
      'UPDATE_CALENDAR_EVENT_NOT_FOUND',
      calendarEventId
    );
    return false;
  }

  const oldStart = event.getStartTime();
  const oldEnd = event.getEndTime();

  const durationMs =
    oldEnd.getTime() - oldStart.getTime();

  const newStart =
    parseDateTimeForCalendar(startAt);

  const newEnd =
    new Date(newStart.getTime() + durationMs);

  event.setTime(newStart, newEnd);

  addAuditLog(
    'UPDATE_CALENDAR_EVENT_DONE',
    newStart + ' / ' + newEnd
  );

  return true;
}

function getCalendarEventByAppointment(appointment) {
  const calendarEventId =
    String(appointment.calendar_event_id || '').trim();

  if (!calendarEventId) {
    return null;
  }

  const calendarId =
    getProviderCalendarId(appointment.provider_id);

  if (!calendarId) {
    return null;
  }

  const calendar =
    CalendarApp.getCalendarById(calendarId);

  if (!calendar) {
    return null;
  }

  try {
    const start =
      new Date(
        parseDateTimeForCalendar(
          appointment.start_at
        ).getTime() - 60000
      );

    const end =
      new Date(
        parseDateTimeForCalendar(
          appointment.end_at
        ).getTime() + 60000
      );

    const events =
      calendar.getEvents(
        start,
        end
      );

    for (let i = 0; i < events.length; i++) {
      if (
        String(events[i].getId()) ===
        String(calendarEventId)
      ) {
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
