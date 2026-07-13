function showServicesListAdmin(chatId, settings) {
  setUserSessionValue(
    chatId,
    'admin_back_menu',
    ADMIN_MENUS.SERVICES
  );

  const services = getServices();

  if (services.length === 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.NO_SERVICES_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  let text =
    '<b>' +
    getMessage(MESSAGE_KEYS.SERVICES_LIST_TITLE) +
    '</b>\n\n';

  services.forEach(function(service, index) {
    const location =
      findLocationById(service.location_id);

    text +=
      String(index + 1) +
      '. <b>' +
      service.name +
      '</b>\n';

    text +=
      '📍 ' +
      (location ? location.name : service.location_id) +
      '\n';

    text +=
      getMessage(MESSAGE_KEYS.SERVICE_DURATION_LABEL) +
      ': ' +
      service.duration_min +
      '-' +
      service.duration_max +
      ' ' +
      getMessage(MESSAGE_KEYS.MINUTES_SHORT) +
      '\n\n';
  });

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    text,
    buildKeyboardWithMainMenu([])
  );
}

function startEditService(chatId, settings) {
  setPreviousMenu(chatId, 'SERVICES_MENU');

  const services = getServices();
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
    ADMIN_STATES.WAITING_SERVICE_TO_EDIT
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_SERVICE_FROM_LIST),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processServiceToEdit(chatId, text, settings) {
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

  showServiceEditFields(
    chatId,
    service.id,
    settings
  );
}

function showServiceEditFields(chatId, serviceId, settings) {
  setUserSessionValue(chatId, 'edit_service_id', serviceId);
  setUserSessionValue(chatId, 'edit_service_field', '');

  const keyboard = buildKeyboardWithMainMenu([
    [{ text: getMessage(MESSAGE_KEYS.SERVICE_FIELD_NAME) }],
    [{ text: getMessage(MESSAGE_KEYS.SERVICE_FIELD_LOCATION) }],
    [{ text: getMessage(MESSAGE_KEYS.SERVICE_FIELD_DURATION_MIN) }],
    [{ text: getMessage(MESSAGE_KEYS.SERVICE_FIELD_DURATION_MAX) }]
  ]);

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_SERVICE_FIELD_TO_EDIT
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_SERVICE_FIELD),
    keyboard
  );
}

function processServiceFieldToEdit(chatId, text, settings) {
  const fieldText = String(text || '').trim();

  const allowedFields = {};

  allowedFields[getMessage(MESSAGE_KEYS.SERVICE_FIELD_NAME)] = 'name';
  allowedFields[getMessage(MESSAGE_KEYS.SERVICE_FIELD_LOCATION)] = 'location_id';
  allowedFields[getMessage(MESSAGE_KEYS.SERVICE_FIELD_DURATION_MIN)] = 'duration_min';
  allowedFields[getMessage(MESSAGE_KEYS.SERVICE_FIELD_DURATION_MAX)] = 'duration_max';

  const field = allowedFields[fieldText];

  if (!field) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SELECT_SERVICE_FIELD),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(chatId, 'edit_service_field', field);

  if (field === 'location_id') {
    showServiceEditLocations(chatId, settings);
    return;
  }

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_SERVICE_NEW_VALUE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_NEW_VALUE),
    buildKeyboardWithMainMenu([])
  );
}

function showServiceEditLocations(chatId, settings) {
  const locations = getLocations();
  const keyboardRows = [];

  locations.forEach(function(location) {
    keyboardRows.push([
      {
        text: location.name
      }
    ]);
  });

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_SERVICE_NEW_VALUE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_SERVICE_LOCATION),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processServiceNewValue(chatId, text, settings) {
  const session = getUserSession(chatId);

  const serviceId = session.edit_service_id;
  const field = session.edit_service_field;

  if (!serviceId || !field) {
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
        getMessage(MESSAGE_KEYS.SELECT_SERVICE_LOCATION),
        buildKeyboardWithMainMenu([])
      );

      return;
    }

    value = location.id;
  }

  if (
    field === 'duration_min' ||
    field === 'duration_max'
  ) {
    value = Number(value);

    if (!value || value < 0) {
      sendTelegramMessage(
        settings.AdminBotToken,
        chatId,
        getMessage(MESSAGE_KEYS.ENTER_NEW_VALUE),
        buildKeyboardWithMainMenu([])
      );

      return;
    }
  }

  updateServiceField(
    serviceId,
    field,
    value
  );

  setUserSessionValue(chatId, 'edit_service_field', '');

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SERVICE_UPDATED)
  );

  showServiceEditFields(
    chatId,
    serviceId,
    settings
  );
}
