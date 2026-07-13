function startProviderOverrides(chatId, settings) {
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

  setUserState(chatId, ADMIN_STATES.WAITING_PROVIDER_FOR_OVERRIDE);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_PROVIDER_FOR_OVERRIDE),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processProviderForOverride(chatId, text, settings) {
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

  setUserSessionValue(chatId, 'override_provider_id', provider.id);

  showOverrideActions(chatId, settings);
}
