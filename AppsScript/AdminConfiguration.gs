function sendConfigurationMenu(chatId, settings, language) {
  navigateAdmin(chatId, ADMIN_MENUS.CONFIGURATION);

  setUserState(chatId, ADMIN_STATES.WAITING_CONFIGURATION_ACTION);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.CONFIGURATION_TITLE, language),
    buildKeyboardWithMainMenu(
      [
        [{ text: getMessage(MESSAGE_KEYS.CONFIGURATION_LANGUAGE, language) }],
        [{ text: getMessage(MESSAGE_KEYS.CONFIGURATION_ADMIN_IDS, language) }],
        [{ text: getMessage(MESSAGE_KEYS.CONFIGURATION_REMINDER_DAY_BEFORE, language) }],
        [{ text: getMessage(MESSAGE_KEYS.CONFIGURATION_BOOKING_DAYS, language) }],
        [{ text: getMessage(MESSAGE_KEYS.CONFIGURATION_CACHE_DAYS, language) }],
        [{ text: getMessage(MESSAGE_KEYS.CONFIGURATION_PAGE_SIZE, language) }],
        [{ text: getMessage(MESSAGE_KEYS.CONFIGURATION_DEFAULT_WORK_HOURS, language) }]
      ],
      language
    )
  );
}

function startConfigurationReminderDayBefore(chatId, settings) {
  setUserState(chatId, ADMIN_STATES.WAITING_CONFIGURATION_REMINDER_DAY_BEFORE);

  const enabled = isSettingEnabled(settings.ReminderDayBefore, true);
  const status = enabled ? getMessage(MESSAGE_KEYS.ACTIVE) : getMessage(MESSAGE_KEYS.INACTIVE);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.CONFIGURATION_REMINDER_DAY_BEFORE_TITLE) +
      '\n\n' +
      getMessage(MESSAGE_KEYS.CONFIGURATION_CURRENT_STATUS) +
      ': ' +
      status,
    buildKeyboardWithMainMenu([
      [{ text: getMessage(MESSAGE_KEYS.CONFIGURATION_ENABLE) }],
      [{ text: getMessage(MESSAGE_KEYS.CONFIGURATION_DISABLE) }]
    ])
  );
}

function processConfigurationReminderDayBefore(chatId, text, settings) {
  let enabled;

  if (text === getMessage(MESSAGE_KEYS.CONFIGURATION_ENABLE)) {
    enabled = true;
  } else if (text === getMessage(MESSAGE_KEYS.CONFIGURATION_DISABLE)) {
    enabled = false;
  } else {
    return;
  }

  updateAdminConfigurationValue('ReminderDayBefore', enabled);

  addAuditLog(
    'ADMIN_CONFIGURATION_UPDATED',
    JSON.stringify({
      chatId: chatId,
      settingKey: 'ReminderDayBefore',
      value: enabled
    })
  );

  setUserState(chatId, '');
  const updatedSettings = getSettings();

  sendTelegramMessage(
    updatedSettings.AdminBotToken,
    chatId,
    getMessage(enabled ? MESSAGE_KEYS.CONFIGURATION_REMINDER_ENABLED : MESSAGE_KEYS.CONFIGURATION_REMINDER_DISABLED)
  );

  sendConfigurationMenu(chatId, updatedSettings);
}

function startConfigurationAdminIds(chatId, settings) {
  setUserState(chatId, ADMIN_STATES.WAITING_CONFIGURATION_ADMIN_ACTION);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.CONFIGURATION_ADMINS_TITLE) + '\n\n' + String(settings.AdminTelegramIds || ''),
    buildKeyboardWithMainMenu([
      [{ text: getMessage(MESSAGE_KEYS.CONFIGURATION_ADMIN_LIST) }],
      [{ text: getMessage(MESSAGE_KEYS.CONFIGURATION_ADMIN_ADD) }],
      [{ text: getMessage(MESSAGE_KEYS.CONFIGURATION_ADMIN_DELETE) }]
    ])
  );
}

function showConfigurationAdminList(chatId, settings) {
  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.CONFIGURATION_ADMINS_TITLE) + '\n\n' + String(settings.AdminTelegramIds || ''),
    buildKeyboardWithMainMenu([
      [{ text: getMessage(MESSAGE_KEYS.CONFIGURATION_ADMIN_LIST) }],
      [{ text: getMessage(MESSAGE_KEYS.CONFIGURATION_ADMIN_ADD) }],
      [{ text: getMessage(MESSAGE_KEYS.CONFIGURATION_ADMIN_DELETE) }]
    ])
  );
}

function normalizeConfigurationAdminIds(text) {
  const source = String(text || '').trim();

  if (!source) {
    return [];
  }

  const parts = source.split(',');
  const result = [];

  for (let i = 0; i < parts.length; i++) {
    const telegramId = String(parts[i]).trim();

    if (!/^\d+$/.test(telegramId)) {
      return [];
    }

    if (result.indexOf(telegramId) === -1) {
      result.push(telegramId);
    }
  }

  return result;
}

function getConfigurationAdminIds(settings) {
  return normalizeConfigurationAdminIds(String(settings.AdminTelegramIds || ''));
}

function isValidConfigurationTelegramId(text) {
  return /^\d+$/.test(String(text || '').trim());
}

function startConfigurationAdminAdd(chatId, settings) {
  setUserState(chatId, ADMIN_STATES.WAITING_CONFIGURATION_ADMIN_ADD);
  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.CONFIGURATION_ADMIN_ADD_PROMPT),
    buildKeyboardWithMainMenu([])
  );
}

function startConfigurationAdminDelete(chatId, settings) {
  setUserState(chatId, ADMIN_STATES.WAITING_CONFIGURATION_ADMIN_DELETE);
  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.CONFIGURATION_ADMIN_DELETE_PROMPT) + '\n\n' + String(settings.AdminTelegramIds || ''),
    buildKeyboardWithMainMenu([])
  );
}

function processConfigurationAdminAdd(chatId, text, settings) {
  const telegramId = String(text || '').trim();

  if (!isValidConfigurationTelegramId(telegramId)) {
    sendTelegramMessage(settings.AdminBotToken, chatId, getMessage(MESSAGE_KEYS.CONFIGURATION_ADMIN_ID_INVALID));
    return;
  }

  const adminIds = getConfigurationAdminIds(settings);

  if (adminIds.indexOf(telegramId) !== -1) {
    sendTelegramMessage(settings.AdminBotToken, chatId, getMessage(MESSAGE_KEYS.CONFIGURATION_ADMIN_ALREADY_EXISTS));

    startConfigurationAdminIds(chatId, settings);
    return;
  }

  adminIds.push(telegramId);
  const normalizedValue = adminIds.join(',');
  updateAdminConfigurationValue('AdminTelegramIds', normalizedValue);

  addAuditLog(
    'ADMIN_CONFIGURATION_UPDATED',
    JSON.stringify({
      chatId: chatId,
      settingKey: 'AdminTelegramIds',
      operation: 'add',
      administratorId: telegramId
    })
  );

  setUserState(chatId, '');
  const updatedSettings = getSettings();

  sendTelegramMessage(updatedSettings.AdminBotToken, chatId, getMessage(MESSAGE_KEYS.CONFIGURATION_ADMIN_ADDED));

  startConfigurationAdminIds(chatId, updatedSettings);
}

function processConfigurationAdminDelete(chatId, text, settings) {
  const telegramId = String(text || '').trim();

  if (!isValidConfigurationTelegramId(telegramId)) {
    sendTelegramMessage(settings.AdminBotToken, chatId, getMessage(MESSAGE_KEYS.CONFIGURATION_ADMIN_ID_INVALID));
    return;
  }

  if (telegramId === String(chatId)) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.CONFIGURATION_ADMIN_SELF_DELETE_FORBIDDEN)
    );
    return;
  }

  const adminIds = getConfigurationAdminIds(settings);
  const index = adminIds.indexOf(telegramId);

  if (index === -1) {
    sendTelegramMessage(settings.AdminBotToken, chatId, getMessage(MESSAGE_KEYS.CONFIGURATION_ADMIN_NOT_FOUND));
    return;
  }

  adminIds.splice(index, 1);
  updateAdminConfigurationValue('AdminTelegramIds', adminIds.join(','));

  addAuditLog(
    'ADMIN_CONFIGURATION_UPDATED',
    JSON.stringify({
      chatId: chatId,
      settingKey: 'AdminTelegramIds',
      operation: 'delete',
      administratorId: telegramId
    })
  );

  setUserState(chatId, '');
  const updatedSettings = getSettings();

  sendTelegramMessage(updatedSettings.AdminBotToken, chatId, getMessage(MESSAGE_KEYS.CONFIGURATION_ADMIN_DELETED));

  startConfigurationAdminIds(chatId, updatedSettings);
}

function startConfigurationLanguage(chatId, settings) {
  setUserState(chatId, ADMIN_STATES.WAITING_CONFIGURATION_LANGUAGE);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.CONFIGURATION_SELECT_LANGUAGE),
    buildKeyboardWithMainMenu([
      [{ text: getMessage(MESSAGE_KEYS.LANGUAGE_UKRAINIAN) }],
      [{ text: getMessage(MESSAGE_KEYS.LANGUAGE_RUSSIAN) }],
      [{ text: getMessage(MESSAGE_KEYS.LANGUAGE_ENGLISH) }]
    ])
  );
}

function getConfigurationLanguageByText(text) {
  const options = [
    { key: MESSAGE_KEYS.LANGUAGE_UKRAINIAN, value: 'uk' },
    { key: MESSAGE_KEYS.LANGUAGE_RUSSIAN, value: 'ru' },
    { key: MESSAGE_KEYS.LANGUAGE_ENGLISH, value: 'en' }
  ];

  for (let i = 0; i < options.length; i++) {
    if (getMessageValues(options[i].key).indexOf(String(text).trim()) !== -1) {
      return options[i].value;
    }
  }

  return '';
}

function processConfigurationLanguage(chatId, text, settings) {
  const language = getConfigurationLanguageByText(text);

  if (!language || !updateAdminConfigurationValue('Language', language)) {
    sendTelegramMessage(settings.AdminBotToken, chatId, getMessage(MESSAGE_KEYS.CONFIGURATION_INVALID_LANGUAGE));
    return;
  }

  const updatedSettings = getSettings();
  resetMessagesCache();
  setUserState(chatId, '');

  addAuditLog(
    'ADMIN_CONFIGURATION_UPDATED',
    JSON.stringify({
      chatId: chatId,
      settingKey: 'Language',
      value: language
    })
  );

  sendTelegramMessage(
    updatedSettings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.CONFIGURATION_LANGUAGE_UPDATED, language)
  );

  sendConfigurationMenu(chatId, updatedSettings, language);
}

function handleAdminConfigurationState(chatId, text, state, settings) {
  if (state === ADMIN_STATES.WAITING_CONFIGURATION_ACTION) {
    if (text === getMessage(MESSAGE_KEYS.CONFIGURATION_LANGUAGE)) {
      startConfigurationLanguage(chatId, settings);
      return;
    }

    if (text === getMessage(MESSAGE_KEYS.CONFIGURATION_ADMIN_IDS)) {
      startConfigurationAdminIds(chatId, settings);
      return;
    }

    if (text === getMessage(MESSAGE_KEYS.CONFIGURATION_REMINDER_DAY_BEFORE)) {
      startConfigurationReminderDayBefore(chatId, settings);
      return;
    }

    if (text === getMessage(MESSAGE_KEYS.CONFIGURATION_BOOKING_DAYS)) {
      startConfigurationBookingDaysAhead(chatId, settings);
      return;
    }

    if (text === getMessage(MESSAGE_KEYS.CONFIGURATION_CACHE_DAYS)) {
      startConfigurationCalendarCacheDays(chatId, settings);
      return;
    }

    if (text === getMessage(MESSAGE_KEYS.CONFIGURATION_PAGE_SIZE)) {
      startConfigurationPageSize(chatId, settings);
      return;
    }

    if (text === getMessage(MESSAGE_KEYS.CONFIGURATION_DEFAULT_WORK_HOURS)) {
      startConfigurationDefaultWorkHours(chatId, settings);
    }
    return;
  }

  if (state === ADMIN_STATES.WAITING_CONFIGURATION_LANGUAGE) {
    processConfigurationLanguage(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_CONFIGURATION_ADMIN_ACTION) {
    if (text === getMessage(MESSAGE_KEYS.CONFIGURATION_ADMIN_LIST)) {
      showConfigurationAdminList(chatId, settings);
      return;
    }

    if (text === getMessage(MESSAGE_KEYS.CONFIGURATION_ADMIN_ADD)) {
      startConfigurationAdminAdd(chatId, settings);
      return;
    }

    if (text === getMessage(MESSAGE_KEYS.CONFIGURATION_ADMIN_DELETE)) {
      startConfigurationAdminDelete(chatId, settings);
    }
    return;
  }

  if (state === ADMIN_STATES.WAITING_CONFIGURATION_ADMIN_ADD) {
    processConfigurationAdminAdd(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_CONFIGURATION_ADMIN_DELETE) {
    processConfigurationAdminDelete(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_CONFIGURATION_REMINDER_DAY_BEFORE) {
    processConfigurationReminderDayBefore(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_CONFIGURATION_BOOKING_DAYS) {
    processConfigurationBookingDaysAhead(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_CONFIGURATION_CACHE_DAYS) {
    processConfigurationCalendarCacheDays(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_CONFIGURATION_PAGE_SIZE) {
    processConfigurationPageSize(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_CONFIGURATION_DEFAULT_WORK_HOURS) {
    processConfigurationDefaultWorkHours(chatId, text, settings);
  }
}
