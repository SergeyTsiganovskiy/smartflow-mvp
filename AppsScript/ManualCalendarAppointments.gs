function getManualCalendarAppointmentsByDate(dateValue) {
  const providers = getProviders();
  const result = [];

  providers.forEach(function (provider) {
    const providerId = provider.id || provider.provider_id;

    if (!providerId) {
      return;
    }

    const manualSlots = getManualCalendarBusySlotsForProvider(providerId, dateValue);

    manualSlots.forEach(function (slot) {
      result.push({
        source: slot.source || 'calendar_manual',

        appointment_id: slot.appointment_id || '',
        request_id: slot.request_id || '',

        customer_id: slot.customer_id || '',
        customer_name: slot.customer_name || '',
        phone: slot.phone || '',

        service_id: slot.service_id || '',
        service_name: slot.service_name || '',

        provider_id: slot.provider_id || providerId,
        provider_name: slot.provider_name || provider.name || '',

        location_id: slot.location_id || provider.location_id || '',

        start_at: slot.start_at,
        end_at: slot.end_at,
        startTime: slot.startTime || '',
        endTime: slot.endTime || '',

        status: slot.status || 'confirmed',
        calendar_event_id: slot.calendar_event_id || '',

        title: slot.title || '',
        description: slot.description || ''
      });
    });
  });

  return result;
}

function getManualCalendarAppointmentsByDateOptimized(dateValue) {
  const providers = getProviders();
  const calendars = {};
  const result = [];

  const dateString = normalizeDateForStorage(dateValue);

  const dayStart = new Date(dateString + 'T00:00:00');

  const dayEnd = new Date(dateString + 'T23:59:59');

  providers.forEach(function (provider) {
    const providerId = provider.id || provider.provider_id;

    if (!providerId) {
      return;
    }

    const calendarId = getProviderCalendarId(providerId);

    if (!calendarId) {
      return;
    }

    if (!calendars[calendarId]) {
      calendars[calendarId] = [];
    }

    const providerName = getProviderName(provider);

    calendars[calendarId].push({
      provider_id: providerId,
      provider_name: providerName,
      location_id: provider.location_id
    });
  });

  const knownEventIds = getAllAppointmentCalendarEventIds();

  Object.keys(calendars).forEach(function (calendarId) {
    const calendar = CalendarApp.getCalendarById(calendarId);

    if (!calendar) {
      return;
    }

    const events = calendar.getEvents(dayStart, dayEnd);

    events.forEach(function (event) {
      const eventId = event.getId();

      if (knownEventIds.indexOf(eventId) !== -1) {
        return;
      }

      const title = event.getTitle() || '';

      const description = event.getDescription() || '';

      const fullText = title + '\n' + description;

      const providerNameFromEvent = extractValueByLabel(
        fullText,
        getMessageValues(MESSAGE_KEYS.CALENDAR_LABEL_PROVIDER)
      );

      const matchedProvider = calendars[calendarId].find(function (provider) {
        return normalizeTextForSearch(provider.provider_name) === normalizeTextForSearch(providerNameFromEvent);
      });

      if (!matchedProvider) {
        return;
      }

      const phone =
        extractValueByLabel(fullText, getMessageValues(MESSAGE_KEYS.CALENDAR_LABEL_PHONE)) ||
        extractPhoneFromText(fullText);

      const customerName = extractValueByLabel(fullText, getMessageValues(MESSAGE_KEYS.CALENDAR_LABEL_CUSTOMER));

      const serviceName = extractValueByLabel(fullText, getMessageValues(MESSAGE_KEYS.CALENDAR_LABEL_SERVICE));

      const locationName = extractValueByLabel(fullText, getMessageValues(MESSAGE_KEYS.CALENDAR_LABEL_LOCATION));

      const commentText = extractValueByLabel(fullText, getMessageValues(MESSAGE_KEYS.CALENDAR_LABEL_COMMENT));

      if (!phone) {
        return;
      }

      result.push({
        source: 'calendar_manual',
        appointment_id: '',
        request_id: '',
        customer_id: '',
        customer_name: customerName,
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

function getManualCalendarBusySlotsForProvider(providerId, dateValue) {
  const appointments = getManualCalendarAppointmentsByDateOptimized(dateValue);

  const result = [];

  appointments.forEach(function (appointment) {
    if (String(appointment.provider_id) !== String(providerId)) {
      return;
    }

    result.push({
      startTime: appointment.startTime,

      endTime: appointment.endTime
    });
  });

  return result;
}
