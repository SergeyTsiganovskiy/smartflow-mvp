function handleAdminServiceCommand(chatId, text, settings) {
  // =========================
  // SERVICE MENU COMMANDS
  // =========================
  
  if (text === getMessage(MESSAGE_KEYS.ADMIN_ADD_SERVICE)) {
  resetServiceWizardSession(chatId);
  startCreateService(chatId, settings);
  return;
  }
  
  if (text === getMessage(MESSAGE_KEYS.ADMIN_SERVICE_LIST)) {
  showServicesListAdmin(chatId, settings);
  return;
  }
  
  if (text === getMessage(MESSAGE_KEYS.ADMIN_SERVICE_EDIT)) {
  startEditService(chatId, settings);
  return;
  }
  
  if (text === getMessage(MESSAGE_KEYS.ADMIN_SERVICE_DISABLE)) {
  startDisableService(chatId, settings);
  return;
  }
  
  if (text === getMessage(MESSAGE_KEYS.ADMIN_SERVICE_ENABLE)) {
  startEnableService(chatId, settings);
  return;
  }
  
  if (text === getMessage(MESSAGE_KEYS.ADMIN_CUSTOMER_SERVICES)) {
  startCustomerServices(chatId, settings);
  return;
  }
  
  if (text === getMessage(MESSAGE_KEYS.EDIT_CUSTOMER_SERVICE)) {
  startEditCustomerService(chatId, settings);
  return;
  }
}
