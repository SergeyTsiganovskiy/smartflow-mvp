const CLIENT_NAVIGATION_HANDLERS = {};

function navigateClient(chatId, menu, state) {
  pushNavigation(chatId, menu);

  if (state !== undefined) {
    setUserState(chatId, state);
  }
}

function resetClientNavigationToMain(chatId) {
  resetNavigation(chatId);

  pushNavigation(chatId, CLIENT_MENUS.MAIN);
}

function initializeClientNavigation() {
  CLIENT_NAVIGATION_HANDLERS[CLIENT_MENUS.MAIN] = sendClientStartMenu;

  CLIENT_NAVIGATION_HANDLERS[CLIENT_MENUS.LOCATIONS] = showLocations;

  CLIENT_NAVIGATION_HANDLERS[CLIENT_MENUS.SERVICES] = showServices;

  CLIENT_NAVIGATION_HANDLERS[CLIENT_MENUS.PROVIDERS] = showProviders;

  CLIENT_NAVIGATION_HANDLERS[CLIENT_MENUS.DATES] = showDateOptions;

  CLIENT_NAVIGATION_HANDLERS[CLIENT_MENUS.TIMES] = showTimeOptions;

  CLIENT_NAVIGATION_HANDLERS[CLIENT_MENUS.ADD_ANOTHER_OPTION] = showAddAnotherOption;
}

function openClientMenu(chatId, settings, menu) {
  if (Object.keys(CLIENT_NAVIGATION_HANDLERS).length === 0) {
    initializeClientNavigation();
  }

  const handler = CLIENT_NAVIGATION_HANDLERS[menu];

  if (!handler) {
    sendClientStartMenu(chatId, settings);
    return;
  }

  setNavigationRenderOnly(chatId, true);

  handler(chatId, settings);

  setNavigationRenderOnly(chatId, false);
}

function handleClientBackButton(chatId, settings) {
  const stack = getNavigationStack(chatId);

  if (stack.length <= 1) {
    sendClientStartMenu(chatId, settings);
    return;
  }

  stack.pop();

  saveNavigationStack(chatId, stack);

  const current = stack[stack.length - 1];

  if (!current || !current.menu) {
    sendClientStartMenu(chatId, settings);
    return;
  }

  openClientMenu(chatId, settings, current.menu);
}

function sendClientStartMenu(chatId, settings) {
  resetNavigation(chatId);

  pushNavigation(chatId, CLIENT_MENUS.MAIN);

  const text = getMessage(MESSAGE_KEYS.MAIN_MENU_TEXT);

  const keyboard = {
    keyboard: [
      [{ text: getMessage(MESSAGE_KEYS.BOOK) }],
      [{ text: getMessage(MESSAGE_KEYS.MY_APPOINTMENTS) }],
      [{ text: getMessage(MESSAGE_KEYS.CONTACTS) }],
      [{ text: getMessage(MESSAGE_KEYS.MAIN_MENU) }]
    ],
    resize_keyboard: true
  };

  sendTelegramMessage(settings.ClientBotToken, chatId, text, keyboard);
}
