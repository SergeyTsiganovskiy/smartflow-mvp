function handleAppointmentCallback(callbackQuery) {
  const settings = getSettings();

  const data = callbackQuery.data;
  const adminChatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;

  const parts = data.split('|');
  const action = parts[0];
  const requestId = parts[1] || '';

  if (action === 'cancel_appointment') {
    const appointmentId = requestId;

    editTelegramMessageWithInlineKeyboard(
      settings.ClientBotToken,
      adminChatId,
      messageId,
      getMessage(MESSAGE_KEYS.CONFIRM_APPOINTMENT_CANCEL),

      buildConfirmInlineKeyboard('confirm_cancel|' + appointmentId, 'back_to_appointment|' + appointmentId)
    );

    return;
  }

  if (action === 'confirm_cancel') {
    const appointmentId = requestId;
    const appointment = getAppointmentById(appointmentId);

    if (!appointment) {
      editTelegramMessage(settings.ClientBotToken, adminChatId, messageId, getMessage(MESSAGE_KEYS.UNKNOWN_COMMAND));
      return;
    }

    updateAppointmentStatus(appointmentId, 'cancelled');
    deleteCalendarEvent(appointment);
    notifyAdminsAboutCancellation(appointment);

    editTelegramMessage(
      settings.ClientBotToken,
      adminChatId,
      messageId,
      getMessage(MESSAGE_KEYS.APPOINTMENT_CANCELLED)
    );

    const service = findServiceById(appointment.service_id);
    const provider = findProviderById(appointment.provider_id);
    const location = findLocationById(appointment.location_id);

    sendAppointmentCard(adminChatId, settings, appointment, service, provider, location, '', false);

    return;
  }

  if (action === 'back_to_appointment') {
    const appointmentId = requestId;
    const appointment = getAppointmentById(appointmentId);

    if (!appointment) {
      editTelegramMessage(settings.ClientBotToken, adminChatId, messageId, getMessage(MESSAGE_KEYS.UNKNOWN_COMMAND));

      return;
    }

    const service = findServiceById(appointment.service_id);
    const provider = findProviderById(appointment.provider_id);
    const location = findLocationById(appointment.location_id);

    const text =
      formatDateTimeForDisplay(appointment.start_at) +
      '\n\n' +
      '💅 ' +
      (service ? service.name : appointment.service_id) +
      '\n' +
      '👩‍💼 ' +
      (provider ? provider.name : appointment.provider_id) +
      '\n' +
      '📍 ' +
      (location ? location.name : appointment.location_id);

    editTelegramMessageWithInlineKeyboard(settings.ClientBotToken, adminChatId, messageId, text, [
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
    ]);

    return;
  }

  if (action === 'reschedule_appointment') {
    const appointmentId = requestId;

    editTelegramMessageWithInlineKeyboard(
      settings.ClientBotToken,
      adminChatId,
      messageId,
      getMessage(MESSAGE_KEYS.CONFIRM_APPOINTMENT_RESCHEDULE),

      buildConfirmInlineKeyboard('confirm_reschedule|' + appointmentId, 'back_to_appointment|' + appointmentId)
    );

    return;
  }

  if (action === 'confirm_reschedule') {
    const appointmentId = requestId;

    setUserSessionValue(adminChatId, 'reschedule_appointment_id', appointmentId);

    editTelegramMessage(
      settings.ClientBotToken,
      adminChatId,
      messageId,
      getMessage(MESSAGE_KEYS.SELECT_RESCHEDULE_DATE)
    );

    showRescheduleDateOptions(adminChatId, settings);

    return;
  }
}

function buildConfirmInlineKeyboard(confirmCallback, backCallback) {
  return [
    [
      {
        text: getMessage(MESSAGE_KEYS.CONFIRM_YES),
        callback_data: confirmCallback
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.CONFIRM_NO),
        callback_data: backCallback
      }
    ]
  ];
}
