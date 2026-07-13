function processScheduleDay(chatId, text, settings) {
  const weekDays = getWeekDays();

  const selectedDay = weekDays.find(function (day) {
    const dayName = String(getMessage(day.message_key) || '').trim();

    return dayName === String(text || '').trim();
  });

  if (!selectedDay) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SELECT_SCHEDULE_DAY),
      buildScheduleDaysKeyboard()
    );

    return;
  }

  setUserSessionValue(chatId, 'schedule_day_code', selectedDay.day_code);

  showScheduleDayActions(chatId, settings);
}

function showScheduleDayActions(chatId, settings) {
  const keyboard = buildKeyboardWithMainMenu([
    [
      {
        text: getMessage(MESSAGE_KEYS.SCHEDULE_ACTION_START)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.SCHEDULE_ACTION_END)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.SCHEDULE_ACTION_DAY_OFF)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.SCHEDULE_ACTION_WORKING)
      }
    ]
  ]);

  setUserState(chatId, ADMIN_STATES.WAITING_SCHEDULE_ACTION);

  sendTelegramMessage(settings.AdminBotToken, chatId, getMessage(MESSAGE_KEYS.SELECT_ACTION), keyboard);
}

function processScheduleAction(chatId, text, settings) {
  const session = getUserSession(chatId);

  const providerId = session.schedule_provider_id;

  const dayCode = session.schedule_day_code;

  if (!providerId || !dayCode) {
    setUserState(chatId, ADMIN_STATES.WAITING_PROVIDER_FOR_SCHEDULE);

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SELECT_PROVIDER_FOR_SCHEDULE),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setPreviousMenu(chatId, 'PROVIDERS_MENU');

  if (text === getMessage(MESSAGE_KEYS.SCHEDULE_ACTION_DAY_OFF)) {
    updateProviderScheduleField(providerId, dayCode, 'is_working', false);

    sendTelegramMessage(settings.AdminBotToken, chatId, getMessage(MESSAGE_KEYS.SCHEDULE_UPDATED));

    showProviderScheduleAdmin(chatId, providerId, settings);

    return;
  }

  if (text === getMessage(MESSAGE_KEYS.SCHEDULE_ACTION_WORKING)) {
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

    const startTime = formatScheduleTime(currentSchedule.start_time) || settings.DefaultWorkStartTime || '09:00';

    const endTime = formatScheduleTime(currentSchedule.end_time) || settings.DefaultWorkEndTime || '20:00';

    updateProviderScheduleField(providerId, dayCode, 'start_time', startTime);

    updateProviderScheduleField(providerId, dayCode, 'end_time', endTime);

    updateProviderScheduleField(providerId, dayCode, 'is_working', true);

    sendTelegramMessage(settings.AdminBotToken, chatId, getMessage(MESSAGE_KEYS.SCHEDULE_UPDATED));

    showProviderScheduleAdmin(chatId, providerId, settings);

    return;
  }

  if (text === getMessage(MESSAGE_KEYS.SCHEDULE_ACTION_START)) {
    setPreviousMenu(chatId, 'SCHEDULE_DAYS');

    setUserState(chatId, ADMIN_STATES.WAITING_SCHEDULE_START_TIME);

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.ENTER_NEW_VALUE),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  if (text === getMessage(MESSAGE_KEYS.SCHEDULE_ACTION_END)) {
    setPreviousMenu(chatId, 'SCHEDULE_DAYS');

    setUserState(chatId, ADMIN_STATES.WAITING_SCHEDULE_END_TIME);

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.ENTER_NEW_VALUE),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserState(chatId, ADMIN_STATES.WAITING_SCHEDULE_DAY);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_ACTION),
    buildScheduleDaysKeyboard()
  );
}
