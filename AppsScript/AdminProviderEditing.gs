function startEditProvider(chatId, settings) {
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

  const keyboard = buildKeyboardWithMainMenu(keyboardRows);

  setUserState(chatId, ADMIN_STATES.WAITING_PROVIDER_TO_EDIT);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_PROVIDER_FROM_LIST),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processProviderToEdit(chatId, text, settings) {
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

  showProviderEditFields(chatId, provider.id, settings);
}

function processProviderFieldToEdit(chatId, text, settings) {
  const fieldText = String(text || '').trim();

  const allowedFields = {};

  allowedFields[getMessage(MESSAGE_KEYS.PROVIDER_FIELD_NAME)] = 'name';

  allowedFields[getMessage(MESSAGE_KEYS.PROVIDER_FIELD_LOCATION)] = 'location_id';

  allowedFields[getMessage(MESSAGE_KEYS.PROVIDER_FIELD_PHONE)] = 'phone';

  allowedFields[getMessage(MESSAGE_KEYS.PROVIDER_FIELD_TELEGRAM_ID)] = 'telegram_id';

  const field = allowedFields[fieldText];

  if (!field) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SELECT_FIELD_FROM_LIST),
      buildKeyboardWithMainMenu([])
    );
    return;
  }

  setUserSessionValue(chatId, 'edit_provider_field', field);

  if (field === 'location_id') {
    showProviderEditLocations(chatId, settings);
    return;
  }

  setUserState(chatId, ADMIN_STATES.WAITING_PROVIDER_NEW_VALUE);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_NEW_VALUE),
    buildKeyboardWithMainMenu([])
  );
}

function showProviderEditLocations(chatId, settings) {
  const locations = getLocations();

  const keyboardRows = [];

  locations.forEach(function (location) {
    keyboardRows.push([
      {
        text: location.name
      }
    ]);
  });

  setUserState(chatId, ADMIN_STATES.WAITING_PROVIDER_NEW_VALUE);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_NEW_VALUE),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processProviderNewValue(chatId, text, settings) {
  const session = getUserSession(chatId);

  const providerId = session.edit_provider_id;

  const field = session.edit_provider_field;

  if (!providerId || !field) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.EDIT_ERROR),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  let value = String(text || '').trim();

  if (field === 'location_id') {
    const location = findLocationByName(value);

    if (!location) {
      sendTelegramMessage(
        settings.AdminBotToken,
        chatId,
        getMessage(MESSAGE_KEYS.SELECT_LOCATION_FROM_LIST),
        buildKeyboardWithMainMenu([])
      );

      return;
    }

    value = location.id;
  }

  updateProviderField(providerId, field, value);

  sendTelegramMessage(settings.AdminBotToken, chatId, getMessage(MESSAGE_KEYS.CHANGES_SAVED));

  showProviderEditFields(chatId, providerId, settings);
}

function showProviderEditFields(chatId, providerId, settings) {
  setUserSessionValue(chatId, 'edit_provider_id', providerId);

  setPreviousMenu(chatId, 'PROVIDER_EDIT_FIELDS');

  const keyboard = buildKeyboardWithMainMenu([
    [{ text: getMessage(MESSAGE_KEYS.PROVIDER_FIELD_NAME) }],
    [{ text: getMessage(MESSAGE_KEYS.PROVIDER_FIELD_LOCATION) }],
    [{ text: getMessage(MESSAGE_KEYS.PROVIDER_FIELD_PHONE) }],
    [{ text: getMessage(MESSAGE_KEYS.PROVIDER_FIELD_TELEGRAM_ID) }]
  ]);

  setUserState(chatId, ADMIN_STATES.WAITING_PROVIDER_FIELD_TO_EDIT);

  sendTelegramMessage(settings.AdminBotToken, chatId, getMessage(MESSAGE_KEYS.SELECT_FIELD_FROM_LIST), keyboard);
}
