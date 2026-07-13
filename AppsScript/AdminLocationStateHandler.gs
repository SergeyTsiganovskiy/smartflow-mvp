function handleAdminLocationState(chatId, text, state, settings) {
  if (state === ADMIN_STATES.WAITING_LOCATION_NAME) {
    processLocationName(chatId, text, settings);

    return;
  }

  if (state === ADMIN_STATES.WAITING_LOCATION_ADDRESS) {
    processLocationAddress(chatId, text, settings);

    return;
  }

  if (state === ADMIN_STATES.WAITING_LOCATION_PHONE) {
    processLocationPhone(chatId, text, settings);

    return;
  }

  if (state === ADMIN_STATES.WAITING_LOCATION_TO_DISABLE) {
    processDisableLocation(chatId, text, settings);

    return;
  }

  if (state === ADMIN_STATES.WAITING_LOCATION_TO_ENABLE) {
    processEnableLocation(chatId, text, settings);

    return;
  }

  if (state === ADMIN_STATES.WAITING_LOCATION_TO_EDIT) {
    processLocationToEdit(chatId, text, settings);

    return;
  }

  if (state === ADMIN_STATES.WAITING_LOCATION_FIELD_TO_EDIT) {
    processLocationFieldSelection(chatId, text, settings);

    return;
  }

  if (state === ADMIN_STATES.WAITING_LOCATION_NEW_VALUE) {
    processLocationNewValue(chatId, text, settings);

    return;
  }
}
