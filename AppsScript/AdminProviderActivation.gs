function startDisableProvider(chatId, settings) {
  setPreviousMenu(chatId, 'PROVIDERS_MENU');
  const providers = getProviders();
  const keyboardRows = [];

  providers.forEach(function (provider) {
    keyboardRows.push([
      {
        text: provider.name
      }
    ]);
  });

  setUserState(chatId, ADMIN_STATES.WAITING_PROVIDER_TO_DISABLE);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_PROVIDER_FROM_LIST),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processProviderToDisable(chatId, text, settings) {
  const provider = findProviderByName(text);

  if (!provider) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SELECT_PROVIDER_FROM_LIST),
      buildKeyboardWithMainMenu([])
    );
    return;
  }

  updateProviderField(provider.id, 'active', false);

  clearUserSession(chatId);
  setUserState(chatId, '');
  setPreviousMenu(chatId, 'PROVIDERS_MENU');

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.PROVIDER_DISABLED),
    buildKeyboardWithMainMenu([])
  );
}

function startEnableProvider(chatId, settings) {
  setPreviousMenu(chatId, 'PROVIDERS_MENU');

  const providers = getInactiveProviders();
  const keyboardRows = [];

  providers.forEach(function (provider) {
    keyboardRows.push([
      {
        text: provider.name
      }
    ]);
  });

  setUserState(chatId, ADMIN_STATES.WAITING_PROVIDER_TO_ENABLE);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_PROVIDER_FROM_LIST),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processProviderToEnable(chatId, text, settings) {
  const provider = findInactiveProviderByName(text);

  if (!provider) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SELECT_PROVIDER_FROM_LIST),
      buildKeyboardWithMainMenu([])
    );
    return;
  }

  updateProviderField(provider.id, 'active', true);

  clearUserSession(chatId);
  setUserState(chatId, '');
  setPreviousMenu(chatId, 'PROVIDERS_MENU');

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.PROVIDER_ENABLED),
    buildKeyboardWithMainMenu([])
  );
}
