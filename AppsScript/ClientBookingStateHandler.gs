function handleClientBookingState(chatId, text, state, settings) {
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
      sendTelegramMessage(settings.ClientBotToken, chatId, getMessage(MESSAGE_KEYS.PHONE_INVALID));

      askCustomerPhone(chatId, settings);
      return;
    }

    setUserSessionValue(chatId, 'customer_phone', customerPhone);

    const existingCustomer = getCustomerByPhone(customerPhone);

    if (existingCustomer && existingCustomer.customer_id) {
      setUserSessionValue(chatId, 'customer_id', existingCustomer.customer_id);
    }

    showLocations(chatId, settings);
    return;
  }

  if (state === STATES.WAITING_LOCATION) {
    const location = findLocationByName(text);

    addAuditLog('WAITING_LOCATION_FOUND', JSON.stringify(location));

    if (!location) {
      sendTelegramMessage(settings.ClientBotToken, chatId, getMessage(MESSAGE_KEYS.LOCATION_SELECT_FROM_LIST));
      return;
    }

    setUserSessionValue(chatId, 'location_id', location.id);
    showServices(chatId, settings);
    return;
  }

  if (state === STATES.WAITING_SERVICE) {
    const service = findServiceByName(text);

    if (!service) {
      sendTelegramMessage(settings.ClientBotToken, chatId, getMessage(MESSAGE_KEYS.SERVICE_SELECT_FROM_LIST));
      return;
    }

    setUserSessionValue(chatId, 'service_id', service.id);
    showProviders(chatId, settings);
    return;
  }

  if (state === STATES.WAITING_PROVIDER) {
    const provider = findProviderByName(text);

    if (!provider) {
      sendTelegramMessage(settings.ClientBotToken, chatId, getMessage(MESSAGE_KEYS.PROVIDER_SELECT_FROM_LIST));
      return;
    }

    setUserSessionValue(chatId, 'provider_id', provider.id);

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
      sendTelegramMessage(settings.ClientBotToken, chatId, getMessage(MESSAGE_KEYS.DATE_SELECT_FROM_LIST));
      return;
    }

    setUserSessionValue(chatId, 'current_option_date', selectedDate);

    setUserState(chatId, STATES.WAITING_OPTION_TIME);

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

    addAuditLog(
      'CLIENT_SELECTED_DATE_DEBUG',
      JSON.stringify({
        text: text,
        selectedDate: selectedDate
      })
    );

    showTimeOptions(chatId, settings);
    return;
  }

  if (state === STATES.WAITING_OPTION_TIME) {
    const selectedTime = text.trim();

    if (!isValidTimeOption(selectedTime)) {
      sendTelegramMessage(settings.ClientBotToken, chatId, getMessage(MESSAGE_KEYS.TIME_SELECT_FROM_LIST));

      return;
    }

    const session = getUserSession(chatId);

    const optionCount = Number(session.option_count || 0) + 1;

    setUserSessionValue(chatId, 'current_option_time', selectedTime);

    setUserSessionValue(chatId, 'option_count', optionCount);

    setUserSessionValue(chatId, 'option' + optionCount + '_date', session.current_option_date);

    setUserSessionValue(chatId, 'option' + optionCount + '_time', selectedTime);

    if (optionCount >= 3) {
      askCustomerNote(chatId, settings);

      return;
    }

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

    sendTelegramMessage(settings.ClientBotToken, chatId, getMessage(MESSAGE_KEYS.UNKNOWN_COMMAND));
    return;
  }

  if (state === STATES.WAITING_CUSTOMER_NOTE) {
    let customerNote = text.trim();

    if (text === getMessage(MESSAGE_KEYS.BOOK_APPOINTMENT)) {
      customerNote = '';
    }

    setUserSessionValue(chatId, 'customer_note', customerNote);

    const session = getUserSession(chatId);
    session.customer_note = customerNote;

    const requestId = finalizeRequestFromSession(session);

    notifyAdminsAboutRequestFromSession(session, requestId);

    clearUserSession(chatId);
    setUserState(chatId, '');
    sendClientStartMenu(chatId, settings, MESSAGE_KEYS.REQUEST_CREATED);

    return;
  }
}
