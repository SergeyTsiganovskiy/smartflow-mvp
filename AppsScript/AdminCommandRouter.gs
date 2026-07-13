function handleAdminCommandMessage(chatId, text, state, settings) {
  if (isMessageText(text, MESSAGE_KEYS.MAIN_MENU) || isMessageText(text, MESSAGE_KEYS.BACK)) {
    handleAdminNavigationCommand(chatId, text, settings);
    return;
  }

  if (
    state === ADMIN_STATES.WAITING_CONFIGURATION_ACTION ||
    state === ADMIN_STATES.WAITING_CONFIGURATION_LANGUAGE ||
    state === ADMIN_STATES.WAITING_CONFIGURATION_ADMIN_ACTION ||
    state === ADMIN_STATES.WAITING_CONFIGURATION_ADMIN_ADD ||
    state === ADMIN_STATES.WAITING_CONFIGURATION_ADMIN_DELETE ||
    state === ADMIN_STATES.WAITING_CONFIGURATION_REMINDER_DAY_BEFORE ||
    state === ADMIN_STATES.WAITING_CONFIGURATION_BOOKING_DAYS ||
    state === ADMIN_STATES.WAITING_CONFIGURATION_CACHE_DAYS ||
    state === ADMIN_STATES.WAITING_CONFIGURATION_PAGE_SIZE
  ) {
    handleAdminConfigurationState(chatId, text, state, settings);
    return;
  }

  if (
    text === getMessage(MESSAGE_KEYS.ADMIN_PROVIDERS) ||
    text === getMessage(MESSAGE_KEYS.ADMIN_SERVICES) ||
    text === getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS) ||
    text === getMessage(MESSAGE_KEYS.ADMIN_LOCATIONS) ||
    text === getMessage(MESSAGE_KEYS.ADMIN_CONFIGURATION) ||
    text === getMessage(MESSAGE_KEYS.ADMIN_SETTINGS)
  ) {
    handleAdminSectionCommand(chatId, text, settings);
    return;
  }

  if (
    text === getMessage(MESSAGE_KEYS.ADMIN_ADD_PROVIDER) ||
    text === getMessage(MESSAGE_KEYS.ADMIN_PROVIDER_LIST) ||
    text === getMessage(MESSAGE_KEYS.ADMIN_PROVIDER_EDIT) ||
    text === getMessage(MESSAGE_KEYS.ADMIN_PROVIDER_SCHEDULE) ||
    text === getMessage(MESSAGE_KEYS.ADMIN_PROVIDER_OVERRIDES) ||
    text === getMessage(MESSAGE_KEYS.ADMIN_PROVIDER_DISABLE) ||
    text === getMessage(MESSAGE_KEYS.ADMIN_PROVIDER_ENABLE)
  ) {
    handleAdminProviderCommand(chatId, text, settings);
    return;
  }

  if (
    text === getMessage(MESSAGE_KEYS.ADMIN_ADD_SERVICE) ||
    text === getMessage(MESSAGE_KEYS.ADMIN_SERVICE_LIST) ||
    text === getMessage(MESSAGE_KEYS.ADMIN_SERVICE_EDIT) ||
    text === getMessage(MESSAGE_KEYS.ADMIN_SERVICE_DISABLE) ||
    text === getMessage(MESSAGE_KEYS.ADMIN_SERVICE_ENABLE) ||
    text === getMessage(MESSAGE_KEYS.ADMIN_CUSTOMER_SERVICES) ||
    text === getMessage(MESSAGE_KEYS.EDIT_CUSTOMER_SERVICE)
  ) {
    handleAdminServiceCommand(chatId, text, settings);
    return;
  }

  if (
    text === getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_TODAY) ||
    text === getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_TOMORROW) ||
    text === getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_BY_PROVIDER) ||
    text === getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_BY_DATE) ||
    text === getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_NEXT_WORKING_DAY)
  ) {
    handleAdminAppointmentCommand(chatId, text, settings);
    return;
  }

  if (
    text === getMessage(MESSAGE_KEYS.ADMIN_CUSTOMERS) ||
    text === getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE) ||
    text === getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_EDIT) ||
    text === getMessage(MESSAGE_KEYS.CUSTOMER_PROFILES_LIST) ||
    isMessageText(text, MESSAGE_KEYS.CUSTOMER_LIST_NEXT) ||
    isMessageText(text, MESSAGE_KEYS.CUSTOMER_LIST_PREVIOUS) ||
    text === getMessage(MESSAGE_KEYS.CUSTOMER_VISIT_HISTORY) ||
    text === getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_CREATE) ||
    text === getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_DELETE) ||
    text === getMessage(MESSAGE_KEYS.CUSTOMER_CONFLICTS_MENU) ||
    text === getMessage(MESSAGE_KEYS.CUSTOMER_CONFLICT_ADD) ||
    text === getMessage(MESSAGE_KEYS.CUSTOMER_CONFLICT_LIST) ||
    text === getMessage(MESSAGE_KEYS.CUSTOMER_CONFLICT_DELETE)
  ) {
    handleAdminCustomerCommand(chatId, text, settings);
    return;
  }

  if (
    text === getMessage(MESSAGE_KEYS.LOCATIONS_LIST) ||
    text === getMessage(MESSAGE_KEYS.LOCATION_ADD) ||
    text === getMessage(MESSAGE_KEYS.LOCATION_DISABLE) ||
    text === getMessage(MESSAGE_KEYS.LOCATION_ENABLE) ||
    text === getMessage(MESSAGE_KEYS.LOCATION_EDIT)
  ) {
    handleAdminLocationCommand(chatId, text, settings);
    return;
  }

  handleAdminStateMessage(chatId, text, state, settings);
}
