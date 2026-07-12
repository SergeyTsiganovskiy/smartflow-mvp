
function sendProvidersMenu(chatId, settings) {
  navigateAdmin(chatId, ADMIN_MENUS.PROVIDERS);

  addAuditLog(
  'SEND_PROVIDERS_MENU_CALLED',
  JSON.stringify({
    stack: getNavigationStack(chatId)
  })
);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ADMIN_PROVIDERS),
    buildProvidersMenuKeyboard()
  );
}

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

function showProvidersListAdmin(chatId, settings) {
  setUserSessionValue(
    chatId,
    'admin_back_menu',
    ADMIN_MENUS.PROVIDERS
  );

  const providers = getProviders();

  if (providers.length === 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.NO_PROVIDERS_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  let text =
    '<b>' +
    getMessage(MESSAGE_KEYS.PROVIDERS_LIST_TITLE) +
    '</b>\n\n';

  providers.forEach(function(provider, index) {
    const location =
      findLocationById(provider.location_id);

    text +=
      String(index + 1) +
      '. <b>' +
      provider.name +
      '</b>\n';

    text +=
      '📍 ' +
      (location ? location.name : provider.location_id) +
      '\n';

    if (provider.phone) {
      text +=
        '📞 ' +
        provider.phone +
        '\n';
    }

    text += '\n';
  });

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    text,
    buildKeyboardWithMainMenu([])
  );
}

function startEditProvider(
  chatId,
  settings
) {
  setPreviousMenu(chatId, 'PROVIDERS_MENU');

  const providers =
    getProviders();

  const keyboardRows = [];

  providers.forEach(function(provider) {
    keyboardRows.push([
      {
        text: provider.name
      }
    ]);
  });

  const keyboard =
    buildKeyboardWithMainMenu(
      keyboardRows
    );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_PROVIDER_TO_EDIT
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_PROVIDER_FROM_LIST),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processProviderToEdit(
  chatId,
  text,
  settings
) {
  const provider =
    findProviderByName(text);

  if (!provider) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SELECT_PROVIDER_FROM_LIST),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  showProviderEditFields(
    chatId,
    provider.id,
    settings
  );
}

function buildProvidersMenuKeyboard(additionalRows) {
  const rows = additionalRows || [];

  rows.push(
    [
      {
        text: getMessage(
          MESSAGE_KEYS.ADMIN_ADD_PROVIDER
        )
      }
    ],
    [
      {
        text: getMessage(
          MESSAGE_KEYS.ADMIN_PROVIDER_LIST
        )
      }
    ],
    [
      {
        text: getMessage(
          MESSAGE_KEYS.ADMIN_PROVIDER_EDIT
        )
      }
    ],
    [
      {
        text: getMessage(
          MESSAGE_KEYS.ADMIN_PROVIDER_DISABLE
        )
      }
    ],
    [
      {
        text: getMessage(
          MESSAGE_KEYS.ADMIN_PROVIDER_ENABLE
        )
      }
    ],
    [
      {
        text: getMessage(
          MESSAGE_KEYS.ADMIN_PROVIDER_SCHEDULE
        )
      }
    ],
    [
      {
        text: getMessage(
          MESSAGE_KEYS.ADMIN_PROVIDER_OVERRIDES
        )
      }
    ]
  );

  return buildKeyboardWithMainMenu(rows);
}

function processProviderFieldToEdit(chatId, text, settings) {
  const fieldText = String(text || '').trim();

  const allowedFields = {};

  allowedFields[
    getMessage(MESSAGE_KEYS.PROVIDER_FIELD_NAME)
  ] = 'name';

  allowedFields[
    getMessage(MESSAGE_KEYS.PROVIDER_FIELD_LOCATION)
  ] = 'location_id';

  allowedFields[
    getMessage(MESSAGE_KEYS.PROVIDER_FIELD_PHONE)
  ] = 'phone';

  allowedFields[
    getMessage(MESSAGE_KEYS.PROVIDER_FIELD_TELEGRAM_ID)
  ] = 'telegram_id';

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

  setUserSessionValue(
    chatId,
    'edit_provider_field',
    field
  );

  if (field === 'location_id') {
    showProviderEditLocations(chatId, settings);
    return;
  }

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_PROVIDER_NEW_VALUE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_NEW_VALUE),
    buildKeyboardWithMainMenu([])
  );
}

function showProviderEditLocations(
  chatId,
  settings
) {
  const locations =
    getLocations();

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
    ADMIN_STATES.WAITING_PROVIDER_NEW_VALUE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.SELECT_NEW_VALUE
    ),
    buildKeyboardWithMainMenu(
      keyboardRows
    )
  );
}

function processProviderNewValue(
  chatId,
  text,
  settings
) {
  const session =
    getUserSession(chatId);

  const providerId =
    session.edit_provider_id;

  const field =
    session.edit_provider_field;

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
    const location =
      findLocationByName(value);

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

  updateProviderField(
    providerId,
    field,
    value
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.CHANGES_SAVED)
  );

  showProviderEditFields(
    chatId,
    providerId,
    settings
  );
}


function startDisableProvider(chatId, settings) {
  setPreviousMenu(chatId, 'PROVIDERS_MENU');
  const providers = getProviders();
  const keyboardRows = [];

  providers.forEach(function(provider) {
    keyboardRows.push([
      {
        text: provider.name
      }
    ]);
  });

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_PROVIDER_TO_DISABLE
  );

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

  updateProviderField(
    provider.id,
    'active',
    false
  );

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

function showProviderEditFields(
  chatId,
  providerId,
  settings
) {
  setUserSessionValue(
    chatId,
    'edit_provider_id',
    providerId
  );

  setPreviousMenu(
    chatId,
    'PROVIDER_EDIT_FIELDS'
  );

  const keyboard =
    buildKeyboardWithMainMenu([
      [{ text: getMessage(MESSAGE_KEYS.PROVIDER_FIELD_NAME) }],
      [{ text: getMessage(MESSAGE_KEYS.PROVIDER_FIELD_LOCATION) }],
      [{ text: getMessage(MESSAGE_KEYS.PROVIDER_FIELD_PHONE) }],
      [{ text: getMessage(MESSAGE_KEYS.PROVIDER_FIELD_TELEGRAM_ID) }]
    ]);

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_PROVIDER_FIELD_TO_EDIT
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_FIELD_FROM_LIST),
    keyboard
  );
}

function startEnableProvider(chatId, settings) {
  setPreviousMenu(chatId, 'PROVIDERS_MENU');

  const providers = getInactiveProviders();
  const keyboardRows = [];

  providers.forEach(function(provider) {
    keyboardRows.push([
      {
        text: provider.name
      }
    ]);
  });

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_PROVIDER_TO_ENABLE
  );

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

  updateProviderField(
    provider.id,
    'active',
    true
  );

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

function resetProviderWizardSession(chatId) {
  setUserSessionValues(
    chatId,
    {
      provider_name: '',
      provider_location_id: '',
      provider_phone: '',
      provider_telegram_id: '',

      edit_provider_id: '',
      edit_provider_field: '',
      edit_provider_new_value: ''
    }
  );
}
