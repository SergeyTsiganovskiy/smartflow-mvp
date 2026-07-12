function handleAdminSectionCommand(chatId, text, settings) {
  // =========================
  // MAIN MENU SECTIONS
  // =========================
  
  if (text === getMessage(MESSAGE_KEYS.ADMIN_PROVIDERS)) {
  addAuditLog(
  'ADMIN_PROVIDERS_CLICK',
  JSON.stringify({
  stackBefore: getNavigationStack(chatId),
  state: getUserState(chatId)
  })
  );
  
  setUserState(chatId, '');
  
  sendProvidersMenu(chatId, settings);
  
  addAuditLog(
  'ADMIN_PROVIDERS_AFTER',
  JSON.stringify({
  stackAfter: getNavigationStack(chatId),
  state: getUserState(chatId)
  })
  );
  
  return;
  }
  
  if (text === getMessage(MESSAGE_KEYS.ADMIN_SERVICES)) {
  setUserState(chatId, '');
  
  sendServicesMenu(
  chatId,
  settings
  );
  
  return;
  }
  
  if (text === getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS)) {
  clearUserSession(chatId);
  setUserState(chatId, '');
  
  sendAppointmentsMenu(chatId, settings);
  return;
  }
  
  if (text === getMessage(MESSAGE_KEYS.ADMIN_LOCATIONS)) {
  setUserState(chatId, '');
  
  sendLocationsMenu(
  chatId,
  settings
  );
  
  return;
  }
  
  if (
  text === getMessage(MESSAGE_KEYS.ADMIN_SETTINGS)
  ) {
  sendSettingsMenu(
  chatId,
  settings
  );
  
  return;
  }
}
