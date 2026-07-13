function handleAdminNavigationCommand(chatId, text, settings) {
  if (isMessageText(text, MESSAGE_KEYS.MAIN_MENU)) {
  clearUserSession(chatId);
  setUserState(chatId, '');
  
  sendAdminMainMenu(chatId, settings);
  return;
  }
  
  if (isMessageText(text, MESSAGE_KEYS.BACK)) {
  processAdminBack(chatId, settings);
  return;
  }
}
