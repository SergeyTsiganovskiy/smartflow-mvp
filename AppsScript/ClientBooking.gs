
function showLocations(chatId, settings) {
  navigateClient(
    chatId,
    CLIENT_MENUS.LOCATIONS,
    STATES.WAITING_LOCATION
  );

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
  navigateClient(
    chatId,
    CLIENT_MENUS.SERVICES,
    STATES.WAITING_SERVICE
  );

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

  navigateClient(
    chatId,
    CLIENT_MENUS.PROVIDERS,
    STATES.WAITING_PROVIDER
  );

  const session = getUserSession(chatId);

  if (!session || !session.location_id) {
    sendTelegramMessage(
      settings.ClientBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SESSION_LOCATION_NOT_FOUND)
    );
    return;
  }



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
  navigateClient(
    chatId,
    CLIENT_MENUS.DATES,
    STATES.WAITING_OPTION_DATE
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
    getMessage(MESSAGE_KEYS.SELECT_DATE),
    keyboard
  );
}

function showTimeOptions(chatId, settings) {
  navigateClient(
    chatId,
    CLIENT_MENUS.TIMES,
    STATES.WAITING_OPTION_TIME
  );

  const session = getUserSession(chatId);

  const durationMinutes =
    getServiceDurationMinutesForSession(
      session
    );

  const slots = getAvailableTimeSlots(
    session.provider_id,
    session.current_option_date,
    durationMinutes,
    session.customer_id
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
  navigateClient(
    chatId,
    CLIENT_MENUS.ADD_ANOTHER_OPTION,
    STATES.WAITING_ADD_ANOTHER_OPTION
  );

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

function showCustomDateOptions(chatId, settings) {
  setUserState(chatId, STATES.WAITING_CUSTOM_DATE);

  const keyboardRows = [];
  const today = new Date();

  const daysAhead =
    Number(settings.BookingDaysAhead || 60);

  const safeDaysAhead =
    daysAhead > 0
      ? daysAhead
      : 60;

  for (let i = 0; i < safeDaysAhead; i++) {
    const date =
      addDaysToDate(today, i);

    keyboardRows.push([
      {
        text: formatDateButton(date)
      }
    ]);
  }

  const keyboard =
    buildKeyboardWithMainMenu(keyboardRows);

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_CUSTOM_DATE),
    keyboard
  );
}

function askCustomerNote(chatId, settings) {
  setUserState(
    chatId,
    STATES.WAITING_CUSTOMER_NOTE
  );

  const keyboard = buildKeyboardWithMainMenu([
    [
      {
        text: getMessage(
          MESSAGE_KEYS.BOOK_APPOINTMENT
        )
      }
    ]
  ]);

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_CUSTOMER_NOTE),
    keyboard
  );
}

function rollbackLastClientOption(chatId) {
  const session =
    getUserSession(chatId);

  const optionCount =
    Number(session.option_count || 0);

  if (optionCount <= 0) {
    return;
  }

  setUserSessionValue(
    chatId,
    'option' + optionCount + '_date',
    ''
  );

  setUserSessionValue(
    chatId,
    'option' + optionCount + '_time',
    ''
  );

  setUserSessionValue(
    chatId,
    'option_count',
    optionCount - 1
  );
}
