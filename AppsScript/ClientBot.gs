function handleClientMessage(message) {
  const settings = getSettings();

  const chatId = message.chat.id;
  const text = message.text || '';
  const state = String(getUserState(chatId) || '').trim();

  addAuditLog(
    'STATE_DEBUG_STRICT',
    'text=' + text + ', state=[' + state + '], length=' + state.length
  );

  if (
    text === '/start' ||
    text === getMessage(MESSAGE_KEYS.MAIN_MENU)
  ) {
    clearUserSession(chatId);
    setUserState(chatId, '');

    sendClientStartMenu(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.CONTACTS)) {
    showContacts(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.BOOK)) {
    clearUserSession(chatId);
    askCustomerName(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.MY_APPOINTMENTS)) {
    askPhoneForAppointments(chatId, settings);
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

    setUserSessionValue(
      chatId,
      'customer_phone',
      customerPhone
    );

    const existingCustomer =
      getCustomerByPhone(customerPhone);

    if (existingCustomer && existingCustomer.customer_id) {
      setUserSessionValue(
        chatId,
        'customer_id',
        existingCustomer.customer_id
      );
    }

    showLocations(chatId, settings);
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
        askCustomerNote(chatId, settings);
        return;
      }

      showDateOptions(chatId, settings);
      return;
    }

    if (messageKey === MESSAGE_KEYS.NO_CONTINUE) {
      askCustomerNote(chatId, settings);
      return;
    }

    sendTelegramMessage(
      settings.ClientBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.UNKNOWN_COMMAND)
    );
    return;
  }

  if (state === STATES.WAITING_CUSTOMER_NOTE) {
    let customerNote = text.trim();

    if (
      customerNote === '-' ||
      customerNote === '—'
    ) {
      customerNote = '';
    }

    setUserSessionValue(
      chatId,
      'customer_note',
      customerNote
    );

    const session = getUserSession(chatId);
    session.customer_note = customerNote;

    const requestId =
      finalizeRequestFromSession(session);

    notifyOwnerAboutRequestFromSession(
      session,
      requestId
    );

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

      askPhoneForAppointments(chatId, settings);
      return;
    }

    showMyAppointmentsByPhone(
      chatId,
      settings,
      phone
    );

    return;
  }

  if (state === 'WAITING_RESCHEDULE_CUSTOM_DATE') {
    addAuditLog('RESCHEDULE_CUSTOM_DATE_BLOCK', text);

    const selectedDate = parseCustomDateButton(text);

    addAuditLog('RESCHEDULE_CUSTOM_DATE_PARSED', selectedDate);

    if (!selectedDate) {
      showRescheduleCustomDateOptions(chatId, settings);
      return;
    }

    setUserSessionValue(
      chatId,
      'reschedule_date',
      selectedDate
    );

    showRescheduleTimeOptions(chatId, settings);
    return;
  }

  if (state === STATES.WAITING_RESCHEDULE_DATE) {
    const messageKey = getMessageKeyByText(text);

    if (messageKey === MESSAGE_KEYS.OTHER_DATE) {
      showRescheduleCustomDateOptions(chatId, settings);
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

    setUserSessionValue(
      chatId,
      'reschedule_date',
      selectedDate
    );

    showRescheduleTimeOptions(chatId, settings);
    return;
  }

  if (state === STATES.WAITING_RESCHEDULE_TIME) {
    const selectedTime = text.trim();

    addAuditLog('RESCHEDULE_TIME_SELECTED', selectedTime);

    if (!isValidTimeOption(selectedTime)) {
      sendTelegramMessage(
        settings.ClientBotToken,
        chatId,
        getMessage(MESSAGE_KEYS.TIME_SELECT_FROM_LIST)
      );
      return;
    }

    const session = getUserSession(chatId);

    addAuditLog(
      'RESCHEDULE_TIME_SESSION_CHECK',
      JSON.stringify(session)
    );

    const startAt = buildDateTime(
      session.reschedule_date,
      selectedTime
    );

    if (session.pending_calendar_event_id) {
      const calendarEventId =
        session.pending_calendar_event_id;

      const updated =
        updateCalendarEventDateTimeById(
          calendarEventId,
          startAt
        );

      addAuditLog(
        'CALENDAR_EVENT_RESCHEDULE_RESULT',
        String(updated)
      );

      if (!updated) {
        sendTelegramMessage(
          settings.ClientBotToken,
          chatId,
          getMessage(MESSAGE_KEYS.UNKNOWN_COMMAND)
        );

        return;
      }

      sendTelegramMessage(
        settings.ClientBotToken,
        chatId,
        getMessage(MESSAGE_KEYS.APPOINTMENT_RESCHEDULED_CLIENT)
      );

      setUserSessionValue(
        chatId,
        'pending_calendar_event_id',
        ''
      );

      clearUserSession(chatId);
      setUserState(chatId, '');

      return;
    }

    const appointment = getAppointmentById(
      session.reschedule_appointment_id
    );

    addAuditLog(
      'RESCHEDULE_APPOINTMENT',
      JSON.stringify(appointment)
    );

    if (!appointment) {
      sendTelegramMessage(
        settings.ClientBotToken,
        chatId,
        getMessage(MESSAGE_KEYS.UNKNOWN_COMMAND)
      );
      return;
    }

    const duration = getServiceDurationMinutes(
      appointment.customer_id,
      appointment.service_id
    );

    const endAt = addMinutesToDateTime(
      startAt,
      duration
    );

    const oldStartAt = appointment.start_at;
    const oldEndAt = appointment.end_at;

    updateAppointmentDateTime(
      appointment.appointment_id,
      startAt,
      endAt
    );

    updateCalendarEventForAppointment(
      appointment.appointment_id
    );

    const updatedAppointment = getAppointmentById(
      appointment.appointment_id
    );

    sendTelegramMessage(
      settings.ClientBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.APPOINTMENT_RESCHEDULED_CLIENT)
    );

    notifyOwnerAboutReschedule(
      updatedAppointment,
      oldStartAt,
      oldEndAt
    );

    addAuditLog(
      'RESCHEDULE_UPDATED',
      appointment.appointment_id
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
    getMessage(MESSAGE_KEYS.MAIN_MENU_TEXT);

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
      ],
      [
        { text: getMessage(MESSAGE_KEYS.MAIN_MENU) }
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
    keyboardRows.push([
      {
        text: location.name
      }
    ]);
  });

  const keyboard = buildKeyboardWithMainMenu(
    keyboardRows
  );

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
    keyboardRows.push([
      {
        text: service.name
      }
    ]);
  });

  const keyboard = buildKeyboardWithMainMenu(
    keyboardRows
  );

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

  providers.forEach(function(provider) {
    keyboardRows.push([
      { text: provider.name }
    ]);
  });

  const keyboard = buildKeyboardWithMainMenu(keyboardRows);

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_PROVIDER),
    keyboard
  );
}

function showDateOptions(chatId, settings) {
  setUserState(chatId, STATES.WAITING_OPTION_DATE);

  const keyboard = buildKeyboardWithMainMenu([
    [
      { text: getMessage(MESSAGE_KEYS.TODAY) },
      { text: getMessage(MESSAGE_KEYS.TOMORROW) }
    ],
    [
      { text: getMessage(MESSAGE_KEYS.DAY_AFTER_TOMORROW) }
    ],
    [
      { text: getMessage(MESSAGE_KEYS.OTHER_DATE) }
    ]
  ]);

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

  addAuditLog(
    'TIME_OPTIONS_PROVIDER',
    session.provider_id
  );

  const durationMinutes =
    getServiceDurationMinutesForSession(
      session
    );

  addAuditLog(
    'TIME_OPTIONS_DURATION',
    String(durationMinutes)
  );

  const slots = getAvailableTimeSlots(
    session.provider_id,
    session.current_option_date,
    durationMinutes,
    session.customer_id
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

  const keyboard = buildKeyboardWithMainMenu(
    keyboardRows
  );

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_TIME),
    keyboard
  );
}

function showAddAnotherOption(chatId, settings) {
  setUserState(chatId, STATES.WAITING_ADD_ANOTHER_OPTION);

  const keyboard = buildKeyboardWithMainMenu([
    [
      { text: getMessage(MESSAGE_KEYS.YES) }
    ],
    [
      { text: getMessage(MESSAGE_KEYS.NO_CONTINUE) }
    ]
  ]);

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ADD_ANOTHER_OPTION),
    keyboard
  );
}

function askCustomerName(chatId, settings) {
  setUserState(
    chatId,
    STATES.WAITING_CUSTOMER_NAME
  );

  const keyboard = buildKeyboardWithMainMenu([]);

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_NAME),
    keyboard
  );
}

function askCustomerPhone(chatId, settings) {
  setUserState(
    chatId,
    STATES.WAITING_CUSTOMER_PHONE
  );

  const keyboard = buildKeyboardWithMainMenu([]);

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_PHONE),
    keyboard
  );
}

function notifyOwnerAboutRequestFromSession(session, requestId) {
  const settings = getSettings();

  const location = findLocationById(session.location_id);
  const service = findServiceById(session.service_id);
  const provider = findProviderById(session.provider_id);

  const customerNote =
    String(session.customer_note || '').trim() || '-';

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
    '\n';

  text +=
    '📝 Комментарий: ' +
    customerNote +
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

  const recipients =
    getActiveRequestRecipients();

  if (recipients.length === 0) {
    sendTelegramMessageWithInlineKeyboard(
      settings.ClientBotToken,
      settings.OwnerTelegramId,
      text,
      inlineKeyboard
    );

    return;
  }

  recipients.forEach(function(recipient) {
    sendTelegramMessageWithInlineKeyboard(
      settings.ClientBotToken,
      recipient.telegram_id,
      text,
      inlineKeyboard
    );
  });
}

function handleOwnerCallback(callbackQuery) {
  const settings = getSettings();

  const data = callbackQuery.data;
  const ownerChatId = callbackQuery.message.chat.id;
  const messageId = callbackQuery.message.message_id;

  const parts = data.split('|');
  const action = parts[0];
  const requestId = parts[1] || '';

  addAuditLog(
    'OWNER_CALLBACK',
    JSON.stringify({
      data: data,
      action: action,
      requestId: requestId,
      ownerChatId: ownerChatId
    })
  );

  // =========================
  // CALENDAR EVENT CANCEL
  // =========================

  if (action === 'cancel_calendar_event') {
    setUserSessionValue(
      ownerChatId,
      'pending_calendar_event_id',
      requestId
    );

    editTelegramMessageWithInlineKeyboard(
      settings.ClientBotToken,
      ownerChatId,
      messageId,
      getMessage(MESSAGE_KEYS.CONFIRM_APPOINTMENT_CANCEL),
      [
        [
          {
            text: '✅ Да',
            callback_data: 'confirm_cancel_calendar_event'
          }
        ],
        [
          {
            text: '↩️ Нет',
            callback_data: 'back_to_calendar_event'
          }
        ]
      ]
    );

    return;
  }

  if (action === 'confirm_cancel_calendar_event') {
    const session = getUserSession(ownerChatId);
    const calendarEventId = session.pending_calendar_event_id;

    const deleted = deleteCalendarEventById(calendarEventId);

    setUserSessionValue(
      ownerChatId,
      'pending_calendar_event_id',
      ''
    );

    editTelegramMessage(
      settings.ClientBotToken,
      ownerChatId,
      messageId,
      deleted
        ? getMessage(MESSAGE_KEYS.APPOINTMENT_CANCELLED)
        : getMessage(MESSAGE_KEYS.UNKNOWN_COMMAND)
    );

    return;
  }

  if (action === 'back_to_calendar_event') {
    setUserSessionValue(
      ownerChatId,
      'pending_calendar_event_id',
      ''
    );

    editTelegramMessage(
      settings.ClientBotToken,
      ownerChatId,
      messageId,
      getMessage(MESSAGE_KEYS.APPOINTMENT_CANCEL_KEEP)
    );

    return;
  }

  // =========================
  // CALENDAR EVENT RESCHEDULE
  // =========================

  if (action === 'reschedule_calendar_event') {
    setUserSessionValue(
      ownerChatId,
      'pending_calendar_event_id',
      requestId
    );

    editTelegramMessageWithInlineKeyboard(
      settings.ClientBotToken,
      ownerChatId,
      messageId,
      getMessage(MESSAGE_KEYS.CONFIRM_APPOINTMENT_RESCHEDULE),
      [
        [
          {
            text: '✅ Да',
            callback_data: 'confirm_reschedule_calendar_event'
          }
        ],
        [
          {
            text: '↩️ Нет',
            callback_data: 'back_to_calendar_event'
          }
        ]
      ]
    );

    return;
  }

  if (action === 'confirm_reschedule_calendar_event') {
    showRescheduleDateOptions(ownerChatId, settings);
    return;
  }

  // =========================
  // APPOINTMENT CANCEL
  // =========================

  if (action === 'cancel_appointment') {
    const appointmentId = requestId;

    editTelegramMessageWithInlineKeyboard(
      settings.ClientBotToken,
      ownerChatId,
      messageId,
      getMessage(MESSAGE_KEYS.CONFIRM_APPOINTMENT_CANCEL),
      [
        [
          {
            text: '✅ Да',
            callback_data: 'confirm_cancel|' + appointmentId
          }
        ],
        [
          {
            text: '↩️ Нет',
            callback_data: 'back_to_appointment|' + appointmentId
          }
        ]
      ]
    );

    return;
  }

  if (action === 'confirm_cancel') {
    const appointmentId = requestId;
    const appointment = getAppointmentById(appointmentId);

    updateAppointmentStatus(appointmentId, 'cancelled');
    deleteCalendarEvent(appointment);
    notifyOwnerAboutCancellation(appointment);

    editTelegramMessage(
      settings.ClientBotToken,
      ownerChatId,
      messageId,
      getMessage(MESSAGE_KEYS.APPOINTMENT_CANCELLED)
    );

    return;
  }

  // =========================
  // APPOINTMENT BACK
  // =========================

  if (action === 'back_to_appointment') {
    const appointmentId = requestId;
    const appointment = getAppointmentById(appointmentId);

    if (!appointment) {
      editTelegramMessage(
        settings.ClientBotToken,
        ownerChatId,
        messageId,
        getMessage(MESSAGE_KEYS.UNKNOWN_COMMAND)
      );

      return;
    }

    const service = findServiceById(appointment.service_id);
    const provider = findProviderById(appointment.provider_id);
    const location = findLocationById(appointment.location_id);

    const text =
      formatDateTimeForDisplay(appointment.start_at) +
      '\n\n' +
      '💅 ' + (service ? service.name : appointment.service_id) + '\n' +
      '👩‍💼 ' + (provider ? provider.name : appointment.provider_id) + '\n' +
      '📍 ' + (location ? location.name : appointment.location_id);

    editTelegramMessageWithInlineKeyboard(
      settings.ClientBotToken,
      ownerChatId,
      messageId,
      text,
      [
        [
          {
            text: '📅 Перенести',
            callback_data: 'reschedule_appointment|' + appointment.appointment_id
          }
        ],
        [
          {
            text: '❌ Отменить',
            callback_data: 'cancel_appointment|' + appointment.appointment_id
          }
        ]
      ]
    );

    return;
  }

  // =========================
  // APPOINTMENT RESCHEDULE
  // =========================

  if (action === 'reschedule_appointment') {
    const appointmentId = requestId;

    editTelegramMessageWithInlineKeyboard(
      settings.ClientBotToken,
      ownerChatId,
      messageId,
      getMessage(MESSAGE_KEYS.CONFIRM_APPOINTMENT_RESCHEDULE),
      [
        [
          {
            text: '✅ Да',
            callback_data: 'confirm_reschedule|' + appointmentId
          }
        ],
        [
          {
            text: '↩️ Нет',
            callback_data: 'back_to_appointment|' + appointmentId
          }
        ]
      ]
    );

    return;
  }

  if (action === 'confirm_reschedule') {
    const appointmentId = requestId;

    setUserSessionValue(
      ownerChatId,
      'reschedule_appointment_id',
      appointmentId
    );

    editTelegramMessage(
      settings.ClientBotToken,
      ownerChatId,
      messageId,
      getMessage(MESSAGE_KEYS.SELECT_RESCHEDULE_DATE)
    );

    showRescheduleDateOptions(ownerChatId, settings);

    return;
  }

  // =========================
  // REQUEST APPROVE OPTION
  // =========================

  if (action.indexOf('approve_option_') === 0) {
    const priority =
      Number(action.replace('approve_option_', ''));

    const request =
      getRequestById(requestId);

    const option =
      getRequestOptionByPriority(
        requestId,
        priority
      );

    addAuditLog(
      'APPROVE_OPTION_DEBUG',
      JSON.stringify({
        requestId: requestId,
        priority: priority,
        request: request,
        option: option,
        appointmentExists: appointmentExistsForRequest(requestId)
      })
    );

    if (!request || !option) {
      sendTelegramMessage(
        settings.ClientBotToken,
        ownerChatId,
        getMessage(MESSAGE_KEYS.UNKNOWN_COMMAND)
      );

      return;
    }

    if (appointmentExistsForRequest(requestId)) {
      sendTelegramMessage(
        settings.ClientBotToken,
        ownerChatId,
        getMessage(MESSAGE_KEYS.REQUEST_ALREADY_PROCESSED)
      );

      return;
    }

    const appointmentId =
      createAppointmentFromRequest(
        request,
        option
      );

    createCalendarEventForAppointment(
      appointmentId
    );

    updateCustomerStatus(
      request.customer_id,
      'confirmed'
    );

    updateRequestStatus(
      requestId,
      'confirmed'
    );

    updateRequestOptionsAfterApproval(
      requestId,
      priority
    );

    const customer =
      getCustomerById(request.customer_id);

    const service =
      findServiceById(request.service_id);

    const provider =
      findProviderById(request.provider_id);

    const location =
      findLocationById(request.location_id);

    const requestOptions =
      getRequestOptionsByRequestId(requestId);

    const ownerText =
      buildOwnerRequestConfirmedText(
        request,
        requestOptions,
        priority
      );

    editTelegramMessage(
      settings.ClientBotToken,
      ownerChatId,
      messageId,
      ownerText
    );

    if (customer && customer.telegram_id) {
      const clientText =
        getMessage(MESSAGE_KEYS.REQUEST_APPROVED_CLIENT) +
        '\n\n' +
        '📅 ' +
        formatDateForDisplay(option.preferred_date) +
        ' ' +
        formatTimeForDisplay(option.preferred_time) +
        '\n' +
        '💅 ' +
        (service ? service.name : request.service_id) +
        '\n' +
        '👩‍💼 ' +
        (provider ? provider.name : request.provider_id) +
        '\n' +
        '📍 ' +
        (location ? location.name : request.location_id);

      sendTelegramMessage(
        settings.ClientBotToken,
        customer.telegram_id,
        clientText
      );
    }

    return;
  }

  // =========================
  // REQUEST REJECT
  // =========================

  if (action === 'reject_request') {
    updateRequestStatus(requestId, 'rejected');
    updateRequestOptionsAfterApproval(requestId, 0);

    const request = getRequestById(requestId);
    const customer = request
      ? getCustomerById(request.customer_id)
      : null;

    const originalText =
      callbackQuery.message.text || '';

    editTelegramMessage(
      settings.ClientBotToken,
      ownerChatId,
      messageId,
      originalText +
        '\n\n' +
        getMessage(MESSAGE_KEYS.OWNER_REQUEST_REJECTED_STATUS)
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
      { text: formatDateButton(date) }
    ]);
  }

  const keyboard = buildKeyboardWithMainMenu(keyboardRows);

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

  const keyboard = buildKeyboardWithMainMenu([]);

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_PHONE_FOR_APPOINTMENTS),
    keyboard
  );
}

function showMyAppointmentsByPhone(chatId, settings, phone) {
  const appointments = getActiveAppointmentsByPhone(phone);
  const calendarAppointments = getCalendarAppointmentsByPhone(phone);

  if (appointments.length === 0 && calendarAppointments.length === 0) {
    setUserState(
      chatId,
      STATES.WAITING_MY_APPOINTMENTS_PHONE
    );

    sendTelegramMessage(
      settings.ClientBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.NO_ACTIVE_APPOINTMENTS)
    );

    return;
  }

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    '<b>' + getMessage(MESSAGE_KEYS.YOUR_APPOINTMENTS) + '</b>'
  );

  appointments.forEach(function(appointment) {
    appointment = syncAppointmentWithCalendar(
      appointment,
      false
    );

    const service = findServiceById(appointment.service_id);
    const provider = findProviderById(appointment.provider_id);
    const location = findLocationById(appointment.location_id);

      sendAppointmentCard(
      chatId,
      settings,
      appointment,
      service,
      provider,
      location
    );
  });

  calendarAppointments.forEach(function(appointment) {
    sendCalendarAppointmentCard(
      chatId,
      settings,
      appointment
    );
  });

  setUserState(chatId, '');
}

function sendAppointmentCard(
  chatId,
  settings,
  appointment,
  service,
  provider,
  location
) {
  const customerNote =
    String(appointment.customer_note || '').trim() || '-';

  const text =
    formatDateTimeForDisplay(
      appointment.start_at
    ) +
    '\n\n' +
    '💅 ' + service.name + '\n' +
    '👩‍💼 ' + provider.name + '\n' +
    '📍 ' + location.name + '\n' +
    '📝 Комментарий: ' + customerNote;

  const inlineKeyboard = [
    [
      {
        text: '📅 Перенести',
        callback_data:
          'reschedule_appointment|' +
          appointment.appointment_id
      }
    ],
    [
      {
        text: '❌ Отменить',
        callback_data:
          'cancel_appointment|' +
          appointment.appointment_id
      }
    ]
  ];

  sendTelegramMessageWithInlineKeyboard(
    settings.ClientBotToken,
    chatId,
    text,
    inlineKeyboard
  );
}

function notifyOwnerAboutCancellation(
  appointment
) {
  const settings = getSettings();

  const customer =
    getCustomerById(
      appointment.customer_id
    );

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

  const text =
    '❌ ' +
    getMessage(
      MESSAGE_KEYS.OWNER_APPOINTMENT_CANCELLED
    ) +
    '\n\n' +

    '👤 ' +
    (customer
      ? customer.name
      : '') +
    '\n' +

    '📞 ' +
    (customer
      ? customer.phone
      : '') +
    '\n\n' +

    '📅 ' +
    formatDateTimeForDisplay(
      appointment.start_at
    ) +
    '\n' +

    '💅 ' +
    (service
      ? service.name
      : '') +
    '\n' +

    '👩‍💼 ' +
    (provider
      ? provider.name
      : '') +
    '\n' +

    '📍 ' +
    (location
      ? location.name
      : '');

  sendTelegramMessage(
    settings.ClientBotToken,
    settings.OwnerTelegramId,
    text
  );
}

function showRescheduleDateOptions(chatId, settings) {
  setUserState(
    chatId,
    STATES.WAITING_RESCHEDULE_DATE
  );

  const keyboard = buildKeyboardWithMainMenu([
    [
      { text: getMessage(MESSAGE_KEYS.TODAY) },
      { text: getMessage(MESSAGE_KEYS.TOMORROW) }
    ],
    [
      { text: getMessage(MESSAGE_KEYS.DAY_AFTER_TOMORROW) }
    ],
    [
      { text: getMessage(MESSAGE_KEYS.OTHER_DATE) }
    ]
  ]);

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_RESCHEDULE_DATE),
    keyboard
  );
}

function showRescheduleTimeOptions(chatId, settings) {
  const session = getUserSession(chatId);

  let providerId = '';
  let durationMinutes = 60;
  let customerId = '';

  if (session.pending_calendar_event_id) {
    const event = getCalendarEventById(
      session.pending_calendar_event_id
    );

    if (!event) {
      sendTelegramMessage(
        settings.ClientBotToken,
        chatId,
        getMessage(MESSAGE_KEYS.UNKNOWN_COMMAND)
      );
      return;
    }

    const data =
      extractSmartflowCalendarData(
        event.description
      ) || {};

    const provider =
      data.provider_id
        ? findProviderById(data.provider_id)
        : null;

    if (!provider) {
      sendTelegramMessage(
        settings.ClientBotToken,
        chatId,
        getMessage(MESSAGE_KEYS.PROVIDER_SELECT_FROM_LIST)
      );
      return;
    }

    providerId = provider.id;

    durationMinutes = Math.round(
      (event.end_at.getTime() - event.start_at.getTime()) / 60000
    );

    const customer =
      data.customer_id
        ? getCustomerById(data.customer_id)
        : null;

    customerId =
      customer && customer.customer_id
        ? customer.customer_id
        : '';
  } else {
    const appointment = getAppointmentById(
      session.reschedule_appointment_id
    );

    if (!appointment) {
      sendTelegramMessage(
        settings.ClientBotToken,
        chatId,
        getMessage(MESSAGE_KEYS.UNKNOWN_COMMAND)
      );
      return;
    }

    providerId = appointment.provider_id;
    customerId = appointment.customer_id;

    durationMinutes = getServiceDurationMinutes(
      appointment.customer_id,
      appointment.service_id
    );
  }

  const slots = getAvailableTimeSlots(
    providerId,
    session.reschedule_date,
    durationMinutes,
    customerId
  );

  if (slots.length === 0) {
    sendTelegramMessage(
      settings.ClientBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.NO_AVAILABLE_TIME)
    );

    showRescheduleDateOptions(chatId, settings);
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

  const keyboard = buildKeyboardWithMainMenu(
    keyboardRows
  );

  setUserState(
    chatId,
    'WAITING_RESCHEDULE_TIME'
  );

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_TIME),
    keyboard
  );
}

function showRescheduleCustomDateOptions(chatId, settings) {
  setUserState(
    chatId,
    'WAITING_RESCHEDULE_CUSTOM_DATE'
  );

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

  const keyboard = buildKeyboardWithMainMenu(
    keyboardRows
  );

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_CUSTOM_DATE),
    keyboard
  );
}

function notifyOwnerAboutReschedule(appointment, oldStartAt, oldEndAt) {
  const settings = getSettings();

  const customer = getCustomerById(appointment.customer_id);
  const service = findServiceById(appointment.service_id);
  const provider = findProviderById(appointment.provider_id);
  const location = findLocationById(appointment.location_id);

  const text =
    '🔄 ' + getMessage(MESSAGE_KEYS.OWNER_APPOINTMENT_RESCHEDULED) +
    '\n\n' +
    '👤 ' + (customer ? customer.name : '') + '\n' +
    '📞 ' + (customer ? customer.phone : '') + '\n\n' +
    'Было:\n' +
    formatDateTimeForDisplay(oldStartAt) + '\n\n' +
    'Стало:\n' +
    formatDateTimeForDisplay(appointment.start_at) + '\n\n' +
    '💅 ' + (service ? service.name : '') + '\n' +
    '👩‍💼 ' + (provider ? provider.name : '') + '\n' +
    '📍 ' + (location ? location.name : '');

  sendTelegramMessage(
    settings.ClientBotToken,
    settings.OwnerTelegramId,
    text
  );
}

function sendCalendarAppointmentCard(chatId, settings, appointment) {
  const description =
    appointment.description || '';

  const appointmentId =
    extractCalendarTechValue(
      description,
      'appointment_id'
    );

  if (!appointmentId) {
    return;
  }

  const linkedAppointment =
    getAppointmentById(appointmentId);

  if (!linkedAppointment) {
    return;
  }

  const service =
    findServiceById(
      linkedAppointment.service_id
    );

  const provider =
    findProviderById(
      linkedAppointment.provider_id
    );

  const location =
    findLocationById(
      linkedAppointment.location_id
    );

  const customerNote =
    String(
      linkedAppointment.customer_note || ''
    ).trim() || '-';

  const text =
    formatDateTimeForDisplay(
      appointment.start_at
    ) +
    '\n\n' +
    '💅 ' +
    (service ? service.name : linkedAppointment.service_id) +
    '\n' +
    '👩‍💼 ' +
    (provider ? provider.name : linkedAppointment.provider_id) +
    '\n' +
    '📍 ' +
    (location ? location.name : linkedAppointment.location_id) +
    '\n' +
    '📝 Комментарий: ' +
    customerNote;

  const inlineKeyboard = [
    [
      {
        text: '📅 Перенести',
        callback_data:
          'reschedule_calendar_event|' +
          appointment.calendar_event_id
      }
    ],
    [
      {
        text: '❌ Отменить',
        callback_data:
          'cancel_calendar_event|' +
          appointment.calendar_event_id
      }
    ]
  ];

  sendTelegramMessageWithInlineKeyboard(
    settings.ClientBotToken,
    chatId,
    text,
    inlineKeyboard
  );
}

function askCustomerNote(chatId, settings) {
  setUserState(
    chatId,
    STATES.WAITING_CUSTOMER_NOTE
  );

  const keyboard = buildKeyboardWithMainMenu([
    [
      { text: '-' }
    ]
  ]);

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_CUSTOMER_NOTE),
    keyboard
  );
}

function showContacts(chatId, settings) {
  const locations = getLocations();

  let text =
    '📞 ' +
    getMessage(MESSAGE_KEYS.CONTACTS) +
    '\n\n';

  locations.forEach(function(location) {
    text += '📍 ' + location.name + '\n';

    if (location.address) {
      text += '🏠 ' + location.address + '\n';
    }

    if (location.phone_1) {
      text += '📞 +' + String(location.phone_1) + '\n';
    }

    if (location.phone_2) {
      text += '📞 +' + String(location.phone_2) + '\n';
    }

    if (location.working_hours) {
      text += '🕒 ' + location.working_hours + '\n';
    }

    if (location.telegram) {
      text += '💬 ' + location.telegram + '\n';
    }

    if (location.instagram) {
      text += '📷 ' + location.instagram + '\n';
    }

    if (location.website) {
      text += '🌐 ' + location.website + '\n';
    }

    if (location.google_maps_url) {
      text += '🗺️ ' + location.google_maps_url + '\n';
    }

    text += '\n';
  });

  const keyboard = buildKeyboardWithMainMenu([]);

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    text,
    keyboard
  );
}

function buildOwnerRequestConfirmedText(
  request,
  options,
  approvedPriority
) {
  const customer = getCustomerById(request.customer_id);
  const service = findServiceById(request.service_id);
  const provider = findProviderById(request.provider_id);
  const location = findLocationById(request.location_id);

  let text =
    '<b>' +
    getMessage(MESSAGE_KEYS.NEW_REQUEST_OWNER_TITLE) +
    '</b>\n\n';

  text +=
    '👤 ' +
    getMessage(MESSAGE_KEYS.OWNER_CUSTOMER) +
    ': ' +
    (customer ? customer.name : request.customer_id) +
    '\n';

  text +=
    '📞 ' +
    getMessage(MESSAGE_KEYS.OWNER_PHONE) +
    ': ' +
    (customer ? customer.phone : '') +
    '\n';

  text +=
    '📝 Комментарий: ' +
    (String(request.customer_note || '').trim() || '-') +
    '\n\n';

  text +=
    '📍 ' +
    getMessage(MESSAGE_KEYS.OWNER_LOCATION) +
    ': ' +
    (location ? location.name : request.location_id) +
    '\n';

  text +=
    '💅 ' +
    getMessage(MESSAGE_KEYS.OWNER_SERVICE) +
    ': ' +
    (service ? service.name : request.service_id) +
    '\n';

  text +=
    '👩‍💼 ' +
    getMessage(MESSAGE_KEYS.OWNER_PROVIDER) +
    ': ' +
    (provider ? provider.name : request.provider_id) +
    '\n\n';

  text +=
    '<b>' +
    getMessage(MESSAGE_KEYS.OWNER_TIME_OPTIONS) +
    ':</b>\n';

  options.forEach(function(option) {
    const line =
      option.priority +
      ') ' +
      formatDateForDisplay(option.preferred_date) +
      ' ' +
      formatTimeForDisplay(option.preferred_time);

    if (
      options.length > 1 &&
      Number(option.priority) ===
      Number(approvedPriority)
    ) {
      text += '<b>' + line + '</b>\n';
    } else {
      text += line + '\n';
    }
  });

  text +=
    '\n' +
    getMessage(
      MESSAGE_KEYS.OWNER_REQUEST_CONFIRMED_STATUS
    );

  return text;
}

function getRequestOptionsByRequestId(requestId) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName('RequestOptions');

  const rows = sheet.getDataRange().getValues();
  const headers = rows[0];

  const result = [];

  for (let i = 1; i < rows.length; i++) {
    const item = {};

    headers.forEach(function(header, index) {
      item[header] = rows[i][index];
    });

    if (
      String(item.request_id) ===
      String(requestId)
    ) {
      result.push(item);
    }
  }

  result.sort(function(a, b) {
    return Number(a.priority) - Number(b.priority);
  });

  return result;
}
