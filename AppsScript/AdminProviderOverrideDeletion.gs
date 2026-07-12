function startDeleteOverride(chatId, settings) {
  const session = getUserSession(chatId);
  const providerId = session.override_provider_id;

  const overrides = getProviderOverrides(providerId);
  const keyboardRows = [];

  overrides.forEach(function(item, index) {
    keyboardRows.push([
      {
        text: buildOverrideLabel(item, index)
      }
    ]);
  });

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_OVERRIDE_TO_DELETE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_OVERRIDE_TO_DELETE),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processOverrideToDelete(chatId, text, settings) {
  const session = getUserSession(chatId);
  const providerId = session.override_provider_id;

  const overrides = getProviderOverrides(providerId);

  const selectedOverride = overrides.find(function(item, index) {
    return buildOverrideLabel(item, index) === String(text || '').trim();
  });

  if (!selectedOverride) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SELECT_OVERRIDE_TO_DELETE),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  disableProviderOverride(selectedOverride.override_id);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.OVERRIDE_DELETED)
  );

  showOverrideActions(chatId, settings);
}
