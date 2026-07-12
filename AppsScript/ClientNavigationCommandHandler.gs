function handleClientNavigationCommand(chatId, text, settings) {
  const currentNavigation = getCurrentNavigation(chatId);

  if (
    text === getMessage(MESSAGE_KEYS.BACK) &&
    currentNavigation &&
    currentNavigation.menu === CLIENT_MENUS.ADD_ANOTHER_OPTION
  ) {
    rollbackLastClientOption(chatId);
    handleClientBackButton(chatId, settings);
    return true;
  }

  if (text === getMessage(MESSAGE_KEYS.BACK)) {
    handleClientBackButton(chatId, settings);
    return true;
  }

  if (
    text === '/start' ||
    text === getMessage(MESSAGE_KEYS.MAIN_MENU)
  ) {
    clearUserSession(chatId);
    setUserState(chatId, '');
    sendClientStartMenu(chatId, settings);
    return true;
  }

  return false;
}
