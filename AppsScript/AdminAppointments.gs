function sendAppointmentsMenu(chatId, settings) {
  navigateAdmin(chatId, ADMIN_MENUS.APPOINTMENTS);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS),
    buildAppointmentsMenuKeyboard()
  );
}

function buildAppointmentsMenuKeyboard() {
  return buildKeyboardWithMainMenu([
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_TODAY) }],
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_TOMORROW) }],
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_NEXT_WORKING_DAY) }],
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_BY_PROVIDER) }],
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_BY_DATE) }]
  ]);
}
