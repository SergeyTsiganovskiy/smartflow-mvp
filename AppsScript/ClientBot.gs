function handleClientMessage(message) {
  const settings = getSettings();

  const chatId = message.chat.id;
  const text = message.text || '';
  const state = getUserState(chatId);

  if (text === '/start') {
    sendClientStartMenu(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.BOOK)) {
    showLocations(chatId, settings);
    return;
  }

  if (state === STATES.WAITING_LOCATION) {
    const location = findLocationByName(text);

    if (!location) {
      sendTelegramMessage(
        settings.ClientBotToken,
        chatId,
        getMessage(MESSAGE_KEYS.LOCATION_SELECT_FROM_LIST)
      );
      return;
    }

    setUserSessionValue(chatId, 'location_id', location.id);
    setUserState(chatId, STATES.WAITING_SERVICE);

    showServices(chatId, settings);
    return;
  }

  if (state === STATES.WAITING_SERVICE) {
    const service = findServiceByName(text);

    if (!service) {
      sendTelegramMessage(
        settings.ClientBotToken,
        chatId,
        getMessage(MESSAGE_KEYS.SERVICE_SELECT_FROM_LIST)
      );
      return;
    }

    setUserSessionValue(chatId, 'service_id', service.id);
    setUserState(chatId, STATES.WAITING_PROVIDER);

    showProviders(chatId, settings);
    return;
  }

  if (state === STATES.WAITING_PROVIDER) {
    const provider = findProviderByName(text);

    if (!provider) {
      sendTelegramMessage(
        settings.ClientBotToken,
        chatId,
        getMessage(MESSAGE_KEYS.PROVIDER_SELECT_FROM_LIST)
      );
      return;
    }

    setUserSessionValue(
      chatId,
      'provider_id',
      provider.id
    );

    clearUserSessionOptions(chatId);

    showDateOptions(chatId, settings);
    return;
  }

  if (state === STATES.WAITING_OPTION_DATE) {
    const messageKey = getMessageKeyByText(text);
    const selectedDate = getRelativeDateByMessageKey(messageKey);

    if (!selectedDate) {
      sendTelegramMessage(
        settings.ClientBotToken,
        chatId,
        getMessage(MESSAGE_KEYS.DATE_SELECT_FROM_LIST)
      );
      return;
    }

    setUserSessionValue(chatId, 'current_option_date', selectedDate);

    showPeriodOptions(chatId, settings);
    return;
  }

  if (state === STATES.WAITING_OPTION_PERIOD) {
    const messageKey = getMessageKeyByText(text);

    if (
      messageKey !== MESSAGE_KEYS.MORNING &&
      messageKey !== MESSAGE_KEYS.AFTERNOON &&
      messageKey !== MESSAGE_KEYS.EVENING
    ) {
      sendTelegramMessage(
        settings.ClientBotToken,
        chatId,
        getMessage(MESSAGE_KEYS.PERIOD_SELECT_FROM_LIST)
      );
      return;
    }

    const session = getUserSession(chatId);
    const optionCount = Number(session.option_count || 0) + 1;

    setUserSessionValue(chatId, 'current_option_period', messageKey);
    setUserSessionValue(chatId, 'option_count', optionCount);

    setUserSessionValue(
      chatId,
      'option' + optionCount + '_date',
      session.current_option_date
    );

    setUserSessionValue(
      chatId,
      'option' + optionCount + '_period',
      messageKey
    );

    showAddAnotherOption(chatId, settings);
    return;
  }

  if (state === STATES.WAITING_ADD_ANOTHER_OPTION) {
    const messageKey = getMessageKeyByText(text);

    if (messageKey === MESSAGE_KEYS.YES) {
      const session = getUserSession(chatId);

      if (Number(session.option_count) >= 3) {
        askCustomerName(chatId, settings);
        return;
      }

      showDateOptions(chatId, settings);
      return;
    }

    if (messageKey === MESSAGE_KEYS.NO_CONTINUE) {
      askCustomerName(chatId, settings);
      return;
    }

    sendTelegramMessage(
      settings.ClientBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.UNKNOWN_COMMAND)
    );
    return;
  }

  if (state === STATES.WAITING_CUSTOMER_NAME) {
    const customerName = text.trim();

    if (!customerName) {
      askCustomerName(chatId, settings);
      return;
    }

    setUserSessionValue(chatId, 'customer_name', customerName);

    askCustomerPhone(chatId, settings);
    return;
  }

  if (state === STATES.WAITING_CUSTOMER_PHONE) {
    const customerPhone = text.trim();

    if (!customerPhone) {
      askCustomerPhone(chatId, settings);
      return;
    }

    setUserSessionValue(chatId, 'customer_phone', customerPhone);

    const requestId = finalizeRequest(chatId);

    notifyOwnerAboutRequest(chatId, requestId);

    sendTelegramMessage(
      settings.ClientBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.REQUEST_CREATED)
    );

    return;
  }

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.UNKNOWN_COMMAND)
  );
}

function sendClientStartMenu(chatId, settings) {
  const text =
    getMessage(MESSAGE_KEYS.START) + '\n\n' +
    getMessage(MESSAGE_KEYS.BOOK) + ' / ' +
    getMessage(MESSAGE_KEYS.SERVICES) + ' / ' +
    getMessage(MESSAGE_KEYS.PRICES) + ' / ' +
    getMessage(MESSAGE_KEYS.CONTACTS);

  const keyboard = {
    keyboard: [
      [
        { text: getMessage(MESSAGE_KEYS.BOOK) },
        { text: getMessage(MESSAGE_KEYS.SERVICES) }
      ],
      [
        { text: getMessage(MESSAGE_KEYS.PRICES) },
        { text: getMessage(MESSAGE_KEYS.CONTACTS) }
      ]
    ],
    resize_keyboard: true
  };

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    text,
    keyboard
  );
}

function showLocations(chatId, settings) {
  setUserState(chatId, STATES.WAITING_LOCATION);

  const locations = getLocations();
  const keyboardRows = [];

  locations.forEach(location => {
    keyboardRows.push([{ text: location.name }]);
  });

  const keyboard = {
    keyboard: keyboardRows,
    resize_keyboard: true
  };

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_LOCATION),
    keyboard
  );
}

function showServices(chatId, settings) {
  setUserState(chatId, STATES.WAITING_SERVICE);

  const services = getServices();
  const keyboardRows = [];

  services.forEach(service => {
    keyboardRows.push([{ text: service.name }]);
  });

  const keyboard = {
    keyboard: keyboardRows,
    resize_keyboard: true
  };

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_SERVICE),
    keyboard
  );
}

function showProviders(chatId, settings) {
  const session = getUserSession(chatId);

  if (!session || !session.location_id) {
    sendTelegramMessage(
      settings.ClientBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SESSION_LOCATION_NOT_FOUND)
    );
    return;
  }

  setUserState(chatId, STATES.WAITING_PROVIDER);

  const providers = getProvidersByLocation(session.location_id);
  const keyboardRows = [];

  providers.forEach(provider => {
    keyboardRows.push([{ text: provider.name }]);
  });

  keyboardRows.push([{ text: getMessage(MESSAGE_KEYS.ANY_PROVIDER) }]);

  const keyboard = {
    keyboard: keyboardRows,
    resize_keyboard: true
  };

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_PROVIDER),
    keyboard
  );
}

function showDateOptions(chatId, settings) {
  setUserState(chatId, STATES.WAITING_OPTION_DATE);

  const keyboard = {
    keyboard: [
      [
        { text: getMessage(MESSAGE_KEYS.TODAY) },
        { text: getMessage(MESSAGE_KEYS.TOMORROW) }
      ],
      [{ text: getMessage(MESSAGE_KEYS.DAY_AFTER_TOMORROW) }],
      [{ text: getMessage(MESSAGE_KEYS.OTHER_DATE) }]
    ],
    resize_keyboard: true
  };

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_DATE),
    keyboard
  );
}

function showPeriodOptions(chatId, settings) {
  setUserState(chatId, STATES.WAITING_OPTION_PERIOD);

  const keyboard = {
    keyboard: [
      [{ text: getMessage(MESSAGE_KEYS.MORNING) }],
      [{ text: getMessage(MESSAGE_KEYS.AFTERNOON) }],
      [{ text: getMessage(MESSAGE_KEYS.EVENING) }]
    ],
    resize_keyboard: true
  };

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_PERIOD),
    keyboard
  );
}

function showAddAnotherOption(chatId, settings) {
  setUserState(chatId, STATES.WAITING_ADD_ANOTHER_OPTION);

  const keyboard = {
    keyboard: [
      [{ text: getMessage(MESSAGE_KEYS.YES) }],
      [{ text: getMessage(MESSAGE_KEYS.NO_CONTINUE) }]
    ],
    resize_keyboard: true
  };

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ADD_ANOTHER_OPTION),
    keyboard
  );
}

function askCustomerName(chatId, settings) {
  setUserState(chatId, STATES.WAITING_CUSTOMER_NAME);

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_NAME)
  );
}

function askCustomerPhone(chatId, settings) {
  setUserState(chatId, STATES.WAITING_CUSTOMER_PHONE);

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_PHONE)
  );
}

function notifyOwnerAboutRequest(chatId, requestId) {
  const settings = getSettings();
  const session = getUserSession(chatId);

  const location = findLocationById(session.location_id);
  const service = findServiceById(session.service_id);
  const provider = findProviderById(session.provider_id);

  let text = '<b>' + getMessage(MESSAGE_KEYS.NEW_REQUEST_OWNER_TITLE) + '</b>\n\n';

  text += '🆔 ' + requestId + '\n\n';

  text += '👤 Клиент: ' + session.customer_name + '\n';
  text += '📞 Телефон: ' + session.customer_phone + '\n\n';

  text += '📍 Филиал: ' + (location ? location.name : session.location_id) + '\n';
  text += '💅 Услуга: ' + (service ? service.name : session.service_id) + '\n';
  text += '👩‍💼 Мастер: ' + (provider ? provider.name : session.provider_id) + '\n\n';

  text += '<b>Варианты времени:</b>\n';

  for (let i = 1; i <= 3; i++) {
    const date = session['option' + i + '_date'];
    const period = session['option' + i + '_period'];

    if (date && period) {
      text +=
        i + ') ' +
        formatDateForDisplay(date) +
        ' — ' +
        formatPeriodForDisplay(period) +
        '\n';
    }
  }

  sendTelegramMessage(
    settings.ClientBotToken,
    settings.OwnerTelegramId,
    text
  );
}