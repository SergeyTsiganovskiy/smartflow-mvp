// =========================
// ADMIN NAVIGATION
// =========================

const ADMIN_NAVIGATION_HANDLERS = {};

function navigateAdmin(chatId, menu, state) {
  pushNavigation(chatId, menu);

  if (state !== undefined) {
    setUserState(chatId, state);
  }
}

function initializeAdminNavigation() {
  ADMIN_NAVIGATION_HANDLERS[
    ADMIN_MENUS.MAIN
  ] = sendAdminMainMenu;

  ADMIN_NAVIGATION_HANDLERS[
    ADMIN_MENUS.PROVIDERS
  ] = sendProvidersMenu;

  ADMIN_NAVIGATION_HANDLERS[
    ADMIN_MENUS.SERVICES
  ] = sendServicesMenu;

  ADMIN_NAVIGATION_HANDLERS[
    ADMIN_MENUS.APPOINTMENTS
  ] = sendAppointmentsMenu;

  ADMIN_NAVIGATION_HANDLERS[
    ADMIN_MENUS.CUSTOMERS
  ] = sendCustomersMenu;

  ADMIN_NAVIGATION_HANDLERS[
    ADMIN_MENUS.CUSTOMER_CONFLICTS
  ] = startCustomerConflicts;

  ADMIN_NAVIGATION_HANDLERS[
    ADMIN_MENUS.LOCATIONS
  ] = sendLocationsMenu;
}

function openAdminMenu(chatId, settings, menu) {
  if (
    Object.keys(
      ADMIN_NAVIGATION_HANDLERS
    ).length === 0
  ) {
    initializeAdminNavigation();
  }

  const handler =
    ADMIN_NAVIGATION_HANDLERS[menu];

  if (!handler) {
    sendAdminMainMenu(chatId, settings);
    return;
  }

  setNavigationRenderOnly(chatId, true);

  handler(chatId, settings);

  setNavigationRenderOnly(chatId, false);
}

function handleAdminBackButton(chatId, settings) {
  const stack =
    getNavigationStack(chatId);

  if (stack.length <= 1) {
    sendAdminMainMenu(chatId, settings);
    return;
  }

  stack.pop();

  saveNavigationStack(chatId, stack);

  const current =
    stack[stack.length - 1];

  if (!current || !current.menu) {
    sendAdminMainMenu(chatId, settings);
    return;
  }

  openAdminMenu(
    chatId,
    settings,
    current.menu
  );
}

function resetAdminWizard(chatId) {
  setUserState(
    chatId,
    ''
  );

  setUserSessionValues(
    chatId,
    {
      customer_service_customer_id: '',
      customer_service_phone: '',
      customer_service_service_id: '',
      customer_service_price: '',

      conflict_main_phone: '',
      conflict_main_phone_key: '',
      conflict_main_customer_name: '',

      delete_conflict_main_phone: '',
      delete_conflict_main_phone_key: '',
      delete_conflict_main_customer_name: '',

      edit_provider_id: '',
      edit_provider_field: '',
      edit_service_id: '',
      edit_service_field: '',

      schedule_provider_id: '',
      schedule_day_code: '',

      override_provider_id: '',
      override_reason_key: '',
      override_date: '',
      override_start_time: '',
      override_end_time: ''
    }
  );
}

function backToAdminMenu(
  chatId,
  settings,
  menu
) {
  resetAdminWizard(chatId);

  const trimmed =
    trimNavigationToMenu(
      chatId,
      menu
    );

  if (!trimmed) {
    resetNavigation(chatId);

    pushNavigation(
      chatId,
      ADMIN_MENUS.MAIN
    );
  }

  openAdminMenu(
    chatId,
    settings,
    menu
  );
}

function isCustomerWizardState(state) {
  return [
    ADMIN_STATES.WAITING_CUSTOMER_PROFILE_PHONE,
    ADMIN_STATES.WAITING_CUSTOMER_PROFILE_EDIT_PHONE,
    ADMIN_STATES.WAITING_CUSTOMER_PROFILE_EDIT_FIELD,
    ADMIN_STATES.WAITING_CUSTOMER_PROFILE_EDIT_VALUE,
    ADMIN_STATES.WAITING_CUSTOMER_VISIT_HISTORY_PHONE,
    ADMIN_STATES.WAITING_CUSTOMER_PROFILE_CREATE_PHONE,
    ADMIN_STATES.WAITING_CUSTOMER_PROFILE_CREATE_NAME,
    ADMIN_STATES.WAITING_CUSTOMER_PROFILE_DELETE_PHONE,
    ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_MAIN_PHONE,
    ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_PHONE,
    ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_LIST_PHONE,
    ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_DELETE_MAIN_PHONE,
    ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_DELETE_PHONE
  ].indexOf(state) !== -1;
}

function isServiceWizardState(state) {
  return [
    ADMIN_STATES.WAITING_SERVICE_NAME,
    ADMIN_STATES.WAITING_SERVICE_LOCATION,
    ADMIN_STATES.WAITING_SERVICE_PRICE_MIN,
    ADMIN_STATES.WAITING_SERVICE_PRICE_MAX,
    ADMIN_STATES.WAITING_SERVICE_DURATION_MIN,
    ADMIN_STATES.WAITING_SERVICE_DURATION_MAX,
    ADMIN_STATES.WAITING_SERVICE_TO_EDIT,
    ADMIN_STATES.WAITING_SERVICE_FIELD_TO_EDIT,
    ADMIN_STATES.WAITING_SERVICE_NEW_VALUE,
    ADMIN_STATES.WAITING_SERVICE_TO_DISABLE,
    ADMIN_STATES.WAITING_SERVICE_TO_ENABLE,
    ADMIN_STATES.WAITING_CUSTOMER_SERVICE_PHONE,
    ADMIN_STATES.WAITING_CUSTOMER_SERVICE_TO_EDIT,
    ADMIN_STATES.WAITING_CUSTOMER_SERVICE_PRICE,
    ADMIN_STATES.WAITING_CUSTOMER_SERVICE_DURATION,
    ADMIN_STATES.WAITING_CUSTOMER_SERVICE_TO_DELETE
  ].indexOf(state) !== -1;
}

function isAppointmentWizardState(state) {
  return [
    ADMIN_STATES.WAITING_APPOINTMENTS_PROVIDER,
    ADMIN_STATES.WAITING_APPOINTMENTS_DATE,
    ADMIN_STATES.WAITING_NEXT_WORKING_DAY_PROVIDER
  ].indexOf(state) !== -1;
}

function isProviderWizardState(state) {
  return [
    ADMIN_STATES.WAITING_PROVIDER_NAME,
    ADMIN_STATES.WAITING_PROVIDER_LOCATION,
    ADMIN_STATES.WAITING_PROVIDER_PHONE,
    ADMIN_STATES.WAITING_PROVIDER_TELEGRAM_ID,

    ADMIN_STATES.WAITING_PROVIDER_TO_EDIT,
    ADMIN_STATES.WAITING_PROVIDER_FIELD_TO_EDIT,
    ADMIN_STATES.WAITING_PROVIDER_NEW_VALUE,

    ADMIN_STATES.WAITING_PROVIDER_TO_DISABLE,
    ADMIN_STATES.WAITING_PROVIDER_TO_ENABLE
  ].indexOf(state) !== -1;
}

function handleCustomerBack(chatId, settings, state) {
  if (!isCustomerWizardState(state)) {
    return false;
  }

  backToAdminMenu(chatId, settings, ADMIN_MENUS.CUSTOMERS);
  return true;
}

function handleServiceBack(chatId, settings, state) {
  if (!isServiceWizardState(state)) {
    return false;
  }

  backToAdminMenu(chatId, settings, ADMIN_MENUS.SERVICES);
  return true;
}

function handleAppointmentBack(chatId, settings, state) {
  if (!isAppointmentWizardState(state)) {
    return false;
  }

  backToAdminMenu(chatId, settings, ADMIN_MENUS.APPOINTMENTS);
  return true;
}

function handleProviderBack(chatId, settings, state) {
  if (!isProviderWizardState(state)) {
    return false;
  }

  backToAdminMenu(chatId, settings, ADMIN_MENUS.PROVIDERS);
  return true;
}

function handleAdminResultBack(chatId, settings, session) {
  const adminBackMenu =
    session.admin_back_menu || '';

  if (!adminBackMenu) {
    return false;
  }

  setUserSessionValue(
    chatId,
    'admin_back_menu',
    ''
  );

  backToAdminMenu(
    chatId,
    settings,
    adminBackMenu
  );

  return true;
}

function isScheduleWizardState(state) {
  return [
    ADMIN_STATES.WAITING_PROVIDER_FOR_SCHEDULE,
    ADMIN_STATES.WAITING_SCHEDULE_DAY,
    ADMIN_STATES.WAITING_SCHEDULE_ACTION,
    ADMIN_STATES.WAITING_SCHEDULE_START_TIME,
    ADMIN_STATES.WAITING_SCHEDULE_END_TIME
  ].indexOf(state) !== -1;
}

function handleScheduleBack(chatId, settings, state) {
  if (!isScheduleWizardState(state)) {
    return false;
  }

  if (
    state === ADMIN_STATES.WAITING_SCHEDULE_START_TIME ||
    state === ADMIN_STATES.WAITING_SCHEDULE_END_TIME
  ) {
    returnToScheduleDays(chatId, settings);
    return true;
  }

  backToAdminMenu(
    chatId,
    settings,
    ADMIN_MENUS.PROVIDERS
  );

  return true;
}

function isOverrideWizardState(state) {
  return [
    ADMIN_STATES.WAITING_PROVIDER_FOR_OVERRIDE,
    ADMIN_STATES.WAITING_OVERRIDE_ACTION,
    ADMIN_STATES.WAITING_OVERRIDE_REASON,
    ADMIN_STATES.WAITING_OVERRIDE_DATE,
    ADMIN_STATES.WAITING_OVERRIDE_START_TIME,
    ADMIN_STATES.WAITING_OVERRIDE_END_TIME,
    ADMIN_STATES.WAITING_OVERRIDE_TO_DELETE
  ].indexOf(state) !== -1;
}

function handleOverrideBack(chatId, settings, state) {
  if (!isOverrideWizardState(state)) {
    return false;
  }

  resetAdminWizard(chatId);

  setNavigationRenderOnly(chatId, true);

  sendProvidersMenu(
    chatId,
    settings
  );

  setNavigationRenderOnly(chatId, false);

  return true;
}
