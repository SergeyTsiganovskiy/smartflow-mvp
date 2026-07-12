function handleAdminCustomerState(
  chatId,
  text,
  state,
  settings
) {
  if (state === ADMIN_STATES.WAITING_CUSTOMER_PROFILE_PHONE) {
  processCustomerProfilePhone(chatId, text, settings);
  return;
  }
  
  if (state === ADMIN_STATES.WAITING_CUSTOMER_PROFILE_EDIT_PHONE) {
  processEditCustomerProfilePhone(chatId, text, settings);
  return;
  }
  
  if (state === ADMIN_STATES.WAITING_CUSTOMER_PROFILE_EDIT_FIELD) {
  processEditCustomerProfileField(chatId, text, settings);
  return;
  }
  
  if (state === ADMIN_STATES.WAITING_CUSTOMER_PROFILE_EDIT_VALUE) {
  processEditCustomerProfileValue(chatId, text, settings);
  return;
  }
  
  if (state === ADMIN_STATES.WAITING_CUSTOMER_VISIT_HISTORY_PHONE) {
  processCustomerVisitHistoryPhone(
  chatId,
  text,
  settings
  );
  
  return;
  }
  
  if (state === ADMIN_STATES.WAITING_CUSTOMER_PROFILE_CREATE_PHONE) {
  processCreateCustomerProfilePhone(chatId, text, settings);
  return;
  }
  
  if (state === ADMIN_STATES.WAITING_CUSTOMER_PROFILE_CREATE_NAME) {
  processCreateCustomerProfileName(chatId, text, settings);
  return;
  }
  
  if (state === ADMIN_STATES.WAITING_CUSTOMER_PROFILE_DELETE_PHONE) {
  processDeleteCustomerProfilePhone(chatId, text, settings);
  return;
  }
  
  if (
  state ===
  ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_MAIN_PHONE
  ) {
  processCustomerConflictMainPhone(
  chatId,
  text,
  settings
  );
  
  return;
  }
  
  if (
  state ===
  ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_PHONE
  ) {
  processCustomerConflictPhone(
  chatId,
  text,
  settings
  );
  
  return;
  }
  
  if (
  state ===
  ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_LIST_PHONE
  ) {
  processShowCustomerConflicts(
  chatId,
  text,
  settings
  );
  
  return;
  }
  
  if (
  state ===
  ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_DELETE_MAIN_PHONE
  ) {
  processDeleteCustomerConflictMainPhone(
  chatId,
  text,
  settings
  );
  
  return;
  }
  
  if (
  state ===
  ADMIN_STATES.WAITING_CUSTOMER_CONFLICT_DELETE_PHONE
  ) {
  processDeleteCustomerConflictPhone(
  chatId,
  text,
  settings
  );
  
  return;
  }
}
