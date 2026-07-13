function handleClientCommandMessage(chatId, text, state, settings) {
  if (handleClientNavigationCommand(chatId, text, settings)) {
    return;
  }

  if (handleClientMenuCommand(chatId, text, settings)) {
    return;
  }

  handleClientStateMessage(chatId, text, state, settings);
}
