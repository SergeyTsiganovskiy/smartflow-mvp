function handleClientCommandMessage(
  chatId,
  text,
  state,
  settings
) {

  const currentNavigation =
    getCurrentNavigation(chatId);

  if (
    text === getMessage(MESSAGE_KEYS.BACK) &&
    currentNavigation &&
    currentNavigation.menu === CLIENT_MENUS.ADD_ANOTHER_OPTION
  ) {
    rollbackLastClientOption(chatId);

    handleClientBackButton(
      chatId,
      settings
    );

    return;
  }

  if (text === getMessage(MESSAGE_KEYS.BACK)) {
    handleClientBackButton(
      chatId,
      settings
    );

    return;
  }

  if (
    text === '/start' ||
    text === getMessage(MESSAGE_KEYS.MAIN_MENU)
  ) {
    clearUserSession(chatId);
    setUserState(chatId, '');

    sendClientStartMenu(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.CONTACTS)) {
    showContacts(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.BOOK)) {
    clearUserSession(chatId);
    askCustomerName(chatId, settings);
    return;
  }

  if (text === getMessage(MESSAGE_KEYS.MY_APPOINTMENTS)) {
    askPhoneForAppointments(chatId, settings);
    return;
  }
  handleClientStateMessage(
    chatId,
    text,
    state,
    settings
  );
}
