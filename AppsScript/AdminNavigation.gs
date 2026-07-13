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

  ADMIN_NAVIGATION_HANDLERS[
    ADMIN_MENUS.SETTINGS
  ] = sendSettingsMenu;

  ADMIN_NAVIGATION_HANDLERS[
    ADMIN_MENUS.CONFIGURATION
  ] = sendConfigurationMenu;
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

  handler(chatId, settings);
}

function handleAdminBackButton(chatId, settings) {
  const stack =
    getNavigationStack(chatId);

  if (stack.length <= 1) {
    sendAdminMainMenu(chatId, settings);
    return;
  }

  stack.pop();

  saveNavigationStack(
    chatId,
    stack
  );

  const current =
    stack[stack.length - 1];

  if (!current || !current.menu) {
    sendAdminMainMenu(chatId, settings);
    return;
  }

  setNavigationRenderOnly(
    chatId,
    true
  );

  openAdminMenu(
    chatId,
    settings,
    current.menu
  );

  setNavigationRenderOnly(
    chatId,
    false
  );
}
















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
      ],
      [
        {
          text: getMessage(
            MESSAGE_KEYS.ADMIN_CONFIGURATION
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
