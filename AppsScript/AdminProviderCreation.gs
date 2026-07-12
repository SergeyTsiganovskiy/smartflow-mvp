function processProviderName(
  chatId,
  text,
  settings
) {
  const providerName =
    String(text || '').trim();

  if (!providerName) {
    startCreateProvider(
      chatId,
      settings
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'provider_name',
    providerName
  );

  showProviderLocations(
    chatId,
    settings
  );
}

function startCreateProvider(
  chatId,
  settings
) {
  setPreviousMenu(
    chatId,
    'PROVIDERS_MENU'
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_PROVIDER_NAME
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.ENTER_PROVIDER_NAME
    ),
    buildKeyboardWithMainMenu([])
  );
}

function showProviderLocations(chatId, settings) {
  setUserState(
    chatId,
    ADMIN_STATES.WAITING_PROVIDER_LOCATION
  );

  const locations = getLocations();
  const keyboardRows = [];

  locations.forEach(function(location) {
    keyboardRows.push([
      {
        text: location.name
      }
    ]);
  });

  const keyboard = {
    keyboard: keyboardRows,
    resize_keyboard: true
  };

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_PROVIDER_LOCATION),
    keyboard
  );
}

function processProviderLocation(
  chatId,
  text,
  settings
) {
  const location =
    findLocationByName(
      text,
      false
    );

  if (!location) {
    showProviderLocations(
      chatId,
      settings
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'provider_location_id',
    location.id
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_PROVIDER_PHONE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.ENTER_PROVIDER_PHONE
    ),
    buildKeyboardWithMainMenu([])
  );
}

function processProviderPhone(chatId, text, settings) {
  const phone = normalizePhone(text);

  if (!isValidPhone(phone)) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.PHONE_INVALID)
    );

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.ENTER_PROVIDER_PHONE)
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'provider_phone',
    phone
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_PROVIDER_TELEGRAM_ID
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_PROVIDER_TELEGRAM_ID)
  );

  buildKeyboardWithMainMenu([])
}

function processProviderTelegramId(
  chatId,
  text,
  settings
) {
  const telegramId =
    String(text || '').trim();

  setUserSessionValue(
    chatId,
    'provider_telegram_id',
    telegramId
  );

  const session =
    getUserSession(chatId);

  const providerId =
    createProviderFromAdminSession(
      session
    );

  resetProviderWizardSession(
    chatId
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.PROVIDER_CREATED
    ) +
      '\n\nID: ' +
      providerId
  );

  backToAdminMenu(
    chatId,
    settings,
    ADMIN_MENUS.PROVIDERS
  );
}
