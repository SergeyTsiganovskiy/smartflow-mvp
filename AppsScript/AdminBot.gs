function sendAdminMainMenu(chatId, settings) {
  resetNavigation(chatId);

  pushNavigation(
    chatId,
    ADMIN_MENUS.MAIN
  );

  const keyboard = {
    keyboard: [
      [{ text: getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS) }],
      [{ text: getMessage(MESSAGE_KEYS.ADMIN_CUSTOMERS) }],
      [{ text: getMessage(MESSAGE_KEYS.ADMIN_SETTINGS) }],
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
    addAuditLog(
      'ADMIN_PROVIDERS_CLICK',
      JSON.stringify({
        stackBefore: getNavigationStack(chatId),
        state: getUserState(chatId)
      })
    );

    setUserState(chatId, '');

    sendProvidersMenu(chatId, settings);

    addAuditLog(
      'ADMIN_PROVIDERS_AFTER',
      JSON.stringify({
        stackAfter: getNavigationStack(chatId),
        state: getUserState(chatId)
      })
    );

    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_SERVICES)) {
    setUserState(chatId, '');

    sendServicesMenu(
      chatId,
      settings
    );

    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS)) {
    clearUserSession(chatId);
    setUserState(chatId, '');

    sendAppointmentsMenu(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.ADMIN_LOCATIONS)) {
    setUserState(chatId, '');

    sendLocationsMenu(
      chatId,
      settings
    );

    return;
  }

  if (
    text === getMessage(MESSAGE_KEYS.ADMIN_SETTINGS)
  ) {
    sendSettingsMenu(
      chatId,
      settings
    );

    return;
  }

  // =========================
  // PROVIDERS MENU COMMANDS
  // =========================

  if (
    text === getMessage(
      MESSAGE_KEYS.ADMIN_ADD_PROVIDER
    )
  ) {

    resetProviderWizardSession(
      chatId
    );

    startCreateProvider(
      chatId,
      settings
    );

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
    resetServiceWizardSession(chatId);
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
  // LOCATIONS MENU COMMANDS
  // =========================

  if (
    text ===
    getMessage(
      MESSAGE_KEYS.LOCATIONS_LIST
    )
  ) {
    showLocationsListAdmin(
      chatId,
      settings
    );

    return;
  }

  if (
    text ===
    getMessage(
      MESSAGE_KEYS.LOCATION_ADD
    )
  ) {
    startCreateLocation(
      chatId,
      settings
    );

    return;
  }

  if (
    text ===
    getMessage(MESSAGE_KEYS.LOCATION_DISABLE)
  ) {
    startDisableLocation(
      chatId,
      settings
    );

    return;
  }

  if (
    text ===
    getMessage(
      MESSAGE_KEYS.LOCATION_ENABLE
    )
  ) {
    startEnableLocation(
      chatId,
      settings
    );

    return;
  }

  if (
    text ===
    getMessage(
      MESSAGE_KEYS.LOCATION_EDIT
    )
  ) {
    startEditLocation(
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
  // CREATE LOCATIONS STATES
  // =========================

  if (
    state ===
    ADMIN_STATES.WAITING_LOCATION_NAME
  ) {
    processLocationName(
      chatId,
      text,
      settings
    );

    return;
  }

    if (
    state ===
    ADMIN_STATES.WAITING_LOCATION_ADDRESS
  ) {
    processLocationAddress(
      chatId,
      text,
      settings
    );

    return;
  }

  if (
    state ===
    ADMIN_STATES.WAITING_LOCATION_PHONE
  ) {
    processLocationPhone(
      chatId,
      text,
      settings
    );

    return;
  }

  if (
    state ===
    ADMIN_STATES.WAITING_LOCATION_TO_DISABLE
  ) {
    processDisableLocation(
      chatId,
      text,
      settings
    );

    return;
  }

  if (
    state ===
    ADMIN_STATES.WAITING_LOCATION_TO_ENABLE
  ) {
    processEnableLocation(
      chatId,
      text,
      settings
    );

    return;
  }

  if (
    state ===
    ADMIN_STATES.WAITING_LOCATION_TO_EDIT
  ) {
    processLocationToEdit(
      chatId,
      text,
      settings
    );

    return;
  }

  if (
    state ===
    ADMIN_STATES.WAITING_LOCATION_FIELD_TO_EDIT
  ) {
    processLocationFieldSelection(
      chatId,
      text,
      settings
    );

    return;
  }

  if (
    state ===
    ADMIN_STATES.WAITING_LOCATION_NEW_VALUE
  ) {
    processLocationNewValue(
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

  const adminIds =
    String(settings.AdminTelegramIds || '')
      .split(',')
      .map(function(id) {
        return String(id).trim();
      })
      .filter(function(id) {
        return id;
      });

  const chatIdText =
    String(chatId).trim();

  return adminIds.indexOf(chatIdText) !== -1;
}

function setPreviousMenu(chatId, menuName) {
  setUserSessionValue(
    chatId,
    'previous_menu',
    menuName
  );
}

function processAdminBack(chatId, settings) {
  const session =
    getUserSession(chatId);

  const state =
    String(getUserState(chatId) || '').trim();

  addAuditLog(
  'ADMIN_BACK_STACK_DEBUG',
  JSON.stringify({
    state: state,
    stack: getNavigationStack(chatId),
    current: getCurrentNavigation(chatId)
  })
);

  if (handleCustomerBack(chatId, settings, state)) {
    return;
  }

  if (handleServiceBack(chatId, settings, state)) {
    return;
  }

  if (handleAppointmentBack(chatId, settings, state)) {
    return;
  }

  if (handleProviderBack(chatId, settings, state)) {
    return;
  }

  if (handleScheduleBack(chatId, settings, state)) {
    return;
  }

  if (handleOverrideBack(chatId, settings, state)) {
    return;
  }

  if (handleLocationBack(chatId, settings, state)) {
    return;
  }

  if (handleAdminResultBack(chatId, settings, session)) {
    return;
  }

  handleAdminBackButton(
    chatId,
    settings
  );
}





function sendSettingsMenu(
  chatId,
  settings
) {
  const stack =
    getNavigationStack(chatId);

  if (stack.length === 0) {
    pushNavigation(
      chatId,
      ADMIN_MENUS.MAIN
    );
  }

  navigateAdmin(
    chatId,
    ADMIN_MENUS.SETTINGS
  );

  const keyboard =
    buildKeyboardWithMainMenu([
      [
        {
          text: getMessage(
            MESSAGE_KEYS.ADMIN_PROVIDERS
          )
        }
      ],
      [
        {
          text: getMessage(
            MESSAGE_KEYS.ADMIN_SERVICES
          )
        }
      ],
      [
        {
          text: getMessage(
            MESSAGE_KEYS.ADMIN_LOCATIONS
          )
        }
      ]
    ]);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.ADMIN_SETTINGS
    ),
    keyboard
  );
}
