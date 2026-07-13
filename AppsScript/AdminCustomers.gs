function sendCustomersMenu(chatId, settings) {
  navigateAdmin(chatId, ADMIN_MENUS.CUSTOMERS);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ADMIN_CUSTOMERS),
    buildCustomersMenuKeyboard()
  );
}

function buildCustomersMenuKeyboard() {
  return buildKeyboardWithMainMenu([
    [
      {
        text: getMessage(MESSAGE_KEYS.CUSTOMER_PROFILES_LIST)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_EDIT)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_CREATE)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_DELETE)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.CUSTOMER_CONFLICTS_MENU)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.CUSTOMER_VISIT_HISTORY)
      }
    ]
  ]);
}
