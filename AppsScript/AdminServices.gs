
function sendServicesMenu(chatId, settings) {
  navigateAdmin(chatId, ADMIN_MENUS.SERVICES);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ADMIN_SERVICES),
    buildServicesMenuKeyboard()
  );
}

function buildServicesMenuKeyboard() {
  return buildKeyboardWithMainMenu([
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_ADD_SERVICE) }],
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_SERVICE_LIST) }],
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_CUSTOMER_SERVICES) }],
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_SERVICE_EDIT) }],
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_SERVICE_DISABLE) }],
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_SERVICE_ENABLE) }]
  ]);
}

function showServiceLocations(chatId, settings) {
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
    ADMIN_STATES.WAITING_SERVICE_LOCATION
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_SERVICE_LOCATION),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processServiceDurationMax(
  chatId,
  text,
  settings
) {
  const durationMax =
    Number(
      String(text || '').trim()
    );

  const session =
    getUserSession(chatId);

  const durationMin =
    Number(
      session.service_duration_min || 0
    );

  if (
    !durationMax ||
    durationMax < durationMin
  ) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.ENTER_SERVICE_DURATION_MAX
      ),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'service_duration_max',
    durationMax
  );

  const updatedSession =
    getUserSession(chatId);

  const serviceId =
    createService({
      name:
        updatedSession.service_name,

      location_id:
        updatedSession.service_location_id,

      price_min:
        updatedSession.service_price_min,

      price_max:
        updatedSession.service_price_max,

      duration_min:
        updatedSession.service_duration_min,

      duration_max:
        updatedSession.service_duration_max
    });

  resetServiceWizardSession(
    chatId
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.SERVICE_CREATED
    ) +
      '\n\nID: ' +
      serviceId
  );

  backToAdminMenu(
    chatId,
    settings,
    ADMIN_MENUS.SERVICES
  );
}

function startCreateService(chatId, settings) {
  setPreviousMenu(chatId, 'SERVICES_MENU');

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_SERVICE_NAME
  );

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

  setUserSessionValue(
    chatId,
    'service_name',
    serviceName
  );

  showServiceLocations(chatId, settings);
}

function processServiceLocation(chatId, text, settings) {
  const location = findLocationByName(text);

  if (!location) {
    showServiceLocations(chatId, settings);
    return;
  }

  setUserSessionValue(
    chatId,
    'service_location_id',
    location.id
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_SERVICE_PRICE_MIN
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_SERVICE_PRICE_MIN),
    buildKeyboardWithMainMenu([])
  );
}

function processServicePriceMin(chatId, text, settings) {
  const priceMin = Number(String(text || '').trim());

  if (!priceMin || priceMin < 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.ENTER_SERVICE_PRICE_MIN),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'service_price_min',
    priceMin
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_SERVICE_PRICE_MAX
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_SERVICE_PRICE_MAX),
    buildKeyboardWithMainMenu([])
  );
}

function processServicePriceMax(chatId, text, settings) {
  const priceMax = Number(String(text || '').trim());
  const session = getUserSession(chatId);
  const priceMin = Number(session.service_price_min || 0);

  if (!priceMax || priceMax < priceMin) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.ENTER_SERVICE_PRICE_MAX),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'service_price_max',
    priceMax
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_SERVICE_DURATION_MIN
  );

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

  setUserSessionValue(
    chatId,
    'service_duration_min',
    durationMin
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_SERVICE_DURATION_MAX
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_SERVICE_DURATION_MAX),
    buildKeyboardWithMainMenu([])
  );
}

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
      getMessage(MESSAGE_KEYS.SERVICE_PRICE_LABEL) +
      ': ' +
      service.price_min +
      '-' +
      service.price_max +
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
    [{ text: getMessage(MESSAGE_KEYS.SERVICE_FIELD_PRICE_MIN) }],
    [{ text: getMessage(MESSAGE_KEYS.SERVICE_FIELD_PRICE_MAX) }],
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
  allowedFields[getMessage(MESSAGE_KEYS.SERVICE_FIELD_PRICE_MIN)] = 'price_min';
  allowedFields[getMessage(MESSAGE_KEYS.SERVICE_FIELD_PRICE_MAX)] = 'price_max';
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
    field === 'price_min' ||
    field === 'price_max' ||
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
  setPreviousMenu(chatId, 'SERVICES_MENU');

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SERVICE_DISABLED) || 'Услуга отключена',
    buildKeyboardWithMainMenu([])
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
  setPreviousMenu(chatId, 'SERVICES_MENU');

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SERVICE_ENABLED) || 'Услуга включена',
    buildKeyboardWithMainMenu([])
  );
}

function resetServiceWizardSession(chatId) {
  setUserSessionValues(
    chatId,
    {
      service_name: '',
      service_location_id: '',
      service_price_min: '',
      service_price_max: '',
      service_duration_min: '',
      service_duration_max: '',

      edit_service_id: '',
      edit_service_field: ''
    }
  );

  setUserState(
    chatId,
    ''
  );
}
