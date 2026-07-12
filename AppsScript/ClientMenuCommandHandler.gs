function handleClientMenuCommand(chatId, text, settings) {
  if (text === getMessage(MESSAGE_KEYS.CONTACTS)) {
    showContacts(chatId, settings);
    return true;
  }

  if (text === getMessage(MESSAGE_KEYS.BOOK)) {
    clearUserSession(chatId);
    askCustomerName(chatId, settings);
    return true;
  }

  if (text === getMessage(MESSAGE_KEYS.MY_APPOINTMENTS)) {
    askPhoneForAppointments(chatId, settings);
    return true;
  }

  return false;
}
