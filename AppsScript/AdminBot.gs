function sendAdminMainMenu(chatId, settings) {
  const keyboard = {
    keyboard: [
      [{ text: getMessage(MESSAGE_KEYS.ADMIN_PROVIDERS) }],
      [{ text: getMessage(MESSAGE_KEYS.ADMIN_SERVICES) }],
      [{ text: getMessage(MESSAGE_KEYS.ADMIN_SCHEDULES) }],
      [{ text: getMessage(MESSAGE_KEYS.ADMIN_CUSTOMERS) }],
      [{ text: getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS) }],
      [{ text: getMessage(MESSAGE_KEYS.ADMIN_SETTINGS) }]
    ],
    resize_keyboard: true
  };

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ADMIN_MAIN_MENU),
    keyboard
  );
}

function handleAdminMessage(message) {

  addAuditLog(
  'HANDLE_ADMIN_MESSAGE',
  JSON.stringify({
    chatId: message.chat.id,
    text: message.text || ''
  })
);

  const settings = getSettings();

  const chatId = message.chat.id;
  const text = message.text || '';
  const state = String(getUserState(chatId) || '').trim();

  if (!isAdminUser(chatId)) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.ADMIN_ACCESS_DENIED)
    );
    return;
  }

  if (text === '/start') {
    clearUserSession(chatId);
    setUserState(chatId, '');

    sendAdminMainMenu(chatId, settings);
    return;
  }

  if (
    text === getMessage(MESSAGE_KEYS.MAIN_MENU)
  ) {
    clearUserSession(chatId);
    setUserState(chatId, '');

    sendAdminMainMenu(chatId, settings);
    return;
  }

  if (
    text === getMessage(MESSAGE_KEYS.ADMIN_PROVIDERS)
  ) {
    sendProvidersMenu(chatId, settings);
    return;
  }

  if (
    text === getMessage(MESSAGE_KEYS.ADMIN_ADD_PROVIDER)
  ) {
    clearUserSession(chatId);

    startCreateProvider(chatId, settings);
    return;
  }

  if (
    text === getMessage(MESSAGE_KEYS.ADMIN_PROVIDER_LIST)
  ) {
    showProvidersListAdmin(chatId, settings);
    return;
  }

  if (
    text === getMessage( MESSAGE_KEYS.ADMIN_PROVIDER_EDIT)
  ) {
    startEditProvider(
      chatId,
      settings
    );

    return;
  }

  if (state === ADMIN_STATES.WAITING_PROVIDER_TO_EDIT) 
  {
    processProviderToEdit(
      chatId,
      text,
      settings
    );

    return;
  }

  if (state ===  ADMIN_STATES.WAITING_PROVIDER_FIELD_TO_EDIT ) {
    processProviderFieldToEdit(
      chatId,
      text,
      settings
    );

    return;
  }

  if (state === ADMIN_STATES.WAITING_PROVIDER_NEW_VALUE) {
    processProviderNewValue(
      chatId,
      text,
      settings
    );

    return;
  }

  if (state === ADMIN_STATES.WAITING_PROVIDER_TO_DISABLE) {
    processProviderToDisable(chatId, text, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_PROVIDER_DISABLE)) {
    startDisableProvider(chatId, settings);
    return;
  }

  if (
    state === ADMIN_STATES.WAITING_PROVIDER_NAME
  ) {
    processProviderName(
      chatId,
      text,
      settings
    );
    return;
  }

  if (
    state === ADMIN_STATES.WAITING_PROVIDER_LOCATION
  ) {
    processProviderLocation(
      chatId,
      text,
      settings
    );
    return;
  }

  if (
    state === ADMIN_STATES.WAITING_PROVIDER_PHONE
  ) {
    processProviderPhone(
      chatId,
      text,
      settings
    );
    return;
  }

  if (
    state === ADMIN_STATES.WAITING_PROVIDER_TELEGRAM_ID
  ) {
    processProviderTelegramId(
      chatId,
      text,
      settings
    );
    return;
  }

  if (
    text === getMessage(MESSAGE_KEYS.ADMIN_PROVIDER_LIST)
  ) {
    showProvidersListAdmin(chatId, settings);
    return;
  }

  sendAdminMainMenu(chatId, settings);
}

function isAdminUser(chatId) {
  const settings = getSettings();

  const ids =
    String(settings.AdminTelegramIds || '')
      .split(',')
      .map(function(item) {
        return String(item).trim();
      });

  return ids.indexOf(String(chatId)) !== -1;
}

function sendProvidersMenu(chatId, settings) {
  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ADMIN_PROVIDERS),
    buildProvidersMenuKeyboard()
  );
}

function startCreateProvider(
  chatId,
  settings
) {
  setUserState(
    chatId,
    ADMIN_STATES.WAITING_PROVIDER_NAME
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.ENTER_PROVIDER_NAME
    )
  );
}

function processProviderName(
  chatId,
  providerName,
  settings
) {
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

function showProviderLocations(
  chatId,
  settings
) {
  setUserState(
    chatId,
    ADMIN_STATES.WAITING_PROVIDER_LOCATION
  );

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

  const keyboard = {
    keyboard: keyboardRows,
    resize_keyboard: true
  };

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.SELECT_PROVIDER_LOCATION
    ),
    keyboard
  );
}

function startCreateProvider(chatId, settings) {
  setUserState(
    chatId,
    ADMIN_STATES.WAITING_PROVIDER_NAME
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_PROVIDER_NAME)
  );
}

function processProviderName(chatId, text, settings) {
  const providerName = String(text || '').trim();

  if (!providerName) {
    startCreateProvider(chatId, settings);
    return;
  }

  setUserSessionValue(
    chatId,
    'provider_name',
    providerName
  );

  showProviderLocations(chatId, settings);
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

function processProviderLocation(chatId, text, settings) {
  const location = findLocationByName(text);

  if (!location) {
    showProviderLocations(chatId, settings);
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
    getMessage(MESSAGE_KEYS.ENTER_PROVIDER_PHONE)
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
}

function processProviderTelegramId(chatId, text, settings) {
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
    createProviderFromAdminSession(session);

  clearUserSession(chatId);
  setUserState(chatId, '');

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.PROVIDER_CREATED) +
      '\n\nID: ' +
      providerId
  );

  sendProvidersMenu(chatId, settings);
}

function showProvidersListAdmin(chatId, settings) {
  const providers = getProviders();

  if (providers.length === 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      'Мастеров пока нет.',
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  let text = '<b>👩‍💼 Мастера</b>\n\n';

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
    buildProvidersMenuKeyboard()
  );
}

function startEditProvider(
  chatId,
  settings
) {
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
    'Выберите мастера',
    keyboard
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
      'Выберите мастера из списка'
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'edit_provider_id',
    provider.id
  );

  const keyboard =
    buildKeyboardWithMainMenu([
      [
        {
          text: 'Имя'
        }
      ],
      [
        {
          text: 'Филиал'
        }
      ],
      [
        {
          text: 'Телефон'
        }
      ],
      [
        {
          text: 'Telegram ID'
        }
      ]
    ]);

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_PROVIDER_FIELD_TO_EDIT
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    'Что изменить?',
    keyboard
  );
}

function buildProvidersMenuKeyboard() {
  return buildKeyboardWithMainMenu([
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
    ]
  ]);
}

function processProviderFieldToEdit(chatId, text, settings) {
  const fieldText = String(text || '').trim();

  const allowedFields = {
    'Имя': 'name',
    'Филиал': 'location_id',
    'Телефон': 'phone',
    'Telegram ID': 'telegram_id'
  };

  const field = allowedFields[fieldText];

  if (!field) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      'Выберите поле из списка',
      buildProvidersMenuKeyboard()
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
    'Введите новое значение',
    buildKeyboardWithMainMenu([])
  );
}

function showProviderEditLocations(chatId, settings) {
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
    ADMIN_STATES.WAITING_PROVIDER_NEW_VALUE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    'Выберите новый филиал',
    buildKeyboardWithMainMenu(keyboardRows)
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
      'Ошибка редактирования'
    );

    sendProvidersMenu(
      chatId,
      settings
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
        'Выберите филиал из списка'
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

  clearUserSession(chatId);

  setUserState(chatId, '');

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    '✅ Изменения сохранены'
  );

  sendProvidersMenu(
    chatId,
    settings
  );
}

function updateProviderField(
  providerId,
  field,
  value
) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('Providers');

  const rows =
    sheet.getDataRange().getValues();

  const headers = rows[0];

  const providerIdIndex =
    headers.indexOf('provider_id');

  for (let i = 1; i < rows.length; i++) {
    if (
      String(rows[i][providerIdIndex]) !==
      String(providerId)
    ) {
      continue;
    }

    const provider = {};

    headers.forEach(function(header, index) {
      provider[header] =
        rows[i][index];
    });

    if (field === 'name') {
      createOrUpdateMessageValues(
        provider.name_key,
        createMessageValuesForAllLanguages(
          value
        )
      );

      return;
    }

    const fieldIndex =
      headers.indexOf(field);

    if (fieldIndex === -1) {
      throw new Error(
        'Field not found: ' +
        field
      );
    }

    sheet
      .getRange(
        i + 1,
        fieldIndex + 1
      )
      .setValue(value);

    return;
  }

  throw new Error(
    'Provider not found: ' +
    providerId
  );
}

function startDisableProvider(chatId, settings) {
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
    'Выберите мастера для отключения',
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processProviderToDisable(chatId, text, settings) {
  const provider = findProviderByName(text);

  if (!provider) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      'Выберите мастера из списка'
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

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    '✅ Мастер отключён'
  );

  sendProvidersMenu(chatId, settings);
}
