function startConfigurationBookingDaysAhead(chatId, settings) {
  setUserState(chatId, ADMIN_STATES.WAITING_CONFIGURATION_BOOKING_DAYS);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.CONFIGURATION_BOOKING_DAYS_PROMPT) +
      '\n\n' +
      getMessage(MESSAGE_KEYS.CONFIGURATION_CURRENT_VALUE) +
      ': ' +
      String(settings.BookingDaysAhead || 30),
    buildKeyboardWithMainMenu([])
  );
}

function parseConfigurationDays(text) {
  const value = String(text || '').trim();

  if (!/^\d+$/.test(value)) {
    return 0;
  }

  return Number(value);
}

function sendConfigurationDaysError(chatId, settings, messageKey, limitValue) {
  let text = getMessage(messageKey);

  if (limitValue !== undefined) {
    text += ': ' + String(limitValue);
  }

  sendTelegramMessage(settings.AdminBotToken, chatId, text, buildKeyboardWithMainMenu([]));
}

function processConfigurationBookingDaysAhead(chatId, text, settings) {
  const value = parseConfigurationDays(text);

  if (!isAllowedAdminConfigurationValue('BookingDaysAhead', value)) {
    sendConfigurationDaysError(chatId, settings, MESSAGE_KEYS.CONFIGURATION_DAYS_INVALID);
    return;
  }

  saveConfigurationDays(chatId, settings, 'BookingDaysAhead', value, MESSAGE_KEYS.CONFIGURATION_BOOKING_DAYS_UPDATED);
}

function saveConfigurationDays(chatId, settings, settingKey, value, successMessageKey) {
  updateAdminConfigurationValue(settingKey, value);

  addAuditLog(
    'ADMIN_CONFIGURATION_UPDATED',
    JSON.stringify({
      chatId: chatId,
      settingKey: settingKey,
      value: value
    })
  );

  setUserState(chatId, '');
  const updatedSettings = getSettings();

  sendTelegramMessage(updatedSettings.AdminBotToken, chatId, getMessage(successMessageKey));

  backToAdminMenu(chatId, updatedSettings, ADMIN_MENUS.CONFIGURATION);
}
