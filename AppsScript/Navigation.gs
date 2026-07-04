const CLIENT_MENU_HANDLERS = {};

function initializeClientNavigation() {
  CLIENT_MENU_HANDLERS[
    CLIENT_MENUS.MAIN
  ] = sendClientStartMenu;

  CLIENT_MENU_HANDLERS[
    CLIENT_MENUS.LOCATIONS
  ] = showLocations;

  CLIENT_MENU_HANDLERS[
    CLIENT_MENUS.SERVICES
  ] = showServices;

  CLIENT_MENU_HANDLERS[
    CLIENT_MENUS.PROVIDERS
  ] = showProviders;

  CLIENT_MENU_HANDLERS[
    CLIENT_MENUS.DATES
  ] = showDateOptions;

  CLIENT_MENU_HANDLERS[
    CLIENT_MENUS.TIMES
  ] = showTimeOptions;

  CLIENT_MENU_HANDLERS[
    CLIENT_MENUS.ADD_ANOTHER_OPTION
  ] = showAddAnotherOption;
  
}

function openClientMenu(
  chatId,
  settings,
  menu
) {
  if (
    Object.keys(
      CLIENT_MENU_HANDLERS
    ).length === 0
  ) {
    initializeClientNavigation();
  }

  const handler =
    CLIENT_MENU_HANDLERS[menu];

  if (!handler) {
    sendClientStartMenu(
      chatId,
      settings
    );

    return;
  }

  setUserSessionValue(
    chatId,
    'navigation_render_only',
    true
  );

  handler(
    chatId,
    settings
  );

  setUserSessionValue(
    chatId,
    'navigation_render_only',
    false
  );
}

// =========================
// NAVIGATION
// =========================

function resetNavigation(chatId) {
  setUserSessionValue(
    chatId,
    'navigation_stack',
    JSON.stringify([])
  );
}

function getNavigationStack(chatId) {
  const session =
    getUserSession(chatId);

  if (!session.navigation_stack) {
    return [];
  }

  try {
    return JSON.parse(
      session.navigation_stack
    );
  } catch (error) {
    return [];
  }
}

function saveNavigationStack(
  chatId,
  stack
) {
  setUserSessionValue(
    chatId,
    'navigation_stack',
    JSON.stringify(stack)
  );
}

function pushNavigation(
  chatId,
  menu
) {
  const session =
    getUserSession(chatId);

  if (session.navigation_render_only === true) {
    return;
  }

  const stack =
    getNavigationStack(chatId);

  stack.push({
    menu: menu
  });

  saveNavigationStack(
    chatId,
    stack
  );
}

function popNavigation(chatId) {
  const stack =
    getNavigationStack(chatId);

  if (stack.length > 1) {
    stack.pop();
  }

  saveNavigationStack(
    chatId,
    stack
  );

  return stack.length > 0
    ? stack[stack.length - 1]
    : null;
}

function getCurrentNavigation(chatId) {
  const stack =
    getNavigationStack(chatId);

  return stack.length > 0
    ? stack[stack.length - 1]
    : null;
}

function handleClientBackButton(
  chatId,
  settings
) {
  const stack =
    getNavigationStack(chatId);

  if (stack.length <= 1) {
    sendClientStartMenu(
      chatId,
      settings
    );

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
    sendClientStartMenu(
      chatId,
      settings
    );

    return;
  }

  openClientMenu(
    chatId,
    settings,
    current.menu
  );
}

function navigateClient(
  chatId,
  menu,
  state
) {
  pushNavigation(
    chatId,
    menu
  );

  if (state !== undefined) {
    setUserState(
      chatId,
      state
    );
  }
}

function resetClientNavigationToMain(chatId) {
  resetNavigation(chatId);

  pushNavigation(
    chatId,
    CLIENT_MENUS.MAIN
  );
}