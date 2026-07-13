function startConfigurationPageSize(chatId, settings) {
  setUserState(chatId, ADMIN_STATES.WAITING_CONFIGURATION_PAGE_SIZE);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.CONFIGURATION_PAGE_SIZE_PROMPT) +
      '\n\n' +
      getMessage(MESSAGE_KEYS.CONFIGURATION_CURRENT_VALUE) +
      ': ' +
      String(getPaginationPageSize(settings)),
    buildKeyboardWithMainMenu([])
  );
}

function processConfigurationPageSize(chatId, text, settings) {
  const value = parseConfigurationDays(text);

  if (!isAllowedAdminConfigurationValue('PaginationPageSize', value)) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.CONFIGURATION_PAGE_SIZE_INVALID),
      buildKeyboardWithMainMenu([])
    );
    return;
  }

  updateAdminConfigurationValue('PaginationPageSize', value);

  addAuditLog(
    'ADMIN_CONFIGURATION_UPDATED',
    JSON.stringify({
      chatId: chatId,
      settingKey: 'PaginationPageSize',
      value: value
    })
  );

  setUserState(chatId, '');
  const updatedSettings = getSettings();

  sendTelegramMessage(updatedSettings.AdminBotToken, chatId, getMessage(MESSAGE_KEYS.CONFIGURATION_PAGE_SIZE_UPDATED));

  backToAdminMenu(chatId, updatedSettings, ADMIN_MENUS.CONFIGURATION);
}
