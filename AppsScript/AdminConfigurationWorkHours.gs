function startConfigurationDefaultWorkHours(chatId, settings) {
  setUserState(chatId, ADMIN_STATES.WAITING_CONFIGURATION_DEFAULT_WORK_HOURS);

  const startTime = formatScheduleTime(settings.DefaultWorkStartTime || '09:00');
  const endTime = formatScheduleTime(settings.DefaultWorkEndTime || '20:00');

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.CONFIGURATION_DEFAULT_WORK_HOURS_PROMPT) +
      '\n\n' +
      getMessage(MESSAGE_KEYS.CONFIGURATION_CURRENT_VALUE) +
      ': ' +
      startTime +
      '-' +
      endTime,
    buildKeyboardWithMainMenu([])
  );
}

function parseConfigurationDefaultWorkHours(text) {
  const match = String(text || '')
    .trim()
    .match(/^([01]\d|2[0-3]):([0-5]\d)\s*-\s*([01]\d|2[0-3]):([0-5]\d)$/);

  if (!match) {
    return null;
  }

  return {
    startTime: match[1] + ':' + match[2],
    endTime: match[3] + ':' + match[4]
  };
}

function processConfigurationDefaultWorkHours(chatId, text, settings) {
  const value = parseConfigurationDefaultWorkHours(text);

  if (!value) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.CONFIGURATION_DEFAULT_WORK_HOURS_INVALID),
      buildKeyboardWithMainMenu([])
    );
    return;
  }

  if (timeValueToMinutes(value.startTime) >= timeValueToMinutes(value.endTime)) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.CONFIGURATION_DEFAULT_WORK_HOURS_ORDER_INVALID),
      buildKeyboardWithMainMenu([])
    );
    return;
  }

  if (
    !updateAdminConfigurationValue('DefaultWorkStartTime', value.startTime) ||
    !updateAdminConfigurationValue('DefaultWorkEndTime', value.endTime)
  ) {
    throw new Error('Default work hours update failed');
  }

  addAuditLog(
    'ADMIN_CONFIGURATION_UPDATED',
    JSON.stringify({
      chatId: chatId,
      settingKey: 'DefaultWorkHours',
      startTime: value.startTime,
      endTime: value.endTime
    })
  );

  setUserState(chatId, '');
  const updatedSettings = getSettings();

  sendTelegramMessage(
    updatedSettings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.CONFIGURATION_DEFAULT_WORK_HOURS_UPDATED)
  );

  sendConfigurationMenu(chatId, updatedSettings);
}
