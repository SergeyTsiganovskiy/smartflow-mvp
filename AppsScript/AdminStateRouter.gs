function handleAdminStateMessage(
  chatId,
  text,
  state,
  settings
) {

  if (
    state === ADMIN_STATES.WAITING_CONFIGURATION_ACTION ||
    state === ADMIN_STATES.WAITING_CONFIGURATION_LANGUAGE ||
    state === ADMIN_STATES.WAITING_CONFIGURATION_ADMIN_ACTION ||
    state === ADMIN_STATES.WAITING_CONFIGURATION_ADMIN_ADD ||
    state === ADMIN_STATES.WAITING_CONFIGURATION_ADMIN_DELETE ||
    state === ADMIN_STATES.WAITING_CONFIGURATION_REMINDER_DAY_BEFORE ||
    state === ADMIN_STATES.WAITING_CONFIGURATION_BOOKING_DAYS ||
    state === ADMIN_STATES.WAITING_CONFIGURATION_CACHE_DAYS ||
    state === ADMIN_STATES.WAITING_CONFIGURATION_DEFAULT_WORK_HOURS
  ) {
    handleAdminConfigurationState(chatId, text, state, settings);
    return;
  }

  if (
    state === ADMIN_STATES.WAITING_SERVICE_NAME ||
    state === ADMIN_STATES.WAITING_SERVICE_LOCATION ||
    state === ADMIN_STATES.WAITING_SERVICE_DURATION_MIN ||
    state === ADMIN_STATES.WAITING_SERVICE_DURATION_MAX ||
    state === ADMIN_STATES.WAITING_SERVICE_TO_EDIT ||
    state === ADMIN_STATES.WAITING_SERVICE_FIELD_TO_EDIT ||
    state === ADMIN_STATES.WAITING_SERVICE_NEW_VALUE ||
    state === ADMIN_STATES.WAITING_SERVICE_TO_DISABLE ||
    state === ADMIN_STATES.WAITING_SERVICE_TO_ENABLE ||
    state === ADMIN_STATES.WAITING_CUSTOMER_SERVICE_PHONE ||
    state === ADMIN_STATES.WAITING_CUSTOMER_SERVICE_TO_EDIT ||
    state === ADMIN_STATES.WAITING_CUSTOMER_SERVICE_DURATION ||
    state === ADMIN_STATES.WAITING_CUSTOMER_SERVICE_TO_DELETE ||
    text === getMessage(MESSAGE_KEYS.DELETE_CUSTOMER_SERVICE)
  ) {
    handleAdminServiceState(
      chatId,
      text,
      state,
      settings
    );
    return;
  }

  if (
    state === ADMIN_STATES.WAITING_APPOINTMENTS_PROVIDER ||
    state === ADMIN_STATES.WAITING_APPOINTMENTS_DATE ||
    state === ADMIN_STATES.WAITING_NEXT_WORKING_DAY_PROVIDER
  ) {
    handleAdminAppointmentState(
      chatId,
      text,
      state,
      settings
    );
    return;
  }

  if (
    state === ADMIN_STATES.WAITING_CUSTOMER_PROFILE_PHONE ||
    state === ADMIN_STATES.WAITING_CUSTOMER_PROFILE_EDIT_PHONE ||
    state === ADMIN_STATES.WAITING_CUSTOMER_PROFILE_EDIT_FIELD ||
    state === ADMIN_STATES.WAITING_CUSTOMER_PROFILE_EDIT_VALUE ||
    state === ADMIN_STATES.WAITING_CUSTOMER_VISIT_HISTORY_PHONE ||
    state === ADMIN_STATES.WAITING_CUSTOMER_PROFILE_CREATE_PHONE ||
    state === ADMIN_STATES.WAITING_CUSTOMER_PROFILE_CREATE_NAME ||
    state === ADMIN_STATES.WAITING_CUSTOMER_PROFILE_DELETE_PHONE ||
    state === ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_MAIN_PHONE ||
    state === ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_PHONE ||
    state === ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_LIST_PHONE ||
    state === ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_DELETE_MAIN_PHONE ||
    state === ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_DELETE_PHONE
  ) {
    handleAdminCustomerState(
      chatId,
      text,
      state,
      settings
    );
    return;
  }

  if (
    state === ADMIN_STATES.WAITING_LOCATION_NAME ||
    state === ADMIN_STATES.WAITING_LOCATION_ADDRESS ||
    state === ADMIN_STATES.WAITING_LOCATION_PHONE ||
    state === ADMIN_STATES.WAITING_LOCATION_TO_DISABLE ||
    state === ADMIN_STATES.WAITING_LOCATION_TO_ENABLE ||
    state === ADMIN_STATES.WAITING_LOCATION_TO_EDIT ||
    state === ADMIN_STATES.WAITING_LOCATION_FIELD_TO_EDIT ||
    state === ADMIN_STATES.WAITING_LOCATION_NEW_VALUE
  ) {
    handleAdminLocationState(
      chatId,
      text,
      state,
      settings
    );
    return;
  }

  if (
    state === ADMIN_STATES.WAITING_PROVIDER_NAME ||
    state === ADMIN_STATES.WAITING_PROVIDER_LOCATION ||
    state === ADMIN_STATES.WAITING_PROVIDER_PHONE ||
    state === ADMIN_STATES.WAITING_PROVIDER_TELEGRAM_ID ||
    state === ADMIN_STATES.WAITING_PROVIDER_TO_EDIT ||
    state === ADMIN_STATES.WAITING_PROVIDER_FIELD_TO_EDIT ||
    state === ADMIN_STATES.WAITING_PROVIDER_NEW_VALUE ||
    state === ADMIN_STATES.WAITING_PROVIDER_TO_DISABLE ||
    state === ADMIN_STATES.WAITING_PROVIDER_TO_ENABLE
  ) {
    handleAdminProviderState(
      chatId,
      text,
      state,
      settings
    );
    return;
  }

  if (
    state === ADMIN_STATES.WAITING_PROVIDER_FOR_SCHEDULE ||
    state === ADMIN_STATES.WAITING_SCHEDULE_DAY ||
    state === ADMIN_STATES.WAITING_SCHEDULE_ACTION ||
    state === ADMIN_STATES.WAITING_SCHEDULE_START_TIME ||
    state === ADMIN_STATES.WAITING_SCHEDULE_END_TIME
  ) {
    handleAdminScheduleState(
      chatId,
      text,
      state,
      settings
    );
    return;
  }

  if (
    state === ADMIN_STATES.WAITING_PROVIDER_FOR_OVERRIDE ||
    state === ADMIN_STATES.WAITING_OVERRIDE_ACTION ||
    state === ADMIN_STATES.WAITING_OVERRIDE_REASON ||
    state === ADMIN_STATES.WAITING_OVERRIDE_DATE ||
    state === ADMIN_STATES.WAITING_OVERRIDE_START_TIME ||
    state === ADMIN_STATES.WAITING_OVERRIDE_END_TIME ||
    state === ADMIN_STATES.WAITING_OVERRIDE_TO_DELETE
  ) {
    handleAdminOverrideState(
      chatId,
      text,
      state,
      settings
    );
    return;
  }

  // =========================
  // FALLBACK
  // =========================

  sendAdminMainMenu(chatId, settings);
}
