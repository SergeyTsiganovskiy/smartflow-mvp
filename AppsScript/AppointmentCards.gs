function sendAppointmentCard(chatId, settings, appointment, service, provider, location, heading, showActions) {
  const customerNote = String(appointment.customer_note || '').trim() || '-';

  const text =
    (heading ? '<b>' + heading + '</b>\n\n' : '') +
    formatDateTimeForDisplay(appointment.start_at) +
    '\n\n' +
    '💅 ' +
    (service ? service.name : appointment.service_id) +
    '\n' +
    '👩‍💼 ' +
    (provider ? provider.name : appointment.provider_id) +
    '\n' +
    '📍 ' +
    (location ? location.name : appointment.location_id) +
    '\n' +
    '📝 ' +
    getMessage(MESSAGE_KEYS.CALENDAR_LABEL_COMMENT) +
    ': ' +
    customerNote;

  if (showActions === false) {
    sendTelegramMessage(settings.ClientBotToken, chatId, text);
    return;
  }

  const inlineKeyboard = [
    [
      {
        text: getMessage(MESSAGE_KEYS.RESCHEDULE_APPOINTMENT_BUTTON),
        callback_data: 'reschedule_appointment|' + appointment.appointment_id
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.CANCEL_APPOINTMENT_BUTTON),
        callback_data: 'cancel_appointment|' + appointment.appointment_id
      }
    ]
  ];

  sendTelegramMessageWithInlineKeyboard(settings.ClientBotToken, chatId, text, inlineKeyboard);
}

function sendCalendarAppointmentCard(chatId, settings, appointment) {
  const description = appointment.description || '';

  const appointmentId = extractCalendarTechValue(description, 'appointment_id');

  if (appointmentId) {
    const linkedAppointment = getAppointmentById(appointmentId);

    if (linkedAppointment && String(linkedAppointment.status || '').toLowerCase() === 'confirmed') {
      sendLinkedCalendarAppointmentCard(chatId, settings, appointment, appointmentId);

      return;
    }
  }

  sendManualCalendarAppointmentCard(chatId, settings, appointment);
}

function sendLinkedCalendarAppointmentCard(chatId, settings, appointment, appointmentId) {
  const linkedAppointment = getAppointmentById(appointmentId);

  if (!linkedAppointment) {
    return;
  }

  const service = findServiceById(linkedAppointment.service_id);

  const provider = findProviderById(linkedAppointment.provider_id);

  const location = findLocationById(linkedAppointment.location_id);

  const customerNote = String(linkedAppointment.customer_note || '').trim() || '-';

  const text =
    formatDateTimeForDisplay(appointment.start_at) +
    '\n\n' +
    '💅 ' +
    (service ? service.name : linkedAppointment.service_id) +
    '\n' +
    '👩‍💼 ' +
    (provider ? provider.name : linkedAppointment.provider_id) +
    '\n' +
    '📍 ' +
    (location ? location.name : linkedAppointment.location_id) +
    '\n' +
    '📝 ' +
    getMessage(MESSAGE_KEYS.CALENDAR_LABEL_COMMENT) +
    ': ' +
    customerNote;

  const inlineKeyboard = [
    [
      {
        text: getMessage(MESSAGE_KEYS.RESCHEDULE_APPOINTMENT_BUTTON),
        callback_data: 'reschedule_appointment|' + linkedAppointment.appointment_id
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.CANCEL_APPOINTMENT_BUTTON),
        callback_data: 'cancel_appointment|' + linkedAppointment.appointment_id
      }
    ]
  ];

  sendTelegramMessageWithInlineKeyboard(settings.ClientBotToken, chatId, text, inlineKeyboard);
}

function sendManualCalendarAppointmentCard(chatId, settings, appointment) {
  const text =
    formatDateTimeForDisplay(appointment.start_at) +
    '\n\n' +
    '💅 ' +
    (appointment.service_name || appointment.title || '-') +
    '\n' +
    '👩‍💼 ' +
    (appointment.provider_name || '-') +
    '\n' +
    '📍 ' +
    (appointment.location_name || '-') +
    '\n' +
    '📝 ' +
    (appointment.customer_note || '-') +
    '\n' +
    '📌 ' +
    getMessage(MESSAGE_KEYS.MANUAL_CALENDAR_APPOINTMENT_LABEL);

  sendTelegramMessage(settings.ClientBotToken, chatId, text);
}
