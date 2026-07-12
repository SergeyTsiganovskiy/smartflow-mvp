function handleAdminNavigationCommand(chatId, text, settings) {
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
}
