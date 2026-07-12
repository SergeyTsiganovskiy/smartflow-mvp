function handleClientMessage(message) {
  const settings = getSettings();

  const chatId = message.chat.id;
  const text = message.text || '';
  const state = String(getUserState(chatId) || '').trim();

  handleClientCommandMessage(
    chatId,
    text,
    state,
    settings
  );
}

