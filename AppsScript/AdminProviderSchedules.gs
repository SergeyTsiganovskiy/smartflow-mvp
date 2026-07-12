
function startProviderSchedule(chatId, settings) {

  setPreviousMenu(chatId, 'PROVIDERS_MENU');

  const providers = getProviders();
  const keyboardRows = [];

  providers.forEach(function(provider) {
    keyboardRows.push([
      {
        text: provider.name
      }
    ]);
  });

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_PROVIDER_FOR_SCHEDULE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_PROVIDER_FOR_SCHEDULE),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processProviderForSchedule(chatId, text, settings) {
  const provider = findProviderByName(text);

  if (!provider) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SELECT_PROVIDER_FROM_LIST),
      buildProvidersMenuKeyboard()
    );
    return;
  }

  setUserSessionValue(
    chatId,
    'schedule_provider_id',
    provider.id
  );

  showProviderScheduleAdmin(
    chatId,
    provider.id,
    settings
  );
}

function showProviderScheduleAdmin(
  chatId,
  providerId,
  settings
) {

  const provider =
    findProviderById(providerId);

  const schedule =
    getProviderSchedule(providerId);

  let text =
    '<b>' +
    getMessage(MESSAGE_KEYS.ADMIN_PROVIDER_SCHEDULE) +
    '</b>\n\n';

  text +=
    provider.name +
    '\n\n';

  schedule.forEach(function(item) {

    const day =
      getWeekDayByCode(
        item.day_of_week
      );

    const dayName =
      day
        ? getMessage(day.message_key)
        : item.day_of_week;

    text +=
      '<b>' +
      dayName +
      '</b> ';

    if (String(item.is_working).toUpperCase() === 'TRUE') {
      text +=
        formatScheduleTime(item.start_time) +
        '-' +
        formatScheduleTime(item.end_time) +
        '\n';
    } else {
      text +=
        getMessage(MESSAGE_KEYS.DAY_OFF) +
        '\n';
    }
  });

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_SCHEDULE_DAY
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    text,
    buildScheduleDaysKeyboard()
  );
}

function buildScheduleDaysKeyboard() {
  const weekDays = getWeekDays();
  const keyboardRows = [];

  weekDays.forEach(function(day) {
    keyboardRows.push([
      {
        text: getMessage(day.message_key)
      }
    ]);
  });

  return buildKeyboardWithMainMenu(keyboardRows);
}

function processScheduleDay(
  chatId,
  text,
  settings
) {
  const weekDays =
    getWeekDays();

  const selectedDay =
    weekDays.find(function(day) {
      const dayName =
        String(getMessage(day.message_key) || '').trim();

      return dayName === String(text || '').trim();
    });

  if (!selectedDay) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.SELECT_SCHEDULE_DAY
      ),
      buildScheduleDaysKeyboard()
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'schedule_day_code',
    selectedDay.day_code
  );

  showScheduleDayActions(
    chatId,
    settings
  );
}

function showScheduleDayActions(
  chatId,
  settings
) {

  const keyboard =
    buildKeyboardWithMainMenu([
      [
        {
          text: getMessage(
            MESSAGE_KEYS.SCHEDULE_ACTION_START
          )
        }
      ],
      [
        {
          text: getMessage(
            MESSAGE_KEYS.SCHEDULE_ACTION_END
          )
        }
      ],
      [
        {
          text: getMessage(
            MESSAGE_KEYS.SCHEDULE_ACTION_DAY_OFF
          )
        }
      ],
      [
        {
          text: getMessage(
            MESSAGE_KEYS.SCHEDULE_ACTION_WORKING
          )
        }
      ]
    ]);

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_SCHEDULE_ACTION
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.SELECT_ACTION
    ),
    keyboard
  );
}

function processScheduleAction(
  chatId,
  text,
  settings
) {
  const session =
    getUserSession(chatId);

  const providerId =
    session.schedule_provider_id;

  const dayCode =
    session.schedule_day_code;

  if (!providerId || !dayCode) {
    setUserState(
      chatId,
      ADMIN_STATES.WAITING_PROVIDER_FOR_SCHEDULE
    );

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SELECT_PROVIDER_FOR_SCHEDULE),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setPreviousMenu(
    chatId,
    'PROVIDERS_MENU'
  );

  if (
    text === getMessage(MESSAGE_KEYS.SCHEDULE_ACTION_DAY_OFF)
  ) {
    updateProviderScheduleField(
      providerId,
      dayCode,
      'is_working',
      false
    );

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SCHEDULE_UPDATED)
    );

    showProviderScheduleAdmin(
      chatId,
      providerId,
      settings
    );

    return;
  }

  if (
    text === getMessage(MESSAGE_KEYS.SCHEDULE_ACTION_WORKING)
  ) {
    const currentSchedule =
      getProviderScheduleDay(
        providerId,
        dayCode
      );

    if (!currentSchedule) {
      setUserState(
        chatId,
        ADMIN_STATES.WAITING_SCHEDULE_DAY
      );

      sendTelegramMessage(
        settings.AdminBotToken,
        chatId,
        getMessage(MESSAGE_KEYS.EDIT_ERROR),
        buildScheduleDaysKeyboard()
      );

      return;
    }

    const startTime =
      formatScheduleTime(currentSchedule.start_time) ||
      settings.DefaultWorkStartTime ||
      '09:00';

    const endTime =
      formatScheduleTime(currentSchedule.end_time) ||
      settings.DefaultWorkEndTime ||
      '20:00';

    updateProviderScheduleField(
      providerId,
      dayCode,
      'start_time',
      startTime
    );

    updateProviderScheduleField(
      providerId,
      dayCode,
      'end_time',
      endTime
    );

    updateProviderScheduleField(
      providerId,
      dayCode,
      'is_working',
      true
    );

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SCHEDULE_UPDATED)
    );

    showProviderScheduleAdmin(
      chatId,
      providerId,
      settings
    );

    return;
  }

  if (
    text === getMessage(MESSAGE_KEYS.SCHEDULE_ACTION_START)
  ) {
    setPreviousMenu(chatId, 'SCHEDULE_DAYS');

    setUserState(
      chatId,
      ADMIN_STATES.WAITING_SCHEDULE_START_TIME
    );

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.ENTER_NEW_VALUE),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  if (
    text === getMessage(MESSAGE_KEYS.SCHEDULE_ACTION_END)
  ) {
    setPreviousMenu(chatId, 'SCHEDULE_DAYS');

    setUserState(
      chatId,
      ADMIN_STATES.WAITING_SCHEDULE_END_TIME
    );

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.ENTER_NEW_VALUE),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_SCHEDULE_DAY
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_ACTION),
    buildScheduleDaysKeyboard()
  );
}

function processScheduleStartTime(
  chatId,
  text,
  settings
) {
  updateScheduleTimeAndRefresh(
    chatId,
    text,
    settings,
    'start_time'
  );
}

function processScheduleEndTime(
  chatId,
  text,
  settings
) {
  updateScheduleTimeAndRefresh(
    chatId,
    text,
    settings,
    'end_time'
  );
}

function updateScheduleTimeAndRefresh(
  chatId,
  text,
  settings,
  fieldName
) {
  const session =
    getUserSession(chatId);

  const providerId =
    session.schedule_provider_id;

  const dayCode =
    session.schedule_day_code;

  const value =
    normalizeTimeValue(text);

  if (!isValidTimeValue(value)) {
    setUserState(
      chatId,
      ADMIN_STATES.WAITING_SCHEDULE_DAY
    );

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.INVALID_TIME_FORMAT),
      buildScheduleDaysKeyboard()
    );

    return;
  }

  const currentSchedule =
    getProviderScheduleDay(
      providerId,
      dayCode
    );

  if (!currentSchedule) {
    setUserState(
      chatId,
      ADMIN_STATES.WAITING_SCHEDULE_DAY
    );

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.EDIT_ERROR),
      buildScheduleDaysKeyboard()
    );

    return;
  }

  const currentStartTime =
    formatScheduleTime(
      currentSchedule.start_time
    );

  const currentEndTime =
    formatScheduleTime(
      currentSchedule.end_time
    );

  const nextStartTime =
    fieldName === 'start_time'
      ? value
      : currentStartTime;

  const nextEndTime =
    fieldName === 'end_time'
      ? value
      : currentEndTime;

  const startMinutes =
    timeValueToMinutes(nextStartTime);

  const endMinutes =
    timeValueToMinutes(nextEndTime);

  if (
    startMinutes === null ||
    endMinutes === null ||
    startMinutes >= endMinutes
  ) {
    setUserState(
      chatId,
      ADMIN_STATES.WAITING_SCHEDULE_DAY
    );

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.INVALID_TIME_RANGE),
      buildScheduleDaysKeyboard()
    );

    return;
  }

  updateProviderScheduleField(
    providerId,
    dayCode,
    fieldName,
    value
  );

  updateProviderScheduleField(
    providerId,
    dayCode,
    'is_working',
    true
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SCHEDULE_UPDATED)
  );

  showProviderScheduleAdmin(
    chatId,
    providerId,
    settings
  );
}

function getProviderScheduleDay(
  providerId,
  dayCode
) {
  const schedule =
    getProviderSchedule(providerId);

  for (let i = 0; i < schedule.length; i++) {
    if (
      String(schedule[i].day_of_week) ===
      String(dayCode)
    ) {
      return schedule[i];
    }
  }

  return null;
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

  showProviderScheduleAdmin(
    chatId,
    providerId,
    settings
  );
}
