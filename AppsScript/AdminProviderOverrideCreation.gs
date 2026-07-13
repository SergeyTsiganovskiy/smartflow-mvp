function showOverrideActions(chatId, settings) {
  setPreviousMenu(chatId, 'OVERRIDE_PROVIDERS_LIST');

  const session = getUserSession(chatId);

  const providerId = session.override_provider_id;

  const provider = findProviderById(providerId);

  const overrides = getProviderOverrides(providerId);

  let text = '<b>' + getMessage(MESSAGE_KEYS.ADMIN_PROVIDER_OVERRIDES) + '</b>\n\n';

  if (provider) {
    text += provider.name + '\n\n';
  }

  if (overrides.length === 0) {
    text += getMessage(MESSAGE_KEYS.NO_OVERRIDES_FOUND) + '\n\n';
  } else {
    overrides.forEach(function (item) {
      text += formatDateForDisplay(item.date) + ' — ' + getMessage(item.reason_key);

      if (String(item.is_working).toUpperCase() === 'TRUE') {
        text += ' ' + formatScheduleTime(item.start_time) + '-' + formatScheduleTime(item.end_time);
      }

      text += '\n';
    });

    text += '\n';
  }

  const keyboard = buildKeyboardWithMainMenu([
    [
      {
        text: getMessage(MESSAGE_KEYS.ADD_OVERRIDE)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.DELETE_OVERRIDE)
      }
    ]
  ]);

  setUserState(chatId, ADMIN_STATES.WAITING_OVERRIDE_ACTION);

  sendTelegramMessage(settings.AdminBotToken, chatId, text, keyboard);
}

function processOverrideAction(chatId, text, settings) {
  if (text === getMessage(MESSAGE_KEYS.ADD_OVERRIDE)) {
    showOverrideReasons(chatId, settings);

    return;
  }

  if (text === getMessage(MESSAGE_KEYS.DELETE_OVERRIDE)) {
    startDeleteOverride(chatId, settings);
    return;
  }
}

function showOverrideReasons(chatId, settings) {
  const keyboard = buildKeyboardWithMainMenu([
    [
      {
        text: getMessage(MESSAGE_KEYS.REASON_VACATION)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.REASON_SICK_LEAVE)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.REASON_DAY_OFF)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.REASON_SHORT_DAY)
      }
    ]
  ]);

  setUserState(chatId, ADMIN_STATES.WAITING_OVERRIDE_REASON);

  sendTelegramMessage(settings.AdminBotToken, chatId, getMessage(MESSAGE_KEYS.SELECT_REASON), keyboard);
}

function processOverrideReason(chatId, text, settings) {
  const reasons = {};

  reasons[getMessage(MESSAGE_KEYS.REASON_VACATION)] = 'REASON_VACATION';

  reasons[getMessage(MESSAGE_KEYS.REASON_SICK_LEAVE)] = 'REASON_SICK_LEAVE';

  reasons[getMessage(MESSAGE_KEYS.REASON_DAY_OFF)] = 'REASON_DAY_OFF';

  reasons[getMessage(MESSAGE_KEYS.REASON_SHORT_DAY)] = 'REASON_SHORT_DAY';

  const reasonKey = reasons[text];

  if (!reasonKey) {
    sendTelegramMessage(settings.AdminBotToken, chatId, getMessage(MESSAGE_KEYS.SELECT_REASON));

    return;
  }

  setUserSessionValue(chatId, 'override_reason_key', reasonKey);

  setUserState(chatId, ADMIN_STATES.WAITING_OVERRIDE_DATE);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_OVERRIDE_DATE),
    buildKeyboardWithMainMenu([])
  );
}

function processOverrideDate(chatId, text, settings) {
  const dateValue = String(text || '').trim();

  if (!isValidDateValue(dateValue)) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.INVALID_DATE_FORMAT),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(chatId, 'override_date', dateValue);

  const session = getUserSession(chatId);

  if (session.override_reason_key === 'REASON_SHORT_DAY') {
    setUserState(chatId, ADMIN_STATES.WAITING_OVERRIDE_START_TIME);

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SCHEDULE_ACTION_START),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  createProviderScheduleOverrideFromSession(chatId);

  clearUserSession(chatId);
  setUserState(chatId, '');

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.OVERRIDE_CREATED),
    buildKeyboardWithMainMenu([])
  );
}

function processOverrideStartTime(chatId, text, settings) {
  const value = normalizeTimeValue(text);

  if (!isValidTimeValue(value)) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.INVALID_TIME_FORMAT),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(chatId, 'override_start_time', value);

  setUserState(chatId, ADMIN_STATES.WAITING_OVERRIDE_END_TIME);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SCHEDULE_ACTION_END),
    buildKeyboardWithMainMenu([])
  );
}

function processOverrideEndTime(chatId, text, settings) {
  const value = normalizeTimeValue(text);

  if (!isValidTimeValue(value)) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.INVALID_TIME_FORMAT),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  const session = getUserSession(chatId);

  const startMinutes = timeValueToMinutes(session.override_start_time);

  const endMinutes = timeValueToMinutes(value);

  if (startMinutes === null || endMinutes === null || startMinutes >= endMinutes) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.INVALID_TIME_RANGE),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(chatId, 'override_end_time', value);

  createShortDayOverride(chatId);

  clearUserSession(chatId);

  setUserState(chatId, '');

  sendTelegramMessage(settings.AdminBotToken, chatId, getMessage(MESSAGE_KEYS.OVERRIDE_CREATED));
}
