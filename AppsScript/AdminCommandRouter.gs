function handleAdminCommandMessage(
  chatId,
  text,
  state,
  settings
) {

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
  handleAdminStateMessage(
    chatId,
    text,
    state,
    settings
  );
}
