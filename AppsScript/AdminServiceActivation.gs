function processServiceToDisable(chatId, text, settings) {
  const service = findServiceByName(text);

  if (!service) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SELECT_SERVICE_FROM_LIST),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setServiceActive(
    service.id,
    false
  );

  clearUserSession(chatId);
  setUserState(chatId, '');

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SERVICE_DISABLED) || 'Услуга отключена',
    buildKeyboardWithMainMenu([])
  );

  backToAdminMenu(
    chatId,
    settings,
    ADMIN_MENUS.SERVICES
  );
}

function startDisableService(
  chatId,
  settings
) {
  setPreviousMenu(
    chatId,
    'SERVICES_MENU'
  );

  const services =
    getServices();

  const keyboardRows = [];

  services.forEach(function(service) {
    keyboardRows.push([
      {
        text: service.name
      }
    ]);
  });

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_SERVICE_TO_DISABLE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.SELECT_SERVICE_FROM_LIST
    ),
    buildKeyboardWithMainMenu(
      keyboardRows
    )
  );
}

function startEnableService(chatId, settings) {
  setPreviousMenu(chatId, 'SERVICES_MENU');

  const services = getInactiveServices();
  const keyboardRows = [];

  services.forEach(function(service) {
    keyboardRows.push([
      {
        text: service.name
      }
    ]);
  });

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_SERVICE_TO_ENABLE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_SERVICE_FROM_LIST),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processServiceToEnable(chatId, text, settings) {
  const service = findInactiveServiceByName(text);

  if (!service) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SELECT_SERVICE_FROM_LIST),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setServiceActive(
    service.id,
    true
  );

  clearUserSession(chatId);
  setUserState(chatId, '');

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SERVICE_ENABLED) || 'Услуга включена',
    buildKeyboardWithMainMenu([])
  );

  backToAdminMenu(
    chatId,
    settings,
    ADMIN_MENUS.SERVICES
  );
}
