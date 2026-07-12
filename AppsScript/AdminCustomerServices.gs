
function startCustomerServices(chatId, settings) {
  navigateAdmin(
    chatId,
    ADMIN_MENUS.SERVICES,
    ADMIN_STATES.WAITING_CUSTOMER_SERVICE_PHONE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_CUSTOMER_PHONE),
    buildKeyboardWithMainMenu([])
  );
}

function processCustomerServicePhone(chatId, text, settings) {
  const phone =
    normalizePhone(text);

  const customer =
    getCustomerByPhone(phone);

  const profile =
    findCustomerProfileByPhone(phone);

  if (!profile || profile.active === false) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.CUSTOMER_NOT_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValues(
    chatId,
    {
      customer_service_customer_id:
        customer ? customer.customer_id : '',

      customer_service_phone:
        profile.phone
    }
  );

  showCustomerServices(
    chatId,
    profile,
    settings
  );
}

function showCustomerServices(chatId, customer, settings) {
  setUserState(chatId, '');
  setPreviousMenu(chatId, 'SERVICES_MENU');

  const customerSettings =
    getCustomerServiceSettingsByPhone(
      customer.phone
  );

  let text =
    '<b>' +
    getMessage(MESSAGE_KEYS.CUSTOMER_SERVICES_TITLE) +
    '</b>\n\n';

  text +=
    customer.name +
    '\n';

  text +=
    customer.phone +
    '\n\n';

  if (customerSettings.length === 0) {
    text +=
      getMessage(MESSAGE_KEYS.NO_CUSTOMER_SERVICE_SETTINGS) +
      '\n';
  } else {
    customerSettings.forEach(function(setting, index) {
      text +=
        String(index + 1) +
        '. <b>' +
        (setting.service_name || setting.service_id) +
        '</b>\n';

      text +=
        getMessage(MESSAGE_KEYS.CUSTOM_PRICE_LABEL) +
        ': ' +
        setting.price +
        '\n';

      text +=
        getMessage(MESSAGE_KEYS.CUSTOM_DURATION_LABEL) +
        ': ' +
        setting.duration_minutes +
        ' ' +
        getMessage(MESSAGE_KEYS.MINUTES_SHORT) +
        '\n';

      if (setting.provider_name) {
        text +=
          '👩‍💼 ' +
          setting.provider_name +
          '\n';
      }

      if (setting.notes) {
        text +=
          setting.notes +
          '\n';
      }

      text += '\n';
    });
  }

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    text,
    buildKeyboardWithMainMenu([
      [{ text: getMessage(MESSAGE_KEYS.EDIT_CUSTOMER_SERVICE) }],
      [{ text: getMessage(MESSAGE_KEYS.DELETE_CUSTOMER_SERVICE) }]
    ])
  );
}

function startEditCustomerService(chatId, settings) {
  const session =
    getUserSession(chatId);

  const phone =
    session.customer_service_phone;

  if (!phone) {
    startCustomerServices(
      chatId,
      settings
    );

    return;
  }

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
    ADMIN_STATES.WAITING_CUSTOMER_SERVICE_TO_EDIT
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_CUSTOMER_SERVICE),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processCustomerServiceToEdit(chatId, text, settings) {
  const service = findServiceByName(text);

  if (!service) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SELECT_CUSTOMER_SERVICE),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValues(
    chatId,
    {
      customer_service_service_id: service.service_id,
      customer_service_service_name: service.name
    }
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_CUSTOMER_SERVICE_PRICE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_CUSTOM_PRICE),
    buildKeyboardWithMainMenu([])
  );
}

function processCustomerServicePrice(chatId, text, settings) {
  const price = Number(String(text || '').trim());

  if (!price || price < 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.ENTER_CUSTOM_PRICE),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'customer_service_price',
    price
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_CUSTOMER_SERVICE_DURATION
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_CUSTOM_DURATION),
    buildKeyboardWithMainMenu([])
  );
}

function processCustomerServiceDuration(chatId, text, settings) {
  const duration = Number(String(text || '').trim());

  if (!duration || duration <= 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.ENTER_CUSTOM_DURATION),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  const session =
    getUserSession(chatId);

  const phone =
    session.customer_service_phone;

  if (!phone) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.CUSTOMER_NOT_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  const profile =
    findCustomerProfileByPhone(phone);

  if (!profile || profile.active === false) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.CUSTOMER_NOT_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  const service =
    findServiceById(
      session.customer_service_service_id
    );

  upsertCustomerServiceSetting({
    profile_id: profile.profile_id,
    phone: profile.phone,
    customer_name: profile.name,
    service_id: service.service_id,
    service_name: service.name,
    duration_minutes: duration,
    price: session.customer_service_price,
    notes: ''
  });

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.CUSTOMER_SERVICE_UPDATED)
  );

  showCustomerServices(
    chatId,
    profile,
    settings
  );
}

function startDeleteCustomerService(chatId, settings) {
  const session = getUserSession(chatId);

  const customerId =
    session.customer_service_customer_id;

  if (!customerId) {
    startCustomerServices(chatId, settings);
    return;
  }

  const phone =
    session.customer_service_phone;

  const settingsList =
    getCustomerServiceSettingsByPhone(phone);

  const keyboardRows = [];

  settingsList.forEach(function(item) {
    keyboardRows.push([
      {
        text: item.service_name || item.service_id
      }
    ]);
  });

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_CUSTOMER_SERVICE_TO_DELETE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_CUSTOMER_SERVICE),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processCustomerServiceToDelete(chatId, text, settings) {
  const session =
    getUserSession(chatId);

  const phone =
    session.customer_service_phone;

  const settingsList =
    getCustomerServiceSettingsByPhone(phone);

  const selected =
    settingsList.find(function(item) {
      return String(item.service_name || item.service_id).trim() ===
        String(text || '').trim();
    });

  if (!selected) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SELECT_CUSTOMER_SERVICE),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  deleteCustomerServiceSettingByPhone(
    phone,
    selected.service_id
  );

  const profile =
    findCustomerProfileByPhone(phone);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.CUSTOMER_SERVICE_DELETED)
  );

  showCustomerServices(
    chatId,
    profile,
    settings
  );
}
