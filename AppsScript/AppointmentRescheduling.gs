function showRescheduleDateOptions(chatId, settings) {
  setUserState(chatId, STATES.WAITING_RESCHEDULE_DATE);

  const keyboard = buildKeyboardWithMainMenu([
    [{ text: getMessage(MESSAGE_KEYS.TODAY) }, { text: getMessage(MESSAGE_KEYS.TOMORROW) }],
    [{ text: getMessage(MESSAGE_KEYS.DAY_AFTER_TOMORROW) }],
    [{ text: getMessage(MESSAGE_KEYS.OTHER_DATE) }]
  ]);

  sendTelegramMessage(settings.ClientBotToken, chatId, getMessage(MESSAGE_KEYS.SELECT_RESCHEDULE_DATE), keyboard);
}

function showRescheduleTimeOptions(chatId, settings) {
  const session = getUserSession(chatId);

  const appointment = getAppointmentById(session.reschedule_appointment_id);

  if (!appointment) {
    sendTelegramMessage(settings.ClientBotToken, chatId, getMessage(MESSAGE_KEYS.UNKNOWN_COMMAND));
    return;
  }

  const providerId = appointment.provider_id;
  const customerId = appointment.customer_id;

  const durationMinutes = getServiceDurationMinutes(appointment.customer_id, appointment.service_id);

  const slots = getAvailableTimeSlots(providerId, session.reschedule_date, durationMinutes, customerId);

  if (slots.length === 0) {
    sendTelegramMessage(settings.ClientBotToken, chatId, getMessage(MESSAGE_KEYS.NO_AVAILABLE_TIME));

    showRescheduleDateOptions(chatId, settings);
    return;
  }

  const keyboardRows = [];

  for (let i = 0; i < slots.length; i += 2) {
    const row = [{ text: slots[i] }];

    if (slots[i + 1]) {
      row.push({
        text: slots[i + 1]
      });
    }

    keyboardRows.push(row);
  }

  const keyboard = buildKeyboardWithMainMenu(keyboardRows);

  setUserState(chatId, STATES.WAITING_RESCHEDULE_TIME);

  sendTelegramMessage(settings.ClientBotToken, chatId, getMessage(MESSAGE_KEYS.SELECT_TIME), keyboard);
}

function showRescheduleCustomDateOptions(chatId, settings) {
  setUserState(chatId, STATES.WAITING_RESCHEDULE_CUSTOM_DATE);

  const keyboardRows = [];
  const today = new Date();

  const cacheDays = Number(settings.CalendarCacheDays || 30);

  for (let i = 0; i < cacheDays; i++) {
    const date = addDaysToDate(today, i);

    keyboardRows.push([
      {
        text: formatDateButton(date)
      }
    ]);
  }

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_DATE),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}
