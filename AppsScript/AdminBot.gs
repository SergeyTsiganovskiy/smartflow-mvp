function sendAdminMainMenu(chatId, settings) {
  const keyboard = {
    keyboard: [
      [{ text: getMessage(MESSAGE_KEYS.ADMIN_PROVIDERS) }],
      [{ text: getMessage(MESSAGE_KEYS.ADMIN_SERVICES) }],
      [{ text: getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS) }],
      [{ text: getMessage(MESSAGE_KEYS.ADMIN_CUSTOMERS) }],
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
  const settings = getSettings();

  const chatId = message.chat.id;
  const text = message.text || '';
  const state = String(getUserState(chatId) || '').trim();

  // =========================
  // ACCESS CHECK
  // =========================

  if (!isAdminUser(chatId)) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.ADMIN_ACCESS_DENIED)
    );

    return;
  }

  // =========================
  // GLOBAL COMMANDS
  // =========================

  if (text === '/start') {
    clearUserSession(chatId);
    setUserState(chatId, '');

    sendAdminMainMenu(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.MAIN_MENU)) {
    clearUserSession(chatId);
    setUserState(chatId, '');

    sendAdminMainMenu(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.BACK)) {
    processAdminBack(chatId, settings);
    return;
  }

  // =========================
  // MAIN MENU SECTIONS
  // =========================

  if (text === getMessage(MESSAGE_KEYS.ADMIN_PROVIDERS)) {
    clearUserSession(chatId);
    setUserState(chatId, '');

    sendProvidersMenu(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_SERVICES)) {
    clearUserSession(chatId);
    setUserState(chatId, '');

    sendServicesMenu(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS)) {
    clearUserSession(chatId);
    setUserState(chatId, '');

    sendAppointmentsMenu(chatId, settings);
    return;
  }

  // =========================
  // PROVIDERS MENU COMMANDS
  // =========================

  if (text === getMessage(MESSAGE_KEYS.ADMIN_ADD_PROVIDER)) {
    clearUserSession(chatId);

    startCreateProvider(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_PROVIDER_LIST)) {
    showProvidersListAdmin(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_PROVIDER_EDIT)) {
    startEditProvider(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_PROVIDER_SCHEDULE)) {
    startProviderSchedule(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_PROVIDER_OVERRIDES)) {
    startProviderOverrides(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_PROVIDER_DISABLE)) {
    startDisableProvider(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_PROVIDER_ENABLE)) {
    startEnableProvider(chatId, settings);
    return;
  }

  // =========================
  // SERVICE MENU COMMANDS
  // =========================

  if (text === getMessage(MESSAGE_KEYS.ADMIN_ADD_SERVICE)) {
    clearUserSession(chatId);

    startCreateService(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_SERVICE_LIST)) {
    showServicesListAdmin(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_SERVICE_EDIT)) {
    startEditService(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_SERVICE_DISABLE)) {
    startDisableService(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_SERVICE_ENABLE)) {
    startEnableService(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_CUSTOMER_SERVICES)) {
    startCustomerServices(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.EDIT_CUSTOMER_SERVICE)) {
    startEditCustomerService(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_TODAY)) {
    showTodayAppointmentsAdmin(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_TOMORROW)) {
    showTomorrowAppointments(
      chatId,
      settings
    );

    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_BY_PROVIDER)) {
    startAppointmentsByProvider(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_BY_DATE)) {
    startAppointmentsByDate(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_NEXT_WORKING_DAY)) {
    startNextWorkingDayAppointments(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_CUSTOMERS)) {
    clearUserSession(chatId);
    setUserState(chatId, '');

    sendCustomersMenu(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE)) {
    startCustomerProfile(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_EDIT)) {
    startEditCustomerProfile(chatId, settings);
    return;
  }

  if (
    text === getMessage(
      MESSAGE_KEYS.CUSTOMER_PROFILES_LIST
    )
  ) {
    startCustomerProfilesList(
      chatId,
      settings
    );

    return;
  }

    if (text === getMessage(MESSAGE_KEYS.CUSTOMER_LIST_NEXT)) {
    const session =
      getUserSession(chatId) || {};

    const page =
      Number(
        session.customer_list_page || 1
      );

    const nextPage =
      page + 1;

    setUserSessionValue(
      chatId,
      'customer_list_page',
      nextPage
    );

    showCustomerProfilesList(
      chatId,
      settings,
      nextPage
    );

    return;
  }

  if (text === getMessage(MESSAGE_KEYS.CUSTOMER_LIST_PREVIOUS)) {
    const session =
      getUserSession(chatId) || {};

    const page =
      Number(
        session.customer_list_page || 1
      );

    const previousPage =
      Math.max(
        1,
        page - 1
      );

    setUserSessionValue(
      chatId,
      'customer_list_page',
      previousPage
    );

    showCustomerProfilesList(
      chatId,
      settings,
      previousPage
    );

    return;
  }

  if (text === getMessage(MESSAGE_KEYS.CUSTOMER_VISIT_HISTORY)) {
    startCustomerVisitHistory(
      chatId,
      settings
    );

    return;
  }

  if (text === getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_CREATE)) {
    startCreateCustomerProfile(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_DELETE)) {
    startDeleteCustomerProfile(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.CUSTOMER_CONFLICTS_MENU)) {
    startCustomerConflicts(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.CUSTOMER_CONFLICT_ADD)) {
    startAddCustomerConflict(chatId, settings);
    return;
  }

  if (
  text ===
    getMessage(
      MESSAGE_KEYS.CUSTOMER_CONFLICT_LIST
    )
  ) {
    startListCustomerConflicts(
      chatId,
      settings
    );

    return;
  }

  if (
    text ===
    getMessage(
      MESSAGE_KEYS.CUSTOMER_CONFLICT_DELETE
    )
  ) {
    startDeleteCustomerConflict(
      chatId,
      settings
    );

    return;
  }

  // =========================
  // CREATE SERVICE STATES
  // =========================

  if (state === ADMIN_STATES.WAITING_SERVICE_NAME) {
    processServiceName(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_SERVICE_LOCATION) {
    processServiceLocation(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_SERVICE_PRICE_MIN) {
    processServicePriceMin(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_SERVICE_PRICE_MAX) {
    processServicePriceMax(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_SERVICE_DURATION_MIN) {
    processServiceDurationMin(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_SERVICE_DURATION_MAX) {
    processServiceDurationMax(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_SERVICE_NAME) {
    processServiceName(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_SERVICE_LOCATION) {
    processServiceLocation(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_SERVICE_PRICE_MIN) {
    processServicePriceMin(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_SERVICE_PRICE_MAX) {
    processServicePriceMax(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_SERVICE_DURATION_MIN) {
    processServiceDurationMin(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_SERVICE_DURATION_MAX) {
    processServiceDurationMax(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_SERVICE_TO_EDIT) {
    processServiceToEdit(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_SERVICE_FIELD_TO_EDIT) {
    processServiceFieldToEdit(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_SERVICE_NEW_VALUE) {
    processServiceNewValue(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_SERVICE_TO_DISABLE) {
    processServiceToDisable(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_SERVICE_TO_ENABLE) {
    processServiceToEnable(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_CUSTOMER_SERVICE_PHONE) {
    processCustomerServicePhone(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_CUSTOMER_SERVICE_TO_EDIT) {
    processCustomerServiceToEdit(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_CUSTOMER_SERVICE_PRICE) {
    processCustomerServicePrice(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_CUSTOMER_SERVICE_DURATION) {
    processCustomerServiceDuration(chatId, text, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.DELETE_CUSTOMER_SERVICE)) {
    startDeleteCustomerService(chatId, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_CUSTOMER_SERVICE_TO_DELETE) {
    processCustomerServiceToDelete(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_APPOINTMENTS_PROVIDER) {
    processAppointmentsProvider(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_APPOINTMENTS_DATE) {
    processAppointmentsDate(chatId, text, settings);
    return;
  }
  
  if (state === ADMIN_STATES.WAITING_NEXT_WORKING_DAY_PROVIDER) {
    processNextWorkingDayProvider(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_CUSTOMER_PROFILE_PHONE) {
    processCustomerProfilePhone(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_CUSTOMER_PROFILE_EDIT_PHONE) {
    processEditCustomerProfilePhone(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_CUSTOMER_PROFILE_EDIT_FIELD) {
    processEditCustomerProfileField(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_CUSTOMER_PROFILE_EDIT_VALUE) {
    processEditCustomerProfileValue(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_CUSTOMER_VISIT_HISTORY_PHONE) {
    processCustomerVisitHistoryPhone(
      chatId,
      text,
      settings
    );

    return;
  }

  if (state === ADMIN_STATES.WAITING_CUSTOMER_PROFILE_CREATE_PHONE) {
    processCreateCustomerProfilePhone(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_CUSTOMER_PROFILE_CREATE_NAME) {
    processCreateCustomerProfileName(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_CUSTOMER_PROFILE_DELETE_PHONE) {
    processDeleteCustomerProfilePhone(chatId, text, settings);
    return;
  }

  if (
    state ===
    ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_MAIN_PHONE
  ) {
    processCustomerConflictMainPhone(
      chatId,
      text,
      settings
    );

    return;
  }

  if (
    state ===
    ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_PHONE
  ) {
    processCustomerConflictPhone(
      chatId,
      text,
      settings
    );

    return;
  }

  if (
    state ===
    ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_LIST_PHONE
  ) {
    processShowCustomerConflicts(
      chatId,
      text,
      settings
    );

    return;
  }

  if (
    state ===
    ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_DELETE_MAIN_PHONE
  ) {
    processDeleteCustomerConflictMainPhone(
      chatId,
      text,
      settings
    );

    return;
  }

  if (
    state ===
    ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_DELETE_PHONE
  ) {
    processDeleteCustomerConflictPhone(
      chatId,
      text,
      settings
    );

    return;
  }

  // =========================
  // CREATE PROVIDER STATES
  // =========================

  if (state === ADMIN_STATES.WAITING_PROVIDER_NAME) {
    processProviderName(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_PROVIDER_LOCATION) {
    processProviderLocation(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_PROVIDER_PHONE) {
    processProviderPhone(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_PROVIDER_TELEGRAM_ID) {
    processProviderTelegramId(chatId, text, settings);
    return;
  }

  // =========================
  // EDIT PROVIDER STATES
  // =========================

  if (state === ADMIN_STATES.WAITING_PROVIDER_TO_EDIT) {
    processProviderToEdit(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_PROVIDER_FIELD_TO_EDIT) {
    processProviderFieldToEdit(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_PROVIDER_NEW_VALUE) {
    processProviderNewValue(chatId, text, settings);
    return;
  }

  // =========================
  // DISABLE PROVIDER STATES
  // =========================

  if (state === ADMIN_STATES.WAITING_PROVIDER_TO_DISABLE) {
    processProviderToDisable(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_PROVIDER_TO_ENABLE) {
    processProviderToEnable(chatId, text, settings);
    return;
  }

  // =========================
  // PROVIDER SCHEDULE STATES
  // =========================

  if (state === ADMIN_STATES.WAITING_PROVIDER_FOR_SCHEDULE) {
    processProviderForSchedule(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_SCHEDULE_DAY) {
    processScheduleDay(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_SCHEDULE_ACTION) {
    processScheduleAction(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_SCHEDULE_START_TIME) {
    processScheduleStartTime(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_SCHEDULE_END_TIME) {
    processScheduleEndTime(chatId, text, settings);
    return;
  }

  // =========================
  // PROVIDER OVERRIDES STATES
  // =========================

  if (state === ADMIN_STATES.WAITING_PROVIDER_FOR_OVERRIDE) {
    processProviderForOverride(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_OVERRIDE_ACTION) {
    processOverrideAction(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_OVERRIDE_REASON) {
    processOverrideReason(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_OVERRIDE_DATE) {
    processOverrideDate(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_OVERRIDE_START_TIME) {
    processOverrideStartTime(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_OVERRIDE_END_TIME) {
    processOverrideEndTime(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_OVERRIDE_TO_DELETE) {
    processOverrideToDelete(chatId, text, settings);
    return;
  }

  // =========================
  // FALLBACK
  // =========================

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
  setPreviousMenu(chatId, 'PROVIDERS_MENU');
  
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
  setPreviousMenu(chatId, 'PROVIDERS_MENU');

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

function startProviderSchedule(chatId, settings) {

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
    ADMIN_STATES.WAITING_PROVIDER_FOR_SCHEDULE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_PROVIDER_FOR_SCHEDULE),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processProviderForSchedule(chatId, text, settings) {
  const provider = findProviderByName(text);

  if (!provider) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SELECT_PROVIDER_FROM_LIST),
      buildProvidersMenuKeyboard()
    );
    return;
  }

  setUserSessionValue(
    chatId,
    'schedule_provider_id',
    provider.id
  );

  showProviderScheduleAdmin(
    chatId,
    provider.id,
    settings
  );
}

function showProviderScheduleAdmin(
  chatId,
  providerId,
  settings
) {

  const provider =
    findProviderById(providerId);

  const schedule =
    getProviderSchedule(providerId);

  let text =
    '<b>' +
    getMessage(MESSAGE_KEYS.ADMIN_PROVIDER_SCHEDULE) +
    '</b>\n\n';

  text +=
    provider.name +
    '\n\n';

  schedule.forEach(function(item) {

    const day =
      getWeekDayByCode(
        item.day_of_week
      );

    const dayName =
      day
        ? getMessage(day.message_key)
        : item.day_of_week;

    text +=
      '<b>' +
      dayName +
      '</b> ';

    if (String(item.is_working).toUpperCase() === 'TRUE') {
      text +=
        formatScheduleTime(item.start_time) +
        '-' +
        formatScheduleTime(item.end_time) +
        '\n';
    } else {
      text +=
        getMessage(MESSAGE_KEYS.DAY_OFF) +
        '\n';
    }
  });

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_SCHEDULE_DAY
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    text,
    buildScheduleDaysKeyboard()
  );
}

function buildScheduleDaysKeyboard() {
  const weekDays = getWeekDays();
  const keyboardRows = [];

  weekDays.forEach(function(day) {
    keyboardRows.push([
      {
        text: getMessage(day.message_key)
      }
    ]);
  });

  return buildKeyboardWithMainMenu(keyboardRows);
}

function processScheduleDay(
  chatId,
  text,
  settings
) {
  const weekDays =
    getWeekDays();

  const selectedDay =
    weekDays.find(function(day) {
      const dayName =
        String(getMessage(day.message_key) || '').trim();

      return dayName === String(text || '').trim();
    });

  if (!selectedDay) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.SELECT_SCHEDULE_DAY
      ),
      buildScheduleDaysKeyboard()
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'schedule_day_code',
    selectedDay.day_code
  );

  showScheduleDayActions(
    chatId,
    settings
  );
}

function showScheduleDayActions(
  chatId,
  settings
) {

  const keyboard =
    buildKeyboardWithMainMenu([
      [
        {
          text: getMessage(
            MESSAGE_KEYS.SCHEDULE_ACTION_START
          )
        }
      ],
      [
        {
          text: getMessage(
            MESSAGE_KEYS.SCHEDULE_ACTION_END
          )
        }
      ],
      [
        {
          text: getMessage(
            MESSAGE_KEYS.SCHEDULE_ACTION_DAY_OFF
          )
        }
      ],
      [
        {
          text: getMessage(
            MESSAGE_KEYS.SCHEDULE_ACTION_WORKING
          )
        }
      ]
    ]);

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_SCHEDULE_ACTION
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.SELECT_ACTION
    ),
    keyboard
  );
}

function processScheduleAction(
  chatId,
  text,
  settings
) {
  const session =
    getUserSession(chatId);

  const providerId =
    session.schedule_provider_id;

  const dayCode =
    session.schedule_day_code;

  if (!providerId || !dayCode) {
    setUserState(
      chatId,
      ADMIN_STATES.WAITING_PROVIDER_FOR_SCHEDULE
    );

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SELECT_PROVIDER_FOR_SCHEDULE),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setPreviousMenu(
    chatId,
    'PROVIDERS_MENU'
  );

  if (
    text === getMessage(MESSAGE_KEYS.SCHEDULE_ACTION_DAY_OFF)
  ) {
    updateProviderScheduleField(
      providerId,
      dayCode,
      'is_working',
      false
    );

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SCHEDULE_UPDATED)
    );

    showProviderScheduleAdmin(
      chatId,
      providerId,
      settings
    );

    return;
  }

  if (
    text === getMessage(MESSAGE_KEYS.SCHEDULE_ACTION_WORKING)
  ) {
    const currentSchedule =
      getProviderScheduleDay(
        providerId,
        dayCode
      );

    if (!currentSchedule) {
      setUserState(
        chatId,
        ADMIN_STATES.WAITING_SCHEDULE_DAY
      );

      sendTelegramMessage(
        settings.AdminBotToken,
        chatId,
        getMessage(MESSAGE_KEYS.EDIT_ERROR),
        buildScheduleDaysKeyboard()
      );

      return;
    }

    const startTime =
      formatScheduleTime(currentSchedule.start_time) ||
      settings.DefaultWorkStartTime ||
      '09:00';

    const endTime =
      formatScheduleTime(currentSchedule.end_time) ||
      settings.DefaultWorkEndTime ||
      '20:00';

    updateProviderScheduleField(
      providerId,
      dayCode,
      'start_time',
      startTime
    );

    updateProviderScheduleField(
      providerId,
      dayCode,
      'end_time',
      endTime
    );

    updateProviderScheduleField(
      providerId,
      dayCode,
      'is_working',
      true
    );

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SCHEDULE_UPDATED)
    );

    showProviderScheduleAdmin(
      chatId,
      providerId,
      settings
    );

    return;
  }

  if (
    text === getMessage(MESSAGE_KEYS.SCHEDULE_ACTION_START)
  ) {
    setPreviousMenu(chatId, 'SCHEDULE_DAYS');

    setUserState(
      chatId,
      ADMIN_STATES.WAITING_SCHEDULE_START_TIME
    );

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.ENTER_NEW_VALUE),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  if (
    text === getMessage(MESSAGE_KEYS.SCHEDULE_ACTION_END)
  ) {
    setPreviousMenu(chatId, 'SCHEDULE_DAYS');

    setUserState(
      chatId,
      ADMIN_STATES.WAITING_SCHEDULE_END_TIME
    );

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.ENTER_NEW_VALUE),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_SCHEDULE_DAY
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_ACTION),
    buildScheduleDaysKeyboard()
  );
}

function processScheduleStartTime(
  chatId,
  text,
  settings
) {
  updateScheduleTimeAndRefresh(
    chatId,
    text,
    settings,
    'start_time'
  );
}

function processScheduleEndTime(
  chatId,
  text,
  settings
) {
  updateScheduleTimeAndRefresh(
    chatId,
    text,
    settings,
    'end_time'
  );
}

function updateScheduleTimeAndRefresh(
  chatId,
  text,
  settings,
  fieldName
) {
  const session =
    getUserSession(chatId);

  const providerId =
    session.schedule_provider_id;

  const dayCode =
    session.schedule_day_code;

  const value =
    normalizeTimeValue(text);

  if (!isValidTimeValue(value)) {
    setUserState(
      chatId,
      ADMIN_STATES.WAITING_SCHEDULE_DAY
    );

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.INVALID_TIME_FORMAT),
      buildScheduleDaysKeyboard()
    );

    return;
  }

  const currentSchedule =
    getProviderScheduleDay(
      providerId,
      dayCode
    );

  if (!currentSchedule) {
    setUserState(
      chatId,
      ADMIN_STATES.WAITING_SCHEDULE_DAY
    );

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.EDIT_ERROR),
      buildScheduleDaysKeyboard()
    );

    return;
  }

  const currentStartTime =
    formatScheduleTime(
      currentSchedule.start_time
    );

  const currentEndTime =
    formatScheduleTime(
      currentSchedule.end_time
    );

  const nextStartTime =
    fieldName === 'start_time'
      ? value
      : currentStartTime;

  const nextEndTime =
    fieldName === 'end_time'
      ? value
      : currentEndTime;

  const startMinutes =
    timeValueToMinutes(nextStartTime);

  const endMinutes =
    timeValueToMinutes(nextEndTime);

  if (
    startMinutes === null ||
    endMinutes === null ||
    startMinutes >= endMinutes
  ) {
    setUserState(
      chatId,
      ADMIN_STATES.WAITING_SCHEDULE_DAY
    );

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.INVALID_TIME_RANGE),
      buildScheduleDaysKeyboard()
    );

    return;
  }

  updateProviderScheduleField(
    providerId,
    dayCode,
    fieldName,
    value
  );

  updateProviderScheduleField(
    providerId,
    dayCode,
    'is_working',
    true
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SCHEDULE_UPDATED)
  );

  showProviderScheduleAdmin(
    chatId,
    providerId,
    settings
  );
}

function getProviderScheduleDay(
  providerId,
  dayCode
) {
  const schedule =
    getProviderSchedule(providerId);

  for (let i = 0; i < schedule.length; i++) {
    if (
      String(schedule[i].day_of_week) ===
      String(dayCode)
    ) {
      return schedule[i];
    }
  }

  return null;
}

function startProviderOverrides(
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

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_PROVIDER_FOR_OVERRIDE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.SELECT_PROVIDER_FOR_OVERRIDE
    ),
    buildKeyboardWithMainMenu(
      keyboardRows
    )
  );
}

function processProviderForOverride(
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
      getMessage(
        MESSAGE_KEYS.SELECT_PROVIDER_FROM_LIST
      ),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'override_provider_id',
    provider.id
  );

  showOverrideActions(
    chatId,
    settings
  );
}

function showOverrideActions(
  chatId,
  settings
) {
  setPreviousMenu(
    chatId,
    'OVERRIDE_PROVIDERS_LIST'
  );

  const session =
    getUserSession(chatId);

  const providerId =
    session.override_provider_id;

  const provider =
    findProviderById(providerId);

  const overrides =
    getProviderOverrides(providerId);

  let text =
    '<b>' +
    getMessage(MESSAGE_KEYS.ADMIN_PROVIDER_OVERRIDES) +
    '</b>\n\n';

  if (provider) {
    text += provider.name + '\n\n';
  }

  if (overrides.length === 0) {
    text +=
      getMessage(MESSAGE_KEYS.NO_OVERRIDES_FOUND) +
      '\n\n';
  } else {
    overrides.forEach(function(item) {
      text +=
        formatDateForDisplay(item.date) +
        ' — ' +
        getMessage(item.reason_key);

      if (String(item.is_working).toUpperCase() === 'TRUE') {
        text +=
          ' ' +
          formatScheduleTime(item.start_time) +
          '-' +
          formatScheduleTime(item.end_time);
      }

      text += '\n';
    });

    text += '\n';
  }

  const keyboard =
    buildKeyboardWithMainMenu([
      [
        {
          text: getMessage(MESSAGE_KEYS.ADD_OVERRIDE)
        }
      ],
      [
        {
          text: getMessage(MESSAGE_KEYS.DELETE_OVERRIDE)
        }
      ]
    ]);

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_OVERRIDE_ACTION
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    text,
    keyboard
  );
}

function processOverrideAction(
  chatId,
  text,
  settings
) {
  if (
    text ===
    getMessage(
      MESSAGE_KEYS.ADD_OVERRIDE
    )
  ) {
    showOverrideReasons(
      chatId,
      settings
    );

    return;
  }

  if (text === getMessage(MESSAGE_KEYS.DELETE_OVERRIDE)) {
    startDeleteOverride(chatId, settings);
    return;
  }
}

function showOverrideReasons(
  chatId,
  settings
) {
  const keyboard =
    buildKeyboardWithMainMenu([
      [
        {
          text: getMessage(
            MESSAGE_KEYS.REASON_VACATION
          )
        }
      ],
      [
        {
          text: getMessage(
            MESSAGE_KEYS.REASON_SICK_LEAVE
          )
        }
      ],
      [
        {
          text: getMessage(
            MESSAGE_KEYS.REASON_DAY_OFF
          )
        }
      ],
      [
        {
          text: getMessage(
            MESSAGE_KEYS.REASON_SHORT_DAY
          )
        }
      ]
    ]);

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_OVERRIDE_REASON
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.SELECT_REASON
    ),
    keyboard
  );
}

function showOverridesList(
  chatId,
  settings
) {
  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    'TODO'
  );
}

function processOverrideReason(
  chatId,
  text,
  settings
) {
  const reasons = {};

  reasons[
    getMessage(
      MESSAGE_KEYS.REASON_VACATION
    )
  ] = 'REASON_VACATION';

  reasons[
    getMessage(
      MESSAGE_KEYS.REASON_SICK_LEAVE
    )
  ] = 'REASON_SICK_LEAVE';

  reasons[
    getMessage(
      MESSAGE_KEYS.REASON_DAY_OFF
    )
  ] = 'REASON_DAY_OFF';

  reasons[
    getMessage(
      MESSAGE_KEYS.REASON_SHORT_DAY
    )
  ] = 'REASON_SHORT_DAY';

  const reasonKey =
    reasons[text];

  if (!reasonKey) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.SELECT_REASON
      )
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'override_reason_key',
    reasonKey
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_OVERRIDE_DATE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.ENTER_OVERRIDE_DATE
    ),
    buildKeyboardWithMainMenu([])
  );
}

function setPreviousMenu(chatId, menuName) {
  setUserSessionValue(
    chatId,
    'previous_menu',
    menuName
  );
}

function processAdminBack(chatId, settings) {
  const session = getUserSession(chatId);
  const previousMenu = session.previous_menu || '';
  const state = String(getUserState(chatId) || '').trim();

  if (
    state === ADMIN_STATES.WAITING_SCHEDULE_START_TIME ||
    state === ADMIN_STATES.WAITING_SCHEDULE_END_TIME
  ) {
    returnToScheduleDays(chatId, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_SCHEDULE_DAY) {
    clearUserSession(chatId);
    setUserState(chatId, '');

    sendProvidersMenu(chatId, settings);
    return;
  }

  if (
    previousMenu === 'PROVIDER_EDIT_FIELDS' ||
    state === ADMIN_STATES.WAITING_PROVIDER_FIELD_TO_EDIT
  ) {
    clearUserSession(chatId);
    setPreviousMenu(chatId, 'PROVIDERS_MENU');

    startEditProvider(chatId, settings);
    return;
  }

  if (
    previousMenu === 'OVERRIDE_PROVIDERS_LIST' ||
    state === ADMIN_STATES.WAITING_OVERRIDE_ACTION ||
    state === ADMIN_STATES.WAITING_OVERRIDE_REASON ||
    state === ADMIN_STATES.WAITING_OVERRIDE_DATE ||
    state === ADMIN_STATES.WAITING_OVERRIDE_START_TIME ||
    state === ADMIN_STATES.WAITING_OVERRIDE_END_TIME ||
    state === ADMIN_STATES.WAITING_OVERRIDE_TO_DELETE
  ) {
    clearUserSession(chatId);

    startProviderOverrides(
      chatId,
      settings
    );

    return;
  }

  if (previousMenu === 'PROVIDERS_MENU') {
    clearUserSession(chatId);
    setUserState(chatId, '');

    sendProvidersMenu(chatId, settings);
    return;
  }

  if (
    previousMenu === 'SERVICE_EDIT_FIELDS' ||
    state === ADMIN_STATES.WAITING_SERVICE_FIELD_TO_EDIT
  ) {
    clearUserSession(chatId);
    setPreviousMenu(chatId, 'SERVICES_MENU');

    startEditService(chatId, settings);
    return;
  }  

  if (
    previousMenu === 'SERVICES_MENU'
  ) {
    clearUserSession(chatId);

    sendServicesMenu(
      chatId,
      settings
    );

    return;
  }

  clearUserSession(chatId);
  setUserState(chatId, '');

  sendAdminMainMenu(chatId, settings);
}

function processOverrideDate(chatId, text, settings) {
  const dateValue = String(text || '').trim();

  if (!isValidDateValue(dateValue)) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.INVALID_DATE_FORMAT),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'override_date',
    dateValue
  );

  const session =
    getUserSession(chatId);

  if (session.override_reason_key === 'REASON_SHORT_DAY') {
    setUserState(
      chatId,
      ADMIN_STATES.WAITING_OVERRIDE_START_TIME
    );

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SCHEDULE_ACTION_START),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  createProviderScheduleOverrideFromSession(
    chatId
  );

  clearUserSession(chatId);
  setUserState(chatId, '');

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.OVERRIDE_CREATED),
    buildKeyboardWithMainMenu([])
  );
}

function processOverrideStartTime(
  chatId,
  text,
  settings
) {
  const value =
    normalizeTimeValue(text);

  if (!isValidTimeValue(value)) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.INVALID_TIME_FORMAT
      ),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'override_start_time',
    value
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_OVERRIDE_END_TIME
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.SCHEDULE_ACTION_END
    ),
    buildKeyboardWithMainMenu([])
  );
}

function processOverrideEndTime(
  chatId,
  text,
  settings
) {
  const value =
    normalizeTimeValue(text);

  if (!isValidTimeValue(value)) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.INVALID_TIME_FORMAT
      ),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  const session =
    getUserSession(chatId);

  const startMinutes =
    timeValueToMinutes(
      session.override_start_time
    );

  const endMinutes =
    timeValueToMinutes(value);

  if (
    startMinutes === null ||
    endMinutes === null ||
    startMinutes >= endMinutes
  ) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.INVALID_TIME_RANGE
      ),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'override_end_time',
    value
  );

  createShortDayOverride(
    chatId
  );

  clearUserSession(chatId);

  setUserState(
    chatId,
    ''
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.OVERRIDE_CREATED
    )
  );
}

function startDeleteOverride(chatId, settings) {
  const session = getUserSession(chatId);
  const providerId = session.override_provider_id;

  const overrides = getProviderOverrides(providerId);
  const keyboardRows = [];

  overrides.forEach(function(item, index) {
    keyboardRows.push([
      {
        text: buildOverrideLabel(item, index)
      }
    ]);
  });

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_OVERRIDE_TO_DELETE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_OVERRIDE_TO_DELETE),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processOverrideToDelete(chatId, text, settings) {
  const session = getUserSession(chatId);
  const providerId = session.override_provider_id;

  const overrides = getProviderOverrides(providerId);

  const selectedOverride = overrides.find(function(item, index) {
    return buildOverrideLabel(item, index) === String(text || '').trim();
  });

  if (!selectedOverride) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SELECT_OVERRIDE_TO_DELETE),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  disableProviderOverride(selectedOverride.override_id);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.OVERRIDE_DELETED)
  );

  showOverrideActions(chatId, settings);
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

function returnToScheduleDays(chatId, settings) {
  const session = getUserSession(chatId);
  const providerId = session.schedule_provider_id;

  if (!providerId) {
    clearUserSession(chatId);
    setUserState(chatId, '');

    sendProvidersMenu(chatId, settings);
    return;
  }

  setPreviousMenu(chatId, 'PROVIDERS_MENU');

  showProviderScheduleAdmin(
    chatId,
    providerId,
    settings
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

function sendServicesMenu(chatId, settings) {
  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ADMIN_SERVICES),
    buildServicesMenuKeyboard()
  );
}

function buildServicesMenuKeyboard() {
  return buildKeyboardWithMainMenu([
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_ADD_SERVICE) }],
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_SERVICE_LIST) }],
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_CUSTOMER_SERVICES) }],
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_SERVICE_EDIT) }],
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_SERVICE_DISABLE) }],
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_SERVICE_ENABLE) }]
  ]);
}

function startCreateService(chatId, settings) {
  setPreviousMenu(chatId, 'SERVICES_MENU');

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_SERVICE_NAME
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_SERVICE_NAME),
    buildKeyboardWithMainMenu([])
  );
}

function processServiceName(chatId, text, settings) {
  const serviceName = String(text || '').trim();

  if (!serviceName) {
    startCreateService(chatId, settings);
    return;
  }

  setUserSessionValue(
    chatId,
    'service_name',
    serviceName
  );

  showServiceLocations(chatId, settings);
}

function showServiceLocations(chatId, settings) {
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
    ADMIN_STATES.WAITING_SERVICE_LOCATION
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_SERVICE_LOCATION),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processServiceLocation(chatId, text, settings) {
  const location =
    findLocationByName(text);

  if (!location) {
    showServiceLocations(chatId, settings);
    return;
  }

  setUserSessionValue(
    chatId,
    'service_location_id',
    location.id
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_SERVICE_PRICE_MIN
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_SERVICE_PRICE_MIN),
    buildKeyboardWithMainMenu([])
  );
}

function processServicePriceMin(chatId, text, settings) {
  const priceMin =
    Number(String(text || '').trim());

  if (!priceMin || priceMin < 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.ENTER_SERVICE_PRICE_MIN),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'service_price_min',
    priceMin
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_SERVICE_PRICE_MAX
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_SERVICE_PRICE_MAX),
    buildKeyboardWithMainMenu([])
  );
}

function processServicePriceMax(chatId, text, settings) {
  const priceMax =
    Number(String(text || '').trim());

  const session =
    getUserSession(chatId);

  const priceMin =
    Number(session.service_price_min || 0);

  if (!priceMax || priceMax < priceMin) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.ENTER_SERVICE_PRICE_MAX),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'service_price_max',
    priceMax
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_SERVICE_DURATION_MIN
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_SERVICE_DURATION_MIN),
    buildKeyboardWithMainMenu([])
  );
}

function processServiceDurationMin(chatId, text, settings) {
  const durationMin =
    Number(String(text || '').trim());

  if (!durationMin || durationMin <= 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.ENTER_SERVICE_DURATION_MIN),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'service_duration_min',
    durationMin
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_SERVICE_DURATION_MAX
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_SERVICE_DURATION_MAX),
    buildKeyboardWithMainMenu([])
  );
}

function processServiceDurationMax(chatId, text, settings) {
  const durationMax =
    Number(String(text || '').trim());

  const session =
    getUserSession(chatId);

  const durationMin =
    Number(session.service_duration_min || 0);

  if (!durationMax || durationMax < durationMin) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.ENTER_SERVICE_DURATION_MAX),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'service_duration_max',
    durationMax
  );

  const updatedSession =
    getUserSession(chatId);

  const serviceId =
    createService({
      name: updatedSession.service_name,
      location_id: updatedSession.service_location_id,
      price_min: updatedSession.service_price_min,
      price_max: updatedSession.service_price_max,
      duration_min: updatedSession.service_duration_min,
      duration_max: updatedSession.service_duration_max
    });

  clearUserSession(chatId);
  setPreviousMenu(chatId, 'SERVICES_MENU');
  setUserState(chatId, '');

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SERVICE_CREATED) +
      '\n\nID: ' +
      serviceId,
    buildKeyboardWithMainMenu([])
  );
}

function startCreateService(chatId, settings) {
  setPreviousMenu(chatId, 'SERVICES_MENU');

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_SERVICE_NAME
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_SERVICE_NAME),
    buildKeyboardWithMainMenu([])
  );
}

function processServiceName(chatId, text, settings) {
  const serviceName = String(text || '').trim();

  if (!serviceName) {
    startCreateService(chatId, settings);
    return;
  }

  setUserSessionValue(
    chatId,
    'service_name',
    serviceName
  );

  showServiceLocations(chatId, settings);
}

function showServiceLocations(chatId, settings) {
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
    ADMIN_STATES.WAITING_SERVICE_LOCATION
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_SERVICE_LOCATION),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processServiceLocation(chatId, text, settings) {
  const location = findLocationByName(text);

  if (!location) {
    showServiceLocations(chatId, settings);
    return;
  }

  setUserSessionValue(
    chatId,
    'service_location_id',
    location.id
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_SERVICE_PRICE_MIN
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_SERVICE_PRICE_MIN),
    buildKeyboardWithMainMenu([])
  );
}
function processServicePriceMin(chatId, text, settings) {
  const priceMin = Number(String(text || '').trim());

  if (!priceMin || priceMin < 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.ENTER_SERVICE_PRICE_MIN),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'service_price_min',
    priceMin
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_SERVICE_PRICE_MAX
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_SERVICE_PRICE_MAX),
    buildKeyboardWithMainMenu([])
  );
}
function processServicePriceMax(chatId, text, settings) {
  const priceMax = Number(String(text || '').trim());
  const session = getUserSession(chatId);
  const priceMin = Number(session.service_price_min || 0);

  if (!priceMax || priceMax < priceMin) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.ENTER_SERVICE_PRICE_MAX),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'service_price_max',
    priceMax
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_SERVICE_DURATION_MIN
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_SERVICE_DURATION_MIN),
    buildKeyboardWithMainMenu([])
  );
}

function processServiceDurationMin(chatId, text, settings) {
  const durationMin = Number(String(text || '').trim());

  if (!durationMin || durationMin <= 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.ENTER_SERVICE_DURATION_MIN),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'service_duration_min',
    durationMin
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_SERVICE_DURATION_MAX
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_SERVICE_DURATION_MAX),
    buildKeyboardWithMainMenu([])
  );
}
function processServiceDurationMax(chatId, text, settings) {
  const durationMax = Number(String(text || '').trim());
  const session = getUserSession(chatId);
  const durationMin = Number(session.service_duration_min || 0);

  if (!durationMax || durationMax < durationMin) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.ENTER_SERVICE_DURATION_MAX),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'service_duration_max',
    durationMax
  );

  const updatedSession = getUserSession(chatId);

  const serviceId = createService({
    name: updatedSession.service_name,
    location_id: updatedSession.service_location_id,
    price_min: updatedSession.service_price_min,
    price_max: updatedSession.service_price_max,
    duration_min: updatedSession.service_duration_min,
    duration_max: updatedSession.service_duration_max
  });

  clearUserSession(chatId);
  setUserState(chatId, '');
  setPreviousMenu(chatId, 'SERVICES_MENU');

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SERVICE_CREATED) + '\n\nID: ' + serviceId,
    buildKeyboardWithMainMenu([])
  );
}

function showServicesListAdmin(chatId, settings) {
  setPreviousMenu(chatId, 'SERVICES_MENU');

  const services = getServices();

  if (services.length === 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.NO_SERVICES_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  let text =
    '<b>' +
    getMessage(MESSAGE_KEYS.SERVICES_LIST_TITLE) +
    '</b>\n\n';

  services.forEach(function(service, index) {
    const location =
      findLocationById(service.location_id);

    text +=
      String(index + 1) +
      '. <b>' +
      service.name +
      '</b>\n';

    text +=
      '📍 ' +
      (location ? location.name : service.location_id) +
      '\n';

    text +=
      getMessage(MESSAGE_KEYS.SERVICE_PRICE_LABEL) +
      ': ' +
      service.price_min +
      '-' +
      service.price_max +
      '\n';

    text +=
      getMessage(MESSAGE_KEYS.SERVICE_DURATION_LABEL) +
      ': ' +
      service.duration_min +
      '-' +
      service.duration_max +
      ' ' +
      getMessage(MESSAGE_KEYS.MINUTES_SHORT) +
      '\n\n';
  });

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    text,
    buildKeyboardWithMainMenu([])
  );
}

function startEditService(chatId, settings) {
  setPreviousMenu(chatId, 'SERVICES_MENU');

  const services = getServices();
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
    ADMIN_STATES.WAITING_SERVICE_TO_EDIT
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_SERVICE_FROM_LIST),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processServiceToEdit(chatId, text, settings) {
  const service = findServiceByName(text);

  if (!service) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SELECT_SERVICE_FROM_LIST),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  showServiceEditFields(
    chatId,
    service.id,
    settings
  );
}

function showServiceEditFields(chatId, serviceId, settings) {
  setUserSessionValue(chatId, 'edit_service_id', serviceId);
  setUserSessionValue(chatId, 'edit_service_field', '');

  setPreviousMenu(chatId, 'SERVICE_EDIT_FIELDS');

  const keyboard = buildKeyboardWithMainMenu([
    [{ text: getMessage(MESSAGE_KEYS.SERVICE_FIELD_NAME) }],
    [{ text: getMessage(MESSAGE_KEYS.SERVICE_FIELD_LOCATION) }],
    [{ text: getMessage(MESSAGE_KEYS.SERVICE_FIELD_PRICE_MIN) }],
    [{ text: getMessage(MESSAGE_KEYS.SERVICE_FIELD_PRICE_MAX) }],
    [{ text: getMessage(MESSAGE_KEYS.SERVICE_FIELD_DURATION_MIN) }],
    [{ text: getMessage(MESSAGE_KEYS.SERVICE_FIELD_DURATION_MAX) }]
  ]);

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_SERVICE_FIELD_TO_EDIT
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_SERVICE_FIELD),
    keyboard
  );
}

function processServiceFieldToEdit(chatId, text, settings) {
  const fieldText = String(text || '').trim();

  const allowedFields = {};

  allowedFields[getMessage(MESSAGE_KEYS.SERVICE_FIELD_NAME)] = 'name';
  allowedFields[getMessage(MESSAGE_KEYS.SERVICE_FIELD_LOCATION)] = 'location_id';
  allowedFields[getMessage(MESSAGE_KEYS.SERVICE_FIELD_PRICE_MIN)] = 'price_min';
  allowedFields[getMessage(MESSAGE_KEYS.SERVICE_FIELD_PRICE_MAX)] = 'price_max';
  allowedFields[getMessage(MESSAGE_KEYS.SERVICE_FIELD_DURATION_MIN)] = 'duration_min';
  allowedFields[getMessage(MESSAGE_KEYS.SERVICE_FIELD_DURATION_MAX)] = 'duration_max';

  const field = allowedFields[fieldText];

  if (!field) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SELECT_SERVICE_FIELD),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(chatId, 'edit_service_field', field);

  if (field === 'location_id') {
    showServiceEditLocations(chatId, settings);
    return;
  }

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_SERVICE_NEW_VALUE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_NEW_VALUE),
    buildKeyboardWithMainMenu([])
  );
}

function showServiceEditLocations(chatId, settings) {
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
    ADMIN_STATES.WAITING_SERVICE_NEW_VALUE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_SERVICE_LOCATION),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processServiceNewValue(chatId, text, settings) {
  const session = getUserSession(chatId);

  const serviceId = session.edit_service_id;
  const field = session.edit_service_field;

  if (!serviceId || !field) {
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
    const location = findLocationByName(value);

    if (!location) {
      sendTelegramMessage(
        settings.AdminBotToken,
        chatId,
        getMessage(MESSAGE_KEYS.SELECT_SERVICE_LOCATION),
        buildKeyboardWithMainMenu([])
      );

      return;
    }

    value = location.id;
  }

  if (
    field === 'price_min' ||
    field === 'price_max' ||
    field === 'duration_min' ||
    field === 'duration_max'
  ) {
    value = Number(value);

    if (!value || value < 0) {
      sendTelegramMessage(
        settings.AdminBotToken,
        chatId,
        getMessage(MESSAGE_KEYS.ENTER_NEW_VALUE),
        buildKeyboardWithMainMenu([])
      );

      return;
    }
  }

  updateServiceField(
    serviceId,
    field,
    value
  );

  setUserSessionValue(chatId, 'edit_service_field', '');

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SERVICE_UPDATED)
  );

  showServiceEditFields(
    chatId,
    serviceId,
    settings
  );
}

function processServiceToDisable(chatId, text, settings) {
  const service = findServiceByName(text);

  if (!service) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SELECT_SERVICE_FROM_LIST),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setServiceActive(
    service.id,
    false
  );

  clearUserSession(chatId);
  setUserState(chatId, '');
  setPreviousMenu(chatId, 'SERVICES_MENU');

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SERVICE_DISABLED) || 'Услуга отключена',
    buildKeyboardWithMainMenu([])
  );
}

function startDisableService(
  chatId,
  settings
) {
  setPreviousMenu(
    chatId,
    'SERVICES_MENU'
  );

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
    ADMIN_STATES.WAITING_SERVICE_TO_DISABLE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.SELECT_SERVICE_FROM_LIST
    ),
    buildKeyboardWithMainMenu(
      keyboardRows
    )
  );
}

function startEnableService(chatId, settings) {
  setPreviousMenu(chatId, 'SERVICES_MENU');

  const services = getInactiveServices();
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
    ADMIN_STATES.WAITING_SERVICE_TO_ENABLE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_SERVICE_FROM_LIST),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processServiceToEnable(chatId, text, settings) {
  const service = findInactiveServiceByName(text);

  if (!service) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SELECT_SERVICE_FROM_LIST),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setServiceActive(
    service.id,
    true
  );

  clearUserSession(chatId);
  setUserState(chatId, '');
  setPreviousMenu(chatId, 'SERVICES_MENU');

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SERVICE_ENABLED) || 'Услуга включена',
    buildKeyboardWithMainMenu([])
  );
}

function startCustomerServices(chatId, settings) {
  setPreviousMenu(chatId, 'SERVICES_MENU');

  setUserState(
    chatId,
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

function sendAppointmentsMenu(chatId, settings) {
  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS),
    buildAppointmentsMenuKeyboard()
  );
}

function buildAppointmentsMenuKeyboard() {
  return buildKeyboardWithMainMenu([
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_TODAY) }],
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_TOMORROW) }],
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_NEXT_WORKING_DAY) }],
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_BY_PROVIDER) }],
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_BY_DATE) }]
  ]);
}

function showTodayAppointmentsAdmin(chatId, settings) {
  setPreviousMenu(chatId, 'APPOINTMENTS_MENU');

  const today =
    Utilities.formatDate(
      new Date(),
      settings.TimeZone || 'Europe/Kyiv',
      'yyyy-MM-dd'
    );

  const appointments =
    getCachedAppointmentsByDate(today);

  if (appointments.length === 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.NO_APPOINTMENTS_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  let text =
    '<b>' +
    getMessage(MESSAGE_KEYS.APPOINTMENTS_TODAY_TITLE) +
    '</b>\n\n';

  appointments.forEach(function(appointment) {
    const customerText =
      String(appointment.customer_name || '').trim()
        ? String(appointment.customer_name || '').trim() +
          ' ' +
          String(appointment.phone || '').trim()
        : String(appointment.phone || '').trim();

    const serviceText =
      String(appointment.service_name || '').trim();

    const providerText =
      String(appointment.provider_name || '').trim();

    const locationText =
      String(appointment.location_name || '').trim();

    text +=
      '<b>' +
      extractTimeFromDateTime(appointment.start_at) +
      '-' +
      extractTimeFromDateTime(appointment.end_at) +
      '</b>\n';

    text +=
      '👤 ' +
      (customerText || '-') +
      '\n';

    text +=
      '💅 ' +
      (serviceText || '-') +
      '\n';

    text +=
      '👩‍💼 ' +
      (providerText || '-') +
      '\n';

    text +=
      '📍 ' +
      (locationText || '-') +
      '\n';

    if (appointment.source === 'calendar_manual') {
      text +=
        '📌 ' +
        getMessage(
          MESSAGE_KEYS.MANUAL_CALENDAR_APPOINTMENT_LABEL
        ) +
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

function showTomorrowAppointments(
  chatId,
  settings
) {
  setPreviousMenu(chatId, 'APPOINTMENTS_MENU');

  const tomorrow = new Date();

  tomorrow.setDate(
    tomorrow.getDate() + 1
  );

  const dateString =
    Utilities.formatDate(
      tomorrow,
      settings.TimeZone || 'Europe/Kyiv',
      'yyyy-MM-dd'
    );

  const appointments =
    getCachedAppointmentsByDate(dateString);

  if (appointments.length === 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.NO_APPOINTMENTS_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  let text =
    '<b>' +
    getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_TOMORROW) +
    '</b>\n\n';

  appointments.forEach(function(appointment) {
    const customerText =
      String(appointment.customer_name || '').trim()
        ? String(appointment.customer_name || '').trim() +
          ' ' +
          String(appointment.phone || '').trim()
        : String(appointment.phone || '').trim();

    const serviceText =
      String(appointment.service_name || '').trim();

    const providerText =
      String(appointment.provider_name || '').trim();

    const locationText =
      String(appointment.location_name || '').trim();

    text +=
      '<b>' +
      extractTimeFromDateTime(appointment.start_at) +
      '-' +
      extractTimeFromDateTime(appointment.end_at) +
      '</b>\n';

    text +=
      '👤 ' +
      (customerText || '-') +
      '\n';

    text +=
      '💅 ' +
      (serviceText || '-') +
      '\n';

    text +=
      '👩‍💼 ' +
      (providerText || '-') +
      '\n';

    text +=
      '📍 ' +
      (locationText || '-') +
      '\n';

    if (appointment.source === 'calendar_manual') {
      text +=
        '📌 ' +
        getMessage(
          MESSAGE_KEYS.MANUAL_CALENDAR_APPOINTMENT_LABEL
        ) +
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

function startAppointmentsByProvider(chatId, settings) {
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
    ADMIN_STATES.WAITING_APPOINTMENTS_PROVIDER
  );

  setPreviousMenu(
    chatId,
    'APPOINTMENTS_MENU'
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_PROVIDER_FOR_APPOINTMENTS),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processAppointmentsProvider(chatId, text, settings) {
  const provider =
    findProviderByName(text);

  if (!provider) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.PROVIDER_SELECT_FROM_LIST)
    );

    return;
  }

  setUserState(chatId, '');

  showAppointmentsByProviderAdmin(
    chatId,
    settings,
    provider
  );
}

function showAppointmentsByProviderAdmin(
  chatId,
  settings,
  provider
) {
  const appointments =
    getCachedAppointmentsByProvider(
      provider.provider_id
    );

  if (appointments.length === 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.NO_APPOINTMENTS_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  let text =
    '<b>' +
    getMessage(MESSAGE_KEYS.APPOINTMENTS_BY_PROVIDER_TITLE) +
    ': ' +
    provider.name +
    '</b>\n\n';

  appointments.forEach(function(appointment) {
    text +=
      '<b>' +
      formatDateTimeForDisplay(appointment.start_at) +
      ' - ' +
      extractTimeFromDateTime(appointment.end_at) +
      '</b>\n';

    text +=
      '👤 ' +
      (
        appointment.customer_name
          ? appointment.customer_name + ' ' + appointment.phone
          : appointment.phone || '-'
      ) +
      '\n';

    text +=
      '💅 ' +
      (appointment.service_name || '-') +
      '\n';

    text +=
      '📍 ' +
      (appointment.location_name || '-') +
      '\n';

    if (appointment.customer_note) {
      text +=
        '📝 ' +
        appointment.customer_note +
        '\n';
    }

    if (appointment.source === 'calendar_manual') {
      text +=
        '📌 ' +
        getMessage(MESSAGE_KEYS.MANUAL_CALENDAR_APPOINTMENT_LABEL) +
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

function startAppointmentsByDate(chatId, settings) {
  const keyboardRows =
    buildAppointmentDateKeyboardRows(settings);

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_APPOINTMENTS_DATE
  );

  setPreviousMenu(
    chatId,
    'APPOINTMENTS_MENU'
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_APPOINTMENT_DATE),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function buildAppointmentDateKeyboardRows(settings) {
  const timezone =
    settings.TimeZone || 'Europe/Kyiv';

  const rows = [];

  const cacheDays =
    Number(
      settings.CalendarCacheDays || 30
    );

  for (let i = 0; i <= cacheDays; i++) {
    const date = new Date();

    date.setDate(
      date.getDate() + i
    );

    rows.push([
      {
        text: Utilities.formatDate(
          date,
          timezone,
          'dd.MM.yyyy'
        )
      }
    ]);
  }

  return rows;
}

function processAppointmentsDate(chatId, text, settings) {
  const dateValue =
    parseDateFromDisplayText(text, settings);

  if (!dateValue) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SELECT_APPOINTMENT_DATE)
    );

    return;
  }

  setUserState(chatId, '');

  showAppointmentsByDateAdmin(
    chatId,
    settings,
    dateValue
  );
}

function showAppointmentsByDateAdmin(
  chatId,
  settings,
  dateValue
) {
  const appointments =
    getCachedAppointmentsByDate(dateValue);

  if (appointments.length === 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.NO_APPOINTMENTS_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  let text =
    '<b>' +
    getMessage(MESSAGE_KEYS.APPOINTMENTS_BY_DATE_TITLE) +
    ': ' +
    formatDateForDisplay(dateValue) +
    '</b>\n\n';

  appointments.forEach(function(appointment) {
    text +=
      '<b>' +
      extractTimeFromDateTime(appointment.start_at) +
      '-' +
      extractTimeFromDateTime(appointment.end_at) +
      '</b>\n';

    text +=
      '👤 ' +
      (
        appointment.customer_name
          ? appointment.customer_name + ' ' + appointment.phone
          : appointment.phone || '-'
      ) +
      '\n';

    text +=
      '💅 ' +
      (appointment.service_name || '-') +
      '\n';

    text +=
      '👩‍💼 ' +
      (appointment.provider_name || '-') +
      '\n';

    text +=
      '📍 ' +
      (appointment.location_name || '-') +
      '\n';

    if (appointment.customer_note) {
      text +=
        '📝 ' +
        appointment.customer_note +
        '\n';
    }

    if (appointment.source === 'calendar_manual') {
      text +=
        '📌 ' +
        getMessage(MESSAGE_KEYS.MANUAL_CALENDAR_APPOINTMENT_LABEL) +
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

function startNextWorkingDayAppointments(
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

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_NEXT_WORKING_DAY_PROVIDER
  );

  setPreviousMenu(
    chatId,
    'APPOINTMENTS_MENU'
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.SELECT_PROVIDER_FOR_NEXT_WORKING_DAY
    ),
    buildKeyboardWithMainMenu(
      keyboardRows
    )
  );
}

function processNextWorkingDayProvider(
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
      getMessage(
        MESSAGE_KEYS.PROVIDER_SELECT_FROM_LIST
      )
    );

    return;
  }

  setUserState(chatId, '');

  showNextWorkingDayAppointmentsAdmin(
    chatId,
    settings,
    provider
  );
}

function showNextWorkingDayAppointmentsAdmin(
  chatId,
  settings,
  provider
) {
  const providerId =
    provider.provider_id ||
    provider.id;

  const nextWorkingDate =
    getNextWorkingDateForProvider(
      providerId
    );

  if (!nextWorkingDate) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.NO_APPOINTMENTS_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  const appointments =
    getCachedAppointmentsByDate(
      nextWorkingDate
    ).filter(function(appointment) {
      return (
        String(appointment.provider_id) ===
        String(providerId)
      );
    });

  if (appointments.length === 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.NO_APPOINTMENTS_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  let text =
    '<b>' +
    getMessage(MESSAGE_KEYS.APPOINTMENTS_NEXT_WORKING_DAY_TITLE) +
    ': ' +
    provider.name +
    ' — ' +
    formatDateForDisplay(nextWorkingDate) +
    '</b>\n\n';

  appointments.forEach(function(appointment) {
    text +=
      '<b>' +
      extractTimeFromDateTime(appointment.start_at) +
      '-' +
      extractTimeFromDateTime(appointment.end_at) +
      '</b>\n';

    text +=
      '👤 ' +
      (
        appointment.customer_name
          ? appointment.customer_name + ' ' + appointment.phone
          : appointment.phone || '-'
      ) +
      '\n';

    text +=
      '💅 ' +
      (appointment.service_name || '-') +
      '\n';

    text +=
      '📍 ' +
      (appointment.location_name || '-') +
      '\n';

    if (appointment.customer_note) {
      text +=
        '📝 ' +
        appointment.customer_note +
        '\n';
    }

    if (appointment.source === 'calendar_manual') {
      text +=
        '📌 ' +
        getMessage(MESSAGE_KEYS.MANUAL_CALENDAR_APPOINTMENT_LABEL) +
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

function sendCustomersMenu(
  chatId,
  settings
) {
  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ADMIN_CUSTOMERS),
    buildCustomersMenuKeyboard()
  );
}

function buildCustomersMenuKeyboard() {
  return buildKeyboardWithMainMenu([
    [
      {
        text: getMessage(MESSAGE_KEYS.CUSTOMER_PROFILES_LIST)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_EDIT)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_CREATE)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_DELETE)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.CUSTOMER_CONFLICTS_MENU)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.CUSTOMER_VISIT_HISTORY)
      }
    ],
  ]);
}

function startCustomerProfile(
  chatId,
  settings
) {
  setUserState(
    chatId,
    ADMIN_STATES.WAITING_CUSTOMER_PROFILE_PHONE
  );

  setPreviousMenu(
    chatId,
    'CUSTOMERS_MENU'
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_CUSTOMER_PHONE),
    buildKeyboardWithMainMenu([])
  );
}

function processCustomerProfilePhone(
  chatId,
  text,
  settings
) {
  const profile =
    findCustomerProfileByPhone(text);

  if (!profile || profile.active === false) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.CUSTOMER_NOT_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserState(chatId, '');

  showCustomerProfile(
    chatId,
    settings,
    profile
  );
}

function showCustomerProfile(
  chatId,
  settings,
  profile
) {
  const nextAppointment =
    getNextCustomerAppointment(
      profile.phone
    );

  let text =
    '<b>' +
    getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_TITLE) +
    '</b>\n\n';

  text +=
    '<b>Основная информация</b>\n';

  text +=
    '👤 Имя: ' +
    (profile.name || '-') +
    '\n';

  text +=
    '📞 Телефон: ' +
    formatPhoneForDisplay(
      profile.phone
    ) +
    '\n\n';

  text +=
    '<b>Записи и визиты</b>\n';

  text +=
    '📅 Последний визит: ' +
    (
      profile.last_visit_at
        ? formatDateTimeForDisplay(
            profile.last_visit_at
          )
        : '-'
    ) +
    '\n';

  text +=
    '🔢 Всего визитов: ' +
    (profile.visit_count || 0) +
    '\n\n';

  text +=
    '<b>Следующая запись</b>\n';

  if (nextAppointment) {
    text +=
      '🕒 ' +
      formatDateTimeForDisplay(
        nextAppointment.start_at
      ) +
      '\n';

    text +=
      '💇 ' +
      (nextAppointment.service_name || '-') +
      '\n';

    text +=
      '👩 ' +
      (nextAppointment.provider_name || '-') +
      '\n';

    text +=
      '🏢 ' +
      (nextAppointment.location_name || '-') +
      '\n\n';
  } else {
    text +=
      'Записей нет\n\n';
  }

  text +=
    '<b>Информация для мастера</b>\n';

  text +=
    '🛍 Подсказка продажи: ' +
    (profile.sales_hint || '-') +
    '\n';

  text +=
    '📝 Заметка: ' +
    (profile.note || '-') +
    '\n';

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    text,
    buildKeyboardWithMainMenu([])
  );
}

function startEditCustomerProfile(
  chatId,
  settings
) {
  setUserState(
    chatId,
    ADMIN_STATES.WAITING_CUSTOMER_PROFILE_EDIT_PHONE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.ENTER_CUSTOMER_PHONE
    ),
    buildKeyboardWithMainMenu([])
  );
}

function processEditCustomerProfilePhone(
  chatId,
  text,
  settings
) {
  const profile =
    findCustomerProfileByPhone(text);

  if (!profile || profile.active === false) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.CUSTOMER_NOT_FOUND
      ) +
        '\n\n' +
        getMessage(
          MESSAGE_KEYS.ENTER_CUSTOMER_PHONE
        ),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'customer_profile_id',
    profile.profile_id
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_CUSTOMER_PROFILE_EDIT_FIELD
  );

  showCustomerProfileEditFieldMenu(
    chatId,
    settings,
    profile
  );
}

function showCustomerProfileEditFieldMenu(
  chatId,
  settings,
  profile
) {
  let text =
    '<b>' +
    getMessage(
      MESSAGE_KEYS.CUSTOMER_PROFILE_TITLE
    ) +
    '</b>\n\n';

  text +=
    '<b>Основная информация</b>\n';

  text +=
    '👤 Имя: ' +
    (profile.name || '-') +
    '\n';

  text +=
    '📞 Телефон: ' +
    (profile.phone || '-') +
    '\n\n';

  text +=
    '<b>Визиты</b>\n';

  text +=
    '📅 Последняя запись: ' +
    (
      profile.last_visit_at
        ? formatDateTimeForDisplay(
            profile.last_visit_at
          )
        : '-'
    ) +
    '\n';

  text +=
    '🔢 Всего записей: ' +
    (profile.visit_count || 0) +
    '\n\n';

  text +=
    '<b>Информация для мастера</b>\n';

  text +=
    '🛍 Подсказка продажи: ' +
    (profile.sales_hint || '-') +
    '\n';

  text +=
    '📝 Заметка: ' +
    (profile.note || '-') +
    '\n\n';

  text +=
    '<b>' +
    getMessage(
      MESSAGE_KEYS.CUSTOMER_PROFILE_EDIT_FIELD
    ) +
    '</b>';

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    text,
    buildCustomerProfileEditFieldKeyboard()
  );
}

function buildCustomerProfileEditFieldKeyboard() {
  return buildKeyboardWithMainMenu([
    [
      {
        text: getMessage(
          MESSAGE_KEYS.CUSTOMER_PROFILE_EDIT_NAME
        )
      }
    ],
    [
      {
        text: getMessage(
          MESSAGE_KEYS.CUSTOMER_PROFILE_EDIT_SALES_HINT
        )
      }
    ],
    [
      {
        text: getMessage(
          MESSAGE_KEYS.CUSTOMER_PROFILE_EDIT_NOTE
        )
      }
    ]
  ]);
}

function processEditCustomerProfileField(
  chatId,
  text,
  settings
) {
  let field = '';

  if (
    text ===
    getMessage(
      MESSAGE_KEYS.CUSTOMER_PROFILE_EDIT_NAME
    )
  ) {
    field = 'name';
  }

  if (
    text ===
    getMessage(
      MESSAGE_KEYS.CUSTOMER_PROFILE_EDIT_SALES_HINT
    )
  ) {
    field = 'sales_hint';
  }

  if (
    text ===
    getMessage(
      MESSAGE_KEYS.CUSTOMER_PROFILE_EDIT_NOTE
    )
  ) {
    field = 'note';
  }

  if (!field) {
    return;
  }

  setUserSessionValue(
    chatId,
    'customer_profile_field',
    field
  );

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_CUSTOMER_PROFILE_EDIT_VALUE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.CUSTOMER_PROFILE_ENTER_NEW_VALUE
    ),
    buildKeyboardWithMainMenu([])
  );
}

function processEditCustomerProfileValue(
  chatId,
  text,
  settings
) {
  const session =
    getUserSession(chatId);

  const profileId =
    session.customer_profile_id;

  const field =
    session.customer_profile_field;

  if (!profileId || !field) {
    setUserState(chatId, '');

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.CUSTOMER_NOT_FOUND
      ),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  let updated = false;

  if (field === 'phone') {
    updated =
      updateCustomerProfilePhone(
        profileId,
        text
      );
  } else {
    const updates = {};

    updates[field] = text;

    updated =
      updateCustomerProfile(
        profileId,
        updates
      );
  }

  setUserState(chatId, '');

  if (!updated) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.CUSTOMER_NOT_FOUND
      ),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.CUSTOMER_PROFILE_UPDATED
    ),
    buildKeyboardWithMainMenu([])
  );
}

function processEditCustomerProfileValue(
  chatId,
  text,
  settings
) {
  const session =
    getUserSession(chatId);

  const profileId =
    session.customer_profile_id;

  const field =
    session.customer_profile_field;

  if (!profileId || !field) {
    setUserState(chatId, '');

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.CUSTOMER_NOT_FOUND
      ),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  const updates = {};

  updates[field] = text;

  const updated =
    updateCustomerProfile(
      profileId,
      updates
    );

  setUserState(chatId, '');

  if (!updated) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.CUSTOMER_NOT_FOUND
      ),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.CUSTOMER_PROFILE_UPDATED
    ),
    buildKeyboardWithMainMenu([])
  );
}

function startCustomerProfilesList(
  chatId,
  settings
) {
  setUserSessionValue(
    chatId,
    'customer_list_page',
    1
  );

  showCustomerProfilesList(
    chatId,
    settings,
    1
  );
}

function showCustomerProfilesList(
  chatId,
  settings,
  page
) {
  page = page || 1;

  const profiles =
    getCustomerProfiles()
      .filter(function(profile) {
        return (
          String(profile.active).toUpperCase() === 'TRUE' ||
          profile.active === true
        );
      });

  if (profiles.length === 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.NO_CUSTOMER_PROFILES_FOUND
      ),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  profiles.sort(function(a, b) {
    return String(
      a.name || ''
    ).localeCompare(
      String(
        b.name || ''
      )
    );
  });

  const totalPages =
    Math.ceil(
      profiles.length /
      CUSTOMER_LIST_PAGE_SIZE
    );

  const startIndex =
    (page - 1) *
    CUSTOMER_LIST_PAGE_SIZE;

  const endIndex =
    startIndex +
    CUSTOMER_LIST_PAGE_SIZE;

  const pageProfiles =
    profiles.slice(
      startIndex,
      endIndex
    );

  let text =
    '<b>' +
    getMessage(
      MESSAGE_KEYS.CUSTOMER_PROFILES_LIST_TITLE
    ) +
    '</b>\n';

  text +=
    '(' +
    page +
    '/' +
    totalPages +
    ')\n\n';

  pageProfiles.forEach(function(
    profile,
    index
  ) {
    text +=
      (
        startIndex +
        index +
        1
      ) +
      '. 👤 ' +
      (
        profile.name ||
        '-'
      ) +
      '\n';

    text +=
      '   📞 ' +
      formatPhoneForDisplay(
        profile.phone
      ) +
      '\n\n';
  });

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    text,
    buildCustomerListKeyboard(
      page,
      totalPages
    )
  );
}

function buildCustomerListKeyboard(
  page,
  totalPages
) {
  const rows = [];

  const navigationRow = [];

  if (page > 1) {
    navigationRow.push({
      text: getMessage(
        MESSAGE_KEYS.CUSTOMER_LIST_PREVIOUS
      )
    });
  }

  if (page < totalPages) {
    navigationRow.push({
      text: getMessage(
        MESSAGE_KEYS.CUSTOMER_LIST_NEXT
      )
    });
  }

  if (navigationRow.length > 0) {
    rows.push(navigationRow);
  }

  return buildKeyboardWithMainMenu(rows);
}

function startCustomerVisitHistory(
  chatId,
  settings
) {
  setUserState(
    chatId,
    ADMIN_STATES.WAITING_CUSTOMER_VISIT_HISTORY_PHONE
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.ENTER_CUSTOMER_PHONE
    ),
    buildKeyboardWithMainMenu([])
  );
}

function processCustomerVisitHistoryPhone(
  chatId,
  text,
  settings
) {
  const profile =
    findCustomerProfileByPhone(text);

  if (!profile) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.CUSTOMER_NOT_FOUND
      ),
      buildKeyboardWithMainMenu([])
    );

    startCustomerVisitHistory(
      chatId,
      settings
    );

    return;
  }

  showCustomerVisitHistory(
    chatId,
    profile,
    settings
  );
}

function showCustomerVisitHistory(
  chatId,
  profile,
  settings
) {

  const visits =
    getCustomerVisitHistoryByPhone(
      profile.phone
    );

  setUserState(
    chatId,
    ''
  );

  if (visits.length === 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.NO_CUSTOMER_VISITS_FOUND
      ),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  let text =
    '<b>' +
    getMessage(
      MESSAGE_KEYS.CUSTOMER_VISIT_HISTORY_TITLE
    ) +
    '</b>\n\n';

  text +=
    '👤 ' +
    (profile.name || '-') +
    '\n';

  text +=
    '📞 ' +
    formatPhoneForDisplay(
      profile.phone
    ) +
    '\n';

  text +=
    '📊 Всего посещений: ' +
    visits.length +
    '\n\n';

  visits.forEach(function(
    visit,
    index
  ) {
    text +=
      '#' + (index + 1) +
      '.\n';

    text +=
      '📅 ' +
      formatDateTimeForDisplay(
        visit.start_at
      ) +
      '\n';

    text +=
      '💇 ' +
      (visit.service_name || '-') +
      '\n';

    text +=
      '👩 ' +
      (visit.provider_name || '-') +
      '\n';

    text +=
      '🏢 ' +
      (visit.location_name || '-') +
      '\n';

    text +=
      (
        visit.source === 'calendar_manual'
          ? '✍️ Ручная запись'
          : '🤖 Через бот'
      ) +
      '\n\n';
  });

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    text,
    buildKeyboardWithMainMenu([])
  );
}


