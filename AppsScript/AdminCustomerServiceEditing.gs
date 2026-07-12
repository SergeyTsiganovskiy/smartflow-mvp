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
