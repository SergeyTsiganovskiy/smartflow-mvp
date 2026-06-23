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

function getCalendarAppointmentsByPhone(phone) {
  const phoneKey = getPhoneSearchKey(phone);
  const knownEventIds = getAllAppointmentCalendarEventIds();
  const providers = getProviders();
  const checkedCalendarIds = {};
  const result = [];

  addAuditLog(
    'MY_CALENDAR_APPOINTMENTS_START',
    JSON.stringify({
      phone: phone,
      phoneKey: phoneKey,
      providersCount: providers.length
    })
  );

  const now = new Date();
  const future = new Date();

  future.setDate(future.getDate() + 60);

  providers.forEach(function(provider) {
    const providerId =
      provider.id ||
      provider.provider_id;

    if (!providerId) {
      addAuditLog(
        'MY_CALENDAR_PROVIDER_SKIP_NO_ID',
        JSON.stringify(provider)
      );

      return;
    }

    const calendarId =
      getProviderCalendarId(providerId);

    addAuditLog(
      'MY_CALENDAR_PROVIDER_CHECK',
      JSON.stringify({
        providerId: providerId,
        providerName: provider.name,
        calendarId: calendarId
      })
    );

    if (!calendarId) {
      return;
    }

    if (checkedCalendarIds[calendarId]) {
      addAuditLog(
        'MY_CALENDAR_SKIP_DUPLICATE_CALENDAR',
        JSON.stringify({
          providerId: providerId,
          calendarId: calendarId
        })
      );

      return;
    }

    checkedCalendarIds[calendarId] = true;

    const calendar =
      CalendarApp.getCalendarById(calendarId);

    if (!calendar) {
      addAuditLog(
        'MY_CALENDAR_NOT_FOUND',
        JSON.stringify({
          calendarId: calendarId
        })
      );

      return;
    }

    const events =
      calendar.getEvents(now, future);

    addAuditLog(
      'MY_CALENDAR_EVENTS_FOUND',
      JSON.stringify({
        calendarId: calendarId,
        count: events.length
      })
    );

    events.forEach(function(event) {
      const eventId =
        event.getId();

      const title =
        event.getTitle() || '';

      const description =
        event.getDescription() || '';

      const fullText =
        title + '\n' + description;

      if (knownEventIds.indexOf(eventId) !== -1) {
        addAuditLog(
          'MY_CALENDAR_EVENT_SKIP_KNOWN',
          JSON.stringify({
            eventId: eventId,
            title: title
          })
        );

        return;
      }

      const eventPhone =
        extractValueByLabel(
          fullText,
          getMessageValues(MESSAGE_KEYS.CALENDAR_LABEL_PHONE)
        ) ||
        extractPhoneFromText(fullText);

      const serviceName =
        extractValueByLabel(
          fullText,
          getMessageValues(MESSAGE_KEYS.CALENDAR_LABEL_SERVICE)
        );

      const providerName =
        extractValueByLabel(
          fullText,
          getMessageValues(MESSAGE_KEYS.CALENDAR_LABEL_PROVIDER)
        );

      const locationName =
        extractValueByLabel(
          fullText,
          getMessageValues(MESSAGE_KEYS.CALENDAR_LABEL_LOCATION)
        );

      const commentText =
        extractValueByLabel(
          fullText,
          getMessageValues(MESSAGE_KEYS.CALENDAR_LABEL_COMMENT)
        );

      addAuditLog(
        'MY_CALENDAR_EVENT_PARSE',
        JSON.stringify({
          title: title,
          description: description,
          eventPhone: eventPhone,
          eventPhoneKey: getPhoneSearchKey(eventPhone),
          targetPhoneKey: phoneKey,
          serviceName: serviceName,
          providerName: providerName
        })
      );

      if (!eventPhone) {
        return;
      }

      if (getPhoneSearchKey(eventPhone) !== phoneKey) {
        return;
      }

      result.push({
        source: 'calendar_manual',
        title: title,
        description: description,
        start_at: event.getStartTime(),
        end_at: event.getEndTime(),
        calendar_event_id: eventId,
        phone: eventPhone,
        service_name: serviceName,
        provider_name: providerName,
        location_name: locationName,
        customer_note: commentText,
      });
    });
  });

  result.sort(function(a, b) {
    return new Date(a.start_at) - new Date(b.start_at);
  });

  addAuditLog(
    'MY_CALENDAR_APPOINTMENTS_RESULT',
    JSON.stringify({
      count: result.length,
      result: result
    })
  );

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

function syncAppointmentWithCalendar(
  appointment,
  resetReminderIfChanged
) {
  if (!appointment || !appointment.calendar_event_id) {
    return appointment;
  }

  const calendarId = getProviderCalendarId(
    appointment.provider_id
  );

  if (!calendarId) {
    return appointment;
  }

  const calendar = CalendarApp.getCalendarById(calendarId);

  if (!calendar) {
    return appointment;
  }

  const event = calendar.getEventById(
    appointment.calendar_event_id
  );

  if (!event) {
    return appointment;
  }

  const timezone =
    getSettings().TimeZone || 'Europe/Kyiv';

  const calendarStartAt = Utilities.formatDate(
    event.getStartTime(),
    timezone,
    'yyyy-MM-dd HH:mm'
  );

  const calendarEndAt = Utilities.formatDate(
    event.getEndTime(),
    timezone,
    'yyyy-MM-dd HH:mm'
  );

  const currentStartAt =
    formatDateTimeForStorage(
      appointment.start_at
    );

  const currentEndAt =
    formatDateTimeForStorage(
      appointment.end_at
    );

  const changed =
    currentStartAt !== calendarStartAt ||
    currentEndAt !== calendarEndAt;

  if (!changed) {
    return appointment;
  }

  updateAppointmentDateTime(
    appointment.appointment_id,
    calendarStartAt,
    calendarEndAt
  );

  if (resetReminderIfChanged) {
    updateAppointmentField(
      appointment.appointment_id,
      'reminder_24h_sent_at',
      ''
    );
  }

  appointment.start_at = calendarStartAt;
  appointment.end_at = calendarEndAt;

  return appointment;
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
    return calendar.getEventById(calendarEventId);
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

function calendarEventMatchesProvider(event, providerId) {
  const provider = findProviderById(providerId);

  if (!provider) {
    return false;
  }

  const fullText =
    String(event.getTitle() || '') +
    '\n' +
    String(event.getDescription() || '');

  const providerNameFromEvent =
    extractValueByLabel(
      fullText,
      getMessageValues(MESSAGE_KEYS.CALENDAR_LABEL_PROVIDER)
    );

  return (
    normalizeTextForSearch(providerNameFromEvent) ===
    normalizeTextForSearch(provider.name)
  );
}

function getManualCalendarBusySlotsForProvider(providerId, dateValue) {
  const provider = findProviderById(providerId);

  if (!provider) {
    return [];
  }

  const calendarId = getProviderCalendarId(providerId);

  if (!calendarId) {
    return [];
  }

  const calendar = CalendarApp.getCalendarById(calendarId);

  if (!calendar) {
    return [];
  }

  const dateString = normalizeDateForStorage(dateValue);

  const dayStart = new Date(dateString + 'T00:00:00');
  const dayEnd = new Date(dateString + 'T23:59:59');

  const knownEventIds = getAllAppointmentCalendarEventIds();
  const events = calendar.getEvents(dayStart, dayEnd);

  const result = [];

  events.forEach(function(event) {
    const eventId = event.getId();

    if (knownEventIds.indexOf(eventId) !== -1) {
      return;
    }

    const title = event.getTitle() || '';
    const description = event.getDescription() || '';
    const fullText = title + '\n' + description;

    addAuditLog(
  'MANUAL_EVENT_PARSE_DEBUG',
  JSON.stringify({
    title: title,
    description: description,
    phoneLabels: getMessageValues(MESSAGE_KEYS.CALENDAR_LABEL_PHONE),
    serviceLabels: getMessageValues(MESSAGE_KEYS.CALENDAR_LABEL_SERVICE),
    providerLabels: getMessageValues(MESSAGE_KEYS.CALENDAR_LABEL_PROVIDER),
    phone: extractValueByLabel(
      fullText,
      getMessageValues(MESSAGE_KEYS.CALENDAR_LABEL_PHONE)
    ),
    service: extractValueByLabel(
      fullText,
      getMessageValues(MESSAGE_KEYS.CALENDAR_LABEL_SERVICE)
    ),
    provider: extractValueByLabel(
      fullText,
      getMessageValues(MESSAGE_KEYS.CALENDAR_LABEL_PROVIDER)
    )
  })
);

    const appointmentId =
      extractAppointmentIdFromText(fullText);

    if (appointmentId) {
      const appointment =
        getAppointmentById(appointmentId);

      if (!appointment) {
        return;
      }

      if (String(appointment.provider_id) !== String(providerId)) {
        return;
      }

      const customer =
        getCustomerById(appointment.customer_id);

      const service =
        findServiceById(appointment.service_id);

      result.push({
        source: 'calendar_bot',
        appointment_id: appointment.appointment_id,
        request_id: appointment.request_id,
        customer_id: appointment.customer_id,
        service_id: appointment.service_id,
        provider_id: appointment.provider_id,
        location_id: appointment.location_id,
        start_at: event.getStartTime(),
        end_at: event.getEndTime(),
        startTime: extractTimeFromDateTime(event.getStartTime()),
        endTime: extractTimeFromDateTime(event.getEndTime()),
        status: appointment.status,
        calendar_event_id: eventId,
        phone: customer ? customer.phone : '',
        customer_name: customer ? customer.name : '',
        service_name: service ? service.name : '',
        provider_name: provider.name,
        title: title,
        description: description
      });

      return;
    }

    if (!calendarEventMatchesProvider(event, providerId)) {
      return;
    }

    const phone =
      extractValueByLabel(
        fullText,
        getMessageValues(MESSAGE_KEYS.CALENDAR_LABEL_PHONE)
      );

    const serviceName =
      extractValueByLabel(
        fullText,
        getMessageValues(MESSAGE_KEYS.CALENDAR_LABEL_SERVICE)
      );

    result.push({
      source: 'calendar_manual',
      appointment_id: '',
      request_id: '',
      customer_id: '',
      service_id: '',
      provider_id: providerId,
      location_id: provider.location_id,
      start_at: event.getStartTime(),
      end_at: event.getEndTime(),
      startTime: extractTimeFromDateTime(event.getStartTime()),
      endTime: extractTimeFromDateTime(event.getEndTime()),
      status: 'confirmed',
      calendar_event_id: eventId,
      phone: phone,
      customer_name: '',
      service_name: serviceName,
      provider_name: provider.name,
      title: title,
      description: description
    });
  });

  return result;
}

function getManualCalendarAppointmentsByDateOptimized(dateValue) {
  const providers = getProviders();
  const calendars = {};
  const result = [];

  const dateString =
    normalizeDateForStorage(dateValue);

  const dayStart =
    new Date(dateString + 'T00:00:00');

  const dayEnd =
    new Date(dateString + 'T23:59:59');

  providers.forEach(function(provider) {
    const providerId =
      provider.id ||
      provider.provider_id;

    if (!providerId) {
      return;
    }

    const calendarId =
      getProviderCalendarId(providerId);

    if (!calendarId) {
      return;
    }

    if (!calendars[calendarId]) {
      calendars[calendarId] = [];
    }

    calendars[calendarId].push({
      provider_id: providerId,
      provider_name: provider.name,
      location_id: provider.location_id
    });
  });

  const knownEventIds =
    getAllAppointmentCalendarEventIds();

  Object.keys(calendars).forEach(function(calendarId) {
    const calendar =
      CalendarApp.getCalendarById(calendarId);

    if (!calendar) {
      return;
    }

    const events =
      calendar.getEvents(dayStart, dayEnd);

    events.forEach(function(event) {
      const eventId =
        event.getId();

      if (knownEventIds.indexOf(eventId) !== -1) {
        return;
      }

      const title =
        event.getTitle() || '';

      const description =
        event.getDescription() || '';

      const fullText =
        title + '\n' + description;

      const providerNameFromEvent =
        extractValueByLabel(
          fullText,
          getMessageValues(
            MESSAGE_KEYS.CALENDAR_LABEL_PROVIDER
          )
        );

      const matchedProvider =
        calendars[calendarId].find(function(provider) {
          return (
            normalizeTextForSearch(provider.provider_name) ===
            normalizeTextForSearch(providerNameFromEvent)
          );
        });

      if (!matchedProvider) {
        return;
      }

      const phone =
        extractValueByLabel(
          fullText,
          getMessageValues(
            MESSAGE_KEYS.CALENDAR_LABEL_PHONE
          )
        ) ||
        extractPhoneFromText(fullText);

      const serviceName =
        extractValueByLabel(
          fullText,
          getMessageValues(
            MESSAGE_KEYS.CALENDAR_LABEL_SERVICE
          )
        );

      const locationName =
        extractValueByLabel(
          fullText,
          getMessageValues(
            MESSAGE_KEYS.CALENDAR_LABEL_LOCATION
          )
        );

      const commentText =
        extractValueByLabel(
          fullText,
          getMessageValues(
            MESSAGE_KEYS.CALENDAR_LABEL_COMMENT
          )
        );

      result.push({
        source: 'calendar_manual',
        appointment_id: '',
        request_id: '',
        customer_id: '',
        customer_name: '',
        phone: phone,
        service_id: '',
        service_name: serviceName || title,
        provider_id: matchedProvider.provider_id,
        provider_name: matchedProvider.provider_name,
        location_id: matchedProvider.location_id || '',
        location_name: locationName,
        start_at: event.getStartTime(),
        end_at: event.getEndTime(),
        startTime: extractTimeFromDateTime(event.getStartTime()),
        endTime: extractTimeFromDateTime(event.getEndTime()),
        status: 'confirmed',
        calendar_event_id: eventId,
        title: title,
        description: description,
        customer_note: commentText
      });
    });
  });

  return result;
}
