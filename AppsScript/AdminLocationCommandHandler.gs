function handleAdminLocationCommand(chatId, text, settings) {
  // =========================
  // LOCATIONS MENU COMMANDS
  // =========================
  
  if (
  text ===
  getMessage(
  MESSAGE_KEYS.LOCATIONS_LIST
  )
  ) {
  showLocationsListAdmin(
  chatId,
  settings
  );
  
  return;
  }
  
  if (
  text ===
  getMessage(
  MESSAGE_KEYS.LOCATION_ADD
  )
  ) {
  startCreateLocation(
  chatId,
  settings
  );
  
  return;
  }
  
  if (
  text ===
  getMessage(MESSAGE_KEYS.LOCATION_DISABLE)
  ) {
  startDisableLocation(
  chatId,
  settings
  );
  
  return;
  }
  
  if (
  text ===
  getMessage(
  MESSAGE_KEYS.LOCATION_ENABLE
  )
  ) {
  startEnableLocation(
  chatId,
  settings
  );
  
  return;
  }
  
  if (
  text ===
  getMessage(
  MESSAGE_KEYS.LOCATION_EDIT
  )
  ) {
  startEditLocation(
  chatId,
  settings
  );
  
  return;
  }
}
