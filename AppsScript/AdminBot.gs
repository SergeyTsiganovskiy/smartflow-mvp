function handleAdminMessage(message) {
  const settings = getSettings();

  const chatId = message.chat.id;
  const text = message.text || '';
  const state = String(getUserState(chatId) || '').trim();

  if (!isAdminUser(chatId)) {
    sendTelegramMessage(settings.AdminBotToken, chatId, getMessage(MESSAGE_KEYS.ADMIN_ACCESS_DENIED));

    return;
  }

  if (text === '/start') {
    clearUserSession(chatId);
    setUserState(chatId, '');

    sendAdminMainMenu(chatId, settings);
    return;
  }
  handleAdminCommandMessage(chatId, text, state, settings);
}
