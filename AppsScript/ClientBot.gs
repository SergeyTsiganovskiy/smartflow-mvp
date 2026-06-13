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

    showTimeOptions(chatId, settings);
    return;
  }

  if (state === STATES.WAITING_OPTION_TIME) {
    const selectedTime = text.trim();

    if (!isValidTimeOption(selectedTime)) {
      sendTelegramMessage(
        settings.ClientBotToken,
        chatId,
        getMessage(MESSAGE_KEYS.TIME_SELECT_FROM_LIST)
      );
      return;
    }

    const session = getUserSession(chatId);
    const optionCount = Number(session.option_count || 0) + 1;

    setUserSessionValue(chatId, 'current_option_time', selectedTime);
    setUserSessionValue(chatId, 'option_count', optionCount);

    setUserSessionValue(
      chatId,
      'option' + optionCount + '_date',
      session.current_option_date
    );

    setUserSessionValue(
      chatId,
      'option' + optionCount + '_time',
      selectedTime
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

    const session = getUserSession(chatId);
    const requestId = finalizeRequestFromSession(session);

    notifyOwnerAboutRequestFromSession(session, requestId);

    sendTelegramMessage(
      settings.ClientBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.REQUEST_CREATED)
    );

    clearUserSession(chatId);
    setUserState(chatId, '');

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
    getMessage(MESSAGE_KEYS.START);

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

function showTimeOptions(chatId, settings) {
  setUserState(chatId, STATES.WAITING_OPTION_TIME);

  const times = [
    '07:00', '07:30',
    '08:00', '08:30',
    '09:00', '09:30',
    '10:00', '10:30',
    '11:00', '11:30',
    '12:00', '12:30',
    '13:00', '13:30',
    '14:00', '14:30',
    '15:00', '15:30',
    '16:00', '16:30',
    '17:00', '17:30',
    '18:00', '18:30',
    '19:00', '19:30',
    '20:00'
  ];

  const keyboardRows = [];

  for (let i = 0; i < times.length; i += 2) {
    const row = [{ text: times[i] }];

    if (times[i + 1]) {
      row.push({ text: times[i + 1] });
    }

    keyboardRows.push(row);
  }

  const keyboard = {
    keyboard: keyboardRows,
    resize_keyboard: true
  };

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_TIME),
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

function notifyOwnerAboutRequestFromSession(session, requestId) {
  const settings = getSettings();

  const location = findLocationById(session.location_id);
  const service = findServiceById(session.service_id);
  const provider = findProviderById(session.provider_id);

  let text =
    '<b>' +
    getMessage(MESSAGE_KEYS.NEW_REQUEST_OWNER_TITLE) +
    '</b>\n\n';

  text +=
    '👤 ' +
    getMessage(MESSAGE_KEYS.OWNER_CUSTOMER) +
    ': ' +
    session.customer_name +
    '\n';

  text +=
    '📞 ' +
    getMessage(MESSAGE_KEYS.OWNER_PHONE) +
    ': ' +
    session.customer_phone +
    '\n\n';

  text +=
    '📍 ' +
    getMessage(MESSAGE_KEYS.OWNER_LOCATION) +
    ': ' +
    (location ? location.name : session.location_id) +
    '\n';

  text +=
    '💅 ' +
    getMessage(MESSAGE_KEYS.OWNER_SERVICE) +
    ': ' +
    (service ? service.name : session.service_id) +
    '\n';

  text +=
    '👩‍💼 ' +
    getMessage(MESSAGE_KEYS.OWNER_PROVIDER) +
    ': ' +
    (provider ? provider.name : session.provider_id) +
    '\n\n';

  text +=
    '<b>' +
    getMessage(MESSAGE_KEYS.OWNER_TIME_OPTIONS) +
    ':</b>\n';

  for (let i = 1; i <= 3; i++) {
    const date = session['option' + i + '_date'];
    const time = session['option' + i + '_time'];

    if (date && time) {
      text +=
        i +
        ') ' +
        formatDateForDisplay(date) +
        ' ' +
        formatTimeForDisplay(time) +
        '\n';
    }
  }

  const approveButtons = [];

  for (let i = 1; i <= 3; i++) {
    const date = session['option' + i + '_date'];
    const time = session['option' + i + '_time'];

    if (date && time) {
      approveButtons.push({
        text: '✅ ' + i,
        callback_data: 'approve_option_' + i + '|' + requestId
      });
    }
  }

  const inlineKeyboard = [];

  if (approveButtons.length > 0) {
    inlineKeyboard.push(approveButtons);
  }

  inlineKeyboard.push([
    {
      text: '❌ Reject',
      callback_data: 'reject_request|' + requestId
    }
  ]);

  sendTelegramMessageWithInlineKeyboard(
    settings.ClientBotToken,
    settings.OwnerTelegramId,
    text,
    inlineKeyboard
  );
}

function handleOwnerCallback(callbackQuery) {
  const settings = getSettings();

  const data = callbackQuery.data;
  const ownerChatId = callbackQuery.message.chat.id;

  const parts = data.split('|');
  const action = parts[0];
  const requestId = parts[1];

  if (isRequestAlreadyProcessed(requestId)) {
  sendTelegramMessage(
    settings.ClientBotToken,
    ownerChatId,
    getMessage(MESSAGE_KEYS.REQUEST_ALREADY_PROCESSED)
  );
  return;
  }

  if (action.indexOf('approve_option_') === 0) {
    const priority = Number(action.replace('approve_option_', ''));

    const request = getRequestById(requestId);
    const option = getRequestOptionByPriority(requestId, priority);

    if (!request || !option) {
      sendTelegramMessage(
        settings.ClientBotToken,
        ownerChatId,
        getMessage(MESSAGE_KEYS.UNKNOWN_COMMAND)
      );
      return;
    }

    createAppointmentFromRequest(request, option);
    updateCustomerStatus(request.customer_id, 'confirmed');
    updateRequestStatus(requestId, 'confirmed');
    updateRequestOptionsAfterApproval(requestId, priority);

    const customer = getCustomerById(request.customer_id);

    const originalText = callbackQuery.message.text || '';

    editTelegramMessage(
      settings.ClientBotToken,
      ownerChatId,
      callbackQuery.message.message_id,
      originalText + '\n\n' + getMessage(MESSAGE_KEYS.OWNER_REQUEST_CONFIRMED_STATUS)
    );

    if (customer && customer.telegram_id) {
      sendTelegramMessage(
        settings.ClientBotToken,
        customer.telegram_id,
        getMessage(MESSAGE_KEYS.REQUEST_APPROVED_CLIENT)
      );
    }

    return;
  }

  if (action === 'reject_request') {
    updateRequestStatus(requestId, 'rejected');
    updateRequestOptionsAfterApproval(requestId, 0);

    const request = getRequestById(requestId);
    const customer = request ? getCustomerById(request.customer_id) : null;

    const originalText = callbackQuery.message.text || '';

    editTelegramMessage(
      settings.ClientBotToken,
      ownerChatId,
      callbackQuery.message.message_id,
      originalText + '\n\n' + getMessage(MESSAGE_KEYS.OWNER_REQUEST_REJECTED_STATUS)
    );

    if (customer && customer.telegram_id) {
      sendTelegramMessage(
        settings.ClientBotToken,
        customer.telegram_id,
        getMessage(MESSAGE_KEYS.REQUEST_REJECTED_CLIENT)
      );
    }

    return;
  }
}