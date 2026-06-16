function getCalendarBusyIntervals(providerId, dateValue) {
  const calendarId = getProviderCalendarId(providerId);

  if (!calendarId) {
    return [];
  }

  const normalizedDate = normalizeDateForStorage(dateValue);
  const timezone = getSettings().TimeZone || 'Europe/Kyiv';

  const start = new Date(normalizedDate + 'T00:00:00');
  const end = new Date(normalizedDate + 'T23:59:59');

  const calendar = CalendarApp.getCalendarById(calendarId);

  if (!calendar) {
    return [];
  }

  const events = calendar.getEvents(start, end);

  return events.map(event => {
    return {
      startTime: Utilities.formatDate(event.getStartTime(), timezone, 'HH:mm'),
      endTime: Utilities.formatDate(event.getEndTime(), timezone, 'HH:mm')
    };
  });
}

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

  const title =
    (service ? service.name : appointment.service_id) +
    ' — ' +
    (customer ? customer.name : appointment.customer_id);

  const description =
    'Customer: ' + (customer ? customer.name : '') + '\n' +
    'Phone: ' + (customer ? customer.phone : '') + '\n' +
    'Provider: ' + (provider ? provider.name : '') + '\n' +
    'Location: ' + (location ? location.name : '');

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

function getCalendarAppointmentsByPhone(phone) {
  const settings = getSettings();
  const calendarId = 'primary';

  const calendar = CalendarApp.getCalendarById(calendarId);

  if (!calendar) {
    return [];
  }

  const phoneKey = getPhoneSearchKey(phone);
  const knownEventIds = getAllAppointmentCalendarEventIds();

  const now = new Date();
  const future = new Date();

  future.setDate(future.getDate() + 60);

  const events = calendar.getEvents(now, future);

  const result = [];

  events.forEach(function(event) {
    if (knownEventIds.indexOf(event.getId()) !== -1) {
      return;
    }
    const description = event.getDescription() || '';
    const title = event.getTitle() || '';

    const eventPhone = extractPhoneFromText(description + '\n' + title);

    if (!eventPhone) {
      return;
    }

    if (getPhoneSearchKey(eventPhone) !== phoneKey) {
      return;
    }

    result.push({
      source: 'calendar',
      title: title,
      description: description,
      start_at: event.getStartTime(),
      end_at: event.getEndTime(),
      calendar_event_id: event.getId()
    });
  });

  return result;
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
