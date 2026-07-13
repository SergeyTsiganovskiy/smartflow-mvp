function handleAdminProviderState(chatId, text, state, settings) {
  if (state === ADMIN_STATES.WAITING_PROVIDER_NAME) {
    processProviderName(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_PROVIDER_LOCATION) {
    processProviderLocation(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_PROVIDER_PHONE) {
    processProviderPhone(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_PROVIDER_TO_EDIT) {
    processProviderToEdit(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_PROVIDER_FIELD_TO_EDIT) {
    processProviderFieldToEdit(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_PROVIDER_NEW_VALUE) {
    processProviderNewValue(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_PROVIDER_TO_DISABLE) {
    processProviderToDisable(chatId, text, settings);
    return;
  }

  if (state === ADMIN_STATES.WAITING_PROVIDER_TO_ENABLE) {
    processProviderToEnable(chatId, text, settings);
    return;
  }
}
