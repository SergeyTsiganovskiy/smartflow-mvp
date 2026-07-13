function processScheduleStartTime(chatId, text, settings) {
  updateScheduleTimeAndRefresh(chatId, text, settings, 'start_time');
}

function processScheduleEndTime(chatId, text, settings) {
  updateScheduleTimeAndRefresh(chatId, text, settings, 'end_time');
}

function updateScheduleTimeAndRefresh(chatId, text, settings, fieldName) {
  const session = getUserSession(chatId);

  const providerId = session.schedule_provider_id;

  const dayCode = session.schedule_day_code;

  const value = normalizeTimeValue(text);

  if (!isValidTimeValue(value)) {
    setUserState(chatId, ADMIN_STATES.WAITING_SCHEDULE_DAY);

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.INVALID_TIME_FORMAT),
      buildScheduleDaysKeyboard()
    );

    return;
  }

  const currentSchedule = getProviderScheduleDay(providerId, dayCode);

  if (!currentSchedule) {
    setUserState(chatId, ADMIN_STATES.WAITING_SCHEDULE_DAY);

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.EDIT_ERROR),
      buildScheduleDaysKeyboard()
    );

    return;
  }

  const currentStartTime = formatScheduleTime(currentSchedule.start_time);

  const currentEndTime = formatScheduleTime(currentSchedule.end_time);

  const nextStartTime = fieldName === 'start_time' ? value : currentStartTime;

  const nextEndTime = fieldName === 'end_time' ? value : currentEndTime;

  const startMinutes = timeValueToMinutes(nextStartTime);

  const endMinutes = timeValueToMinutes(nextEndTime);

  if (startMinutes === null || endMinutes === null || startMinutes >= endMinutes) {
    setUserState(chatId, ADMIN_STATES.WAITING_SCHEDULE_DAY);

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.INVALID_TIME_RANGE),
      buildScheduleDaysKeyboard()
    );

    return;
  }

  updateProviderScheduleField(providerId, dayCode, fieldName, value);

  updateProviderScheduleField(providerId, dayCode, 'is_working', true);

  sendTelegramMessage(settings.AdminBotToken, chatId, getMessage(MESSAGE_KEYS.SCHEDULE_UPDATED));

  showProviderScheduleAdmin(chatId, providerId, settings);
}

function returnToScheduleDays(chatId, settings) {
  const session = getUserSession(chatId);
  const providerId = session.schedule_provider_id;

  if (!providerId) {
    clearUserSession(chatId);
    setUserState(chatId, '');

    sendProvidersMenu(chatId, settings);
    return;
  }

  setPreviousMenu(chatId, 'PROVIDERS_MENU');

  showProviderScheduleAdmin(chatId, providerId, settings);
}
