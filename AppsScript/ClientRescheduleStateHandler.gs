function handleClientRescheduleState(chatId, text, state, settings) {
  if (state === STATES.WAITING_RESCHEDULE_CUSTOM_DATE) {
    addAuditLog('RESCHEDULE_CUSTOM_DATE_BLOCK', text);

    const selectedDate = parseCustomDateButton(text);

    addAuditLog('RESCHEDULE_CUSTOM_DATE_PARSED', selectedDate);

    if (!selectedDate) {
      showRescheduleCustomDateOptions(chatId, settings);
      return;
    }

    setUserSessionValue(chatId, 'reschedule_date', selectedDate);

    showRescheduleTimeOptions(chatId, settings);
    return;
  }

  if (state === STATES.WAITING_RESCHEDULE_DATE) {
    const messageKey = getMessageKeyByText(text);

    if (messageKey === MESSAGE_KEYS.OTHER_DATE) {
      showRescheduleCustomDateOptions(chatId, settings);
      return;
    }

    const selectedDate = getRelativeDateByMessageKey(messageKey);

    if (!selectedDate) {
      sendTelegramMessage(settings.ClientBotToken, chatId, getMessage(MESSAGE_KEYS.DATE_SELECT_FROM_LIST));
      return;
    }

    setUserSessionValue(chatId, 'reschedule_date', selectedDate);

    showRescheduleTimeOptions(chatId, settings);
    return;
  }

  if (state === STATES.WAITING_RESCHEDULE_TIME) {
    const selectedTime = text.trim();

    addAuditLog('RESCHEDULE_TIME_SELECTED', selectedTime);

    if (!isValidTimeOption(selectedTime)) {
      sendTelegramMessage(settings.ClientBotToken, chatId, getMessage(MESSAGE_KEYS.TIME_SELECT_FROM_LIST));
      return;
    }

    const session = getUserSession(chatId);

    addAuditLog('RESCHEDULE_TIME_SESSION_CHECK', JSON.stringify(session));

    const startAt = buildDateTime(session.reschedule_date, selectedTime);

    const appointment = getAppointmentById(session.reschedule_appointment_id);

    addAuditLog('RESCHEDULE_APPOINTMENT', JSON.stringify(appointment));

    if (!appointment) {
      sendTelegramMessage(settings.ClientBotToken, chatId, getMessage(MESSAGE_KEYS.UNKNOWN_COMMAND));
      return;
    }

    const duration = getServiceDurationMinutes(appointment.customer_id, appointment.service_id);

    const endAt = addMinutesToDateTime(startAt, duration);

    const oldStartAt = appointment.start_at;
    const oldEndAt = appointment.end_at;

    updateAppointmentDateTime(appointment.appointment_id, startAt, endAt);

    let calendarEventId = '';

    try {
      calendarEventId = updateCalendarEventForAppointment(appointment.appointment_id);
    } catch (error) {
      addAuditLog(
        'RESCHEDULE_CALENDAR_ERROR',
        JSON.stringify({ appointment_id: appointment.appointment_id, error: String(error) })
      );
    }

    if (!calendarEventId) {
      restoreAppointmentAfterRescheduleCalendarFailure(appointment, oldStartAt, oldEndAt);
      sendTelegramMessage(
        settings.ClientBotToken,
        chatId,
        getMessage(MESSAGE_KEYS.APPOINTMENT_CALENDAR_ERROR),
        buildKeyboardWithMainMenu([])
      );
      return;
    }

    const updatedAppointment = getAppointmentById(appointment.appointment_id);

    notifyAdminsAboutReschedule(updatedAppointment, oldStartAt, oldEndAt);

    addAuditLog('RESCHEDULE_UPDATED', appointment.appointment_id);

    clearUserSession(chatId);
    setUserState(chatId, '');

    sendTelegramMessage(
      settings.ClientBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.APPOINTMENT_RESCHEDULED_CLIENT),
      buildKeyboardWithMainMenu([])
    );

    const service = findServiceById(updatedAppointment.service_id);
    const provider = findProviderById(updatedAppointment.provider_id);
    const location = findLocationById(updatedAppointment.location_id);

    sendAppointmentCard(chatId, settings, updatedAppointment, service, provider, location, '', false);

    return;
  }
}

function restoreAppointmentAfterRescheduleCalendarFailure(appointment, oldStartAt, oldEndAt) {
  updateAppointmentDateTime(appointment.appointment_id, oldStartAt, oldEndAt);

  [
    'reminder_24h_sent_at',
    'reminder_2h_sent_at',
    'customer_confirmed',
    'customer_confirmed_at'
  ].forEach(function (fieldName) {
    const value = appointment[fieldName];
    updateAppointmentField(appointment.appointment_id, fieldName, value === undefined || value === null ? '' : value);
  });
}
