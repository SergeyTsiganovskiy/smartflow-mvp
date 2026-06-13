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

