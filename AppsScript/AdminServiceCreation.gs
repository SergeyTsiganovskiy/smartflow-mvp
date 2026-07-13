function showServiceLocations(chatId, settings) {
  const locations = getLocations();
  const keyboardRows = [];

  locations.forEach(function (location) {
    keyboardRows.push([
      {
        text: location.name
      }
    ]);
  });

  setUserState(chatId, ADMIN_STATES.WAITING_SERVICE_LOCATION);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_SERVICE_LOCATION),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processServiceDurationMax(chatId, text, settings) {
  const durationMax = Number(String(text || '').trim());

  const session = getUserSession(chatId);

  const durationMin = Number(session.service_duration_min || 0);

  if (!durationMax || durationMax < durationMin) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.ENTER_SERVICE_DURATION_MAX),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(chatId, 'service_duration_max', durationMax);

  const updatedSession = getUserSession(chatId);

  const serviceId = createService({
    name: updatedSession.service_name,

    location_id: updatedSession.service_location_id,

    duration_min: updatedSession.service_duration_min,

    duration_max: updatedSession.service_duration_max
  });

  resetServiceWizardSession(chatId);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SERVICE_CREATED) + '\n\nID: ' + serviceId
  );

  backToAdminMenu(chatId, settings, ADMIN_MENUS.SERVICES);
}

function startCreateService(chatId, settings) {
  setPreviousMenu(chatId, 'SERVICES_MENU');

  setUserState(chatId, ADMIN_STATES.WAITING_SERVICE_NAME);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_SERVICE_NAME),
    buildKeyboardWithMainMenu([])
  );
}

function processServiceName(chatId, text, settings) {
  const serviceName = String(text || '').trim();

  if (!serviceName) {
    startCreateService(chatId, settings);
    return;
  }

  setUserSessionValue(chatId, 'service_name', serviceName);

  showServiceLocations(chatId, settings);
}

function processServiceLocation(chatId, text, settings) {
  const location = findLocationByName(text);

  if (!location) {
    showServiceLocations(chatId, settings);
    return;
  }

  setUserSessionValue(chatId, 'service_location_id', location.id);

  setUserState(chatId, ADMIN_STATES.WAITING_SERVICE_DURATION_MIN);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_SERVICE_DURATION_MIN),
    buildKeyboardWithMainMenu([])
  );
}

function processServiceDurationMin(chatId, text, settings) {
  const durationMin = Number(String(text || '').trim());

  if (!durationMin || durationMin <= 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.ENTER_SERVICE_DURATION_MIN),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(chatId, 'service_duration_min', durationMin);

  setUserState(chatId, ADMIN_STATES.WAITING_SERVICE_DURATION_MAX);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_SERVICE_DURATION_MAX),
    buildKeyboardWithMainMenu([])
  );
}
