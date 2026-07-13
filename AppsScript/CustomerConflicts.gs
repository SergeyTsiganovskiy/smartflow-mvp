function startCustomerConflicts(chatId, settings) {
  navigateAdmin(chatId, ADMIN_MENUS.CUSTOMER_CONFLICTS);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.CUSTOMER_CONFLICTS_MENU),
    buildKeyboardWithMainMenu([
      [
        {
          text: getMessage(MESSAGE_KEYS.CUSTOMER_CONFLICT_ADD)
        }
      ],
      [
        {
          text: getMessage(MESSAGE_KEYS.CUSTOMER_CONFLICT_LIST)
        },
        {
          text: getMessage(MESSAGE_KEYS.CUSTOMER_CONFLICT_DELETE)
        }
      ]
    ])
  );
}
