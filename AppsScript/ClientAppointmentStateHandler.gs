function handleClientAppointmentState(chatId, text, state, settings) {
  if (state !== STATES.WAITING_MY_APPOINTMENTS_PHONE) {
    return false;
  }

  addAuditLog('MY_APPOINTMENTS_PHONE', text);

  const phone = getPhoneSearchKey(text);

  if (!isValidPhone(phone)) {
    sendTelegramMessage(settings.ClientBotToken, chatId, getMessage(MESSAGE_KEYS.PHONE_INVALID));

    askPhoneForAppointments(chatId, settings);
    return true;
  }

  showMyAppointmentsByPhone(chatId, settings, phone);

  return true;
}
