function handleAdminStateMessage(
  chatId,
  text,
  state,
  settings
) {

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
