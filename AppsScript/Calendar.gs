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




function getCalendarAppointmentsByPhone(phone) {
  const phoneKey =
    getPhoneSearchKey(phone);

  const knownEventIds =
    getAllAppointmentCalendarEventIds();

  const providers =
    getProviders();

  const checkedCalendarIds = {};
  const result = [];

  const now =
    new Date();

  const future =
    new Date();

  const settings =
    getSettings();

  const cacheDays =
    Number(
      settings.CalendarCacheDays || 30
    );

  future.setDate(
    future.getDate() + cacheDays
  );

  providers.forEach(function(provider) {
    const providerId =
      provider.provider_id;

    if (!providerId) {
      return;
    }

    const calendarId =
      getProviderCalendarId(providerId);

    if (!calendarId) {
      return;
    }

    if (checkedCalendarIds[calendarId]) {
      return;
    }

    checkedCalendarIds[calendarId] = true;

    const calendar =
      CalendarApp.getCalendarById(calendarId);

    if (!calendar) {
      return;
    }

    const events =
      calendar.getEvents(
        now,
        future
      );

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

      const eventPhone =
        extractValueByLabel(
          fullText,
          getMessageValues(
            MESSAGE_KEYS.CALENDAR_LABEL_PHONE
          )
        ) ||
        extractPhoneFromText(fullText);

      if (!eventPhone) {
        return;
      }

      if (getPhoneSearchKey(eventPhone) !== phoneKey) {
        return;
      }

      const serviceName =
        extractValueByLabel(
          fullText,
          getMessageValues(
            MESSAGE_KEYS.CALENDAR_LABEL_SERVICE
          )
        );

      const providerName =
        extractValueByLabel(
          fullText,
          getMessageValues(
            MESSAGE_KEYS.CALENDAR_LABEL_PROVIDER
          )
        );

      const customerName =
        extractValueByLabel(
          fullText,
          getMessageValues(
            MESSAGE_KEYS.CALENDAR_LABEL_CUSTOMER
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
        title: title,
        description: description,
        start_at: event.getStartTime(),
        end_at: event.getEndTime(),
        calendar_event_id: eventId,
        phone: eventPhone,
        customer_name: customerName,
        service_name: serviceName,
        provider_name: providerName,
        location_name: locationName,
        customer_note: commentText
      });
    });
  });

  result.sort(function(a, b) {
    return new Date(a.start_at) - new Date(b.start_at);
  });

  return result;
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

