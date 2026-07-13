function handleClientStateMessage(chatId, text, state, settings) {
  if (
    state === STATES.WAITING_CUSTOMER_NAME ||
    state === STATES.WAITING_CUSTOMER_PHONE ||
    state === STATES.WAITING_LOCATION ||
    state === STATES.WAITING_SERVICE ||
    state === STATES.WAITING_PROVIDER ||
    state === STATES.WAITING_OPTION_DATE ||
    state === STATES.WAITING_CUSTOM_DATE ||
    state === STATES.WAITING_OPTION_TIME ||
    state === STATES.WAITING_ADD_ANOTHER_OPTION ||
    state === STATES.WAITING_CUSTOMER_NOTE
  ) {
    handleClientBookingState(chatId, text, state, settings);
    return;
  }

  if (handleClientAppointmentState(chatId, text, state, settings)) {
    return;
  }

  if (
    state === STATES.WAITING_RESCHEDULE_CUSTOM_DATE ||
    state === STATES.WAITING_RESCHEDULE_DATE ||
    state === STATES.WAITING_RESCHEDULE_TIME
  ) {
    handleClientRescheduleState(chatId, text, state, settings);
    return;
  }

  sendTelegramMessage(settings.ClientBotToken, chatId, getMessage(MESSAGE_KEYS.UNKNOWN_COMMAND));
}
