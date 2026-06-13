function handleClientMessage(message) {
  const settings = getSettings();

  const chatId = message.chat.id;
  const text = message.text || '';
  const state = getUserState(chatId);

  addAuditLog(
  'CLIENT_MESSAGE_DEBUG',
  'text=' + text + ', state=' + state + ', chatId=' + chatId
  );

  if (text === '/start') {
    clearUserSession(chatId);
    setUserState(chatId, '');

    sendClientStartMenu(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.BOOK)) {
    showLocations(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.MY_APPOINTMENTS)) {
    askPhoneForAppointments(chatId, settings);
    return;
  }

  if (state === STATES.WAITING_LOCATION) {
    const location = findLocationByName(text);

    addAuditLog(
      'WAITING_LOCATION_FOUND',
      JSON.stringify(location)
    );

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

    if (messageKey === MESSAGE_KEYS.OTHER_DATE) {
      showCustomDateOptions(chatId, settings);
      return;
    }

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

  if (state === STATES.WAITING_CUSTOM_DATE) {
  const selectedDate = parseCustomDateButton(text);

  if (!selectedDate) {
    showCustomDateOptions(chatId, settings);
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
    const customerPhone = normalizePhone(text);

    if (!isValidPhone(customerPhone)) {
      sendTelegramMessage(
        settings.ClientBotToken,
        chatId,
        getMessage(MESSAGE_KEYS.PHONE_INVALID)
      );

      askCustomerPhone(chatId, settings);
      return;
    }

    setUserSessionValue(chatId, 'customer_phone', customerPhone);

    const session = getUserSession(chatId);
    session.customer_phone = customerPhone;

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

  if (state === STATES.WAITING_MY_APPOINTMENTS_PHONE) {

    addAuditLog(
    'MY_APPOINTMENTS_PHONE',
    text
    );

    const phone = getPhoneSearchKey(text);

    if (!isValidPhone(phone)) {
      sendTelegramMessage(
        settings.ClientBotToken,
        chatId,
        getMessage(MESSAGE_KEYS.PHONE_INVALID)
      );

      askPhoneForAppointments(chatId, settings);ы
      return;
    }

    showMyAppointmentsByPhone(
      chatId,
      settings,
      phone
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
    getMessage(MESSAGE_KEYS.START);

  const keyboard = {
    keyboard: [
      [
        { text: getMessage(MESSAGE_KEYS.BOOK) }
      ],
      [
        { text: getMessage(MESSAGE_KEYS.MY_APPOINTMENTS) }
      ],
      [
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
  addAuditLog(
    'SHOW_TIME_OPTIONS',
    JSON.stringify(getUserSession(chatId))
  );

  setUserState(chatId, STATES.WAITING_OPTION_TIME);

  const session = getUserSession(chatId);

  const durationMinutes = getDefaultServiceDurationMinutes(
    session.service_id
  );

  const slots = getAvailableTimeSlots(
    session.provider_id,
    session.current_option_date,
    durationMinutes
  );

  addAuditLog(
    'AVAILABLE_SLOTS',
    JSON.stringify(slots)
  );

  if (slots.length === 0) {
    setUserState(chatId, STATES.WAITING_OPTION_DATE);

    sendTelegramMessage(
      settings.ClientBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.NO_AVAILABLE_TIME)
    );

    showDateOptions(chatId, settings);
    return;
  }

  const keyboardRows = [];

  for (let i = 0; i < slots.length; i += 2) {
    const row = [
      { text: slots[i] }
    ];

    if (slots[i + 1]) {
      row.push({
        text: slots[i + 1]
      });
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

    addAuditLog(
    'OWNER_CALLBACK',
    JSON.stringify(callbackQuery)
  );

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
    addAuditLog('APPROVE_START', requestId);

    const priority = Number(action.replace('approve_option_', ''));
    addAuditLog('APPROVE_PRIORITY', String(priority));

    const request = getRequestById(requestId);
    addAuditLog('APPROVE_REQUEST', JSON.stringify(request));

    const option = getRequestOptionByPriority(requestId, priority);
    addAuditLog('APPROVE_OPTION', JSON.stringify(option));

    if (!request || !option) {
      sendTelegramMessage(
        settings.ClientBotToken,
        ownerChatId,
        getMessage(MESSAGE_KEYS.UNKNOWN_COMMAND)
      );
      return;
    }

    if (appointmentExistsForRequest(requestId)) {
      addAuditLog('APPROVE_APPOINTMENT_EXISTS', requestId);

      sendTelegramMessage(
        settings.ClientBotToken,
        ownerChatId,
        getMessage(MESSAGE_KEYS.REQUEST_ALREADY_PROCESSED)
      );
      return;
    }

    const appointmentId = createAppointmentFromRequest(request, option);
    addAuditLog('APPROVE_APPOINTMENT_CREATED', appointmentId);

    const calendarEventId = createCalendarEventForAppointment(appointmentId);
    addAuditLog('APPROVE_CALENDAR_CREATED', calendarEventId);

    updateCustomerStatus(request.customer_id, 'confirmed');
    addAuditLog('APPROVE_CUSTOMER_UPDATED', request.customer_id);

    updateRequestStatus(requestId, 'confirmed');
    addAuditLog('APPROVE_REQUEST_UPDATED', requestId);

    updateRequestOptionsAfterApproval(requestId, priority);
    addAuditLog('APPROVE_OPTIONS_UPDATED', requestId);

    const customer = getCustomerById(request.customer_id);
    addAuditLog('APPROVE_CUSTOMER_LOADED', JSON.stringify(customer));

    const originalText = callbackQuery.message.text || '';

    editTelegramMessage(
      settings.ClientBotToken,
      ownerChatId,
      callbackQuery.message.message_id,
      originalText + '\n\n' + getMessage(MESSAGE_KEYS.OWNER_REQUEST_CONFIRMED_STATUS)
    );

    addAuditLog('APPROVE_OWNER_MESSAGE_EDITED', requestId);

    if (customer && customer.telegram_id) {
      sendTelegramMessage(
        settings.ClientBotToken,
        customer.telegram_id,
        getMessage(MESSAGE_KEYS.REQUEST_APPROVED_CLIENT)
      );

      addAuditLog('APPROVE_CLIENT_NOTIFIED', customer.telegram_id);
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

function showCustomDateOptions(chatId, settings) {
  setUserState(chatId, STATES.WAITING_CUSTOM_DATE);

  const keyboardRows = [];
  const today = new Date();

  for (let i = 0; i < 60; i++) {
    const date = addDaysToDate(today, i);

    keyboardRows.push([
      {
        text: formatDateButton(date)
      }
    ]);
  }

  const keyboard = {
    keyboard: keyboardRows,
    resize_keyboard: true
  };

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_CUSTOM_DATE),
    keyboard
  );
}

function askPhoneForAppointments(chatId, settings) {
  setUserState(
    chatId,
    STATES.WAITING_MY_APPOINTMENTS_PHONE
  );

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.ENTER_PHONE_FOR_APPOINTMENTS
    )
  );
}

function askPhoneForAppointments(chatId, settings) {
  setUserState(
    chatId,
    STATES.WAITING_MY_APPOINTMENTS_PHONE
  );

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_PHONE_FOR_APPOINTMENTS)
  );
}

function showMyAppointmentsByPhone(
  chatId,
  settings,
  phone
) {
  addAuditLog(
    'SHOW_MY_APPOINTMENTS',
    phone
  );

  const appointments =
    getActiveAppointmentsByPhone(phone);

  addAuditLog(
    'SHOW_MY_APPOINTMENTS_COUNT',
    String(appointments.length)
  );

  if (appointments.length === 0) {

    setUserState(
      chatId,
      STATES.WAITING_MY_APPOINTMENTS_PHONE
    );

    sendTelegramMessage(
      settings.ClientBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.NO_ACTIVE_APPOINTMENTS
      )
    );

    return;
  }

  let text =
    '<b>' +
    getMessage(
      MESSAGE_KEYS.YOUR_APPOINTMENTS
    ) +
    '</b>\n\n';

  appointments.forEach(function(
    appointment,
    index
  ) {
    const service =
      findServiceById(
        appointment.service_id
      );

    const provider =
      findProviderById(
        appointment.provider_id
      );

    const location =
      findLocationById(
        appointment.location_id
      );

    text +=
      (index + 1) +
      ') ' +
      formatDateTimeForDisplay(
        appointment.start_at
      ) +
      '\n';

    text +=
      '💅 ' +
      (service
        ? service.name
        : appointment.service_id) +
      '\n';

    text +=
      '👩‍💼 ' +
      (provider
        ? provider.name
        : appointment.provider_id) +
      '\n';

    text +=
      '📍 ' +
      (location
        ? location.name
        : appointment.location_id) +
      '\n\n';
  });

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    text
  );

  setUserState(chatId, '');
}