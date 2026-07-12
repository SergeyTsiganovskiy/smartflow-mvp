function handleAdminCustomerCommand(chatId, text, settings) {
  if (text === getMessage(MESSAGE_KEYS.ADMIN_CUSTOMERS)) {
  clearUserSession(chatId);
  setUserState(chatId, '');
  
  sendCustomersMenu(chatId, settings);
  return;
  }
  
  if (text === getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE)) {
  startCustomerProfile(chatId, settings);
  return;
  }
  
  if (text === getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_EDIT)) {
  startEditCustomerProfile(chatId, settings);
  return;
  }
  
  if (
  text === getMessage(
  MESSAGE_KEYS.CUSTOMER_PROFILES_LIST
  )
  ) {
  startCustomerProfilesList(
  chatId,
  settings
  );
  
  return;
  }
  
  if (text === getMessage(MESSAGE_KEYS.CUSTOMER_LIST_NEXT)) {
  const session =
  getUserSession(chatId) || {};
  
  const page =
  Number(
  session.customer_list_page || 1
  );
  
  const nextPage =
  page + 1;
  
  setUserSessionValue(
  chatId,
  'customer_list_page',
  nextPage
  );
  
  showCustomerProfilesList(
  chatId,
  settings,
  nextPage
  );
  
  return;
  }
  
  if (text === getMessage(MESSAGE_KEYS.CUSTOMER_LIST_PREVIOUS)) {
  const session =
  getUserSession(chatId) || {};
  
  const page =
  Number(
  session.customer_list_page || 1
  );
  
  const previousPage =
  Math.max(
  1,
  page - 1
  );
  
  setUserSessionValue(
  chatId,
  'customer_list_page',
  previousPage
  );
  
  showCustomerProfilesList(
  chatId,
  settings,
  previousPage
  );
  
  return;
  }
  
  if (text === getMessage(MESSAGE_KEYS.CUSTOMER_VISIT_HISTORY)) {
  startCustomerVisitHistory(
  chatId,
  settings
  );
  
  return;
  }
  
  if (text === getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_CREATE)) {
  startCreateCustomerProfile(chatId, settings);
  return;
  }
  
  if (text === getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_DELETE)) {
  startDeleteCustomerProfile(chatId, settings);
  return;
  }
  
  if (text === getMessage(MESSAGE_KEYS.CUSTOMER_CONFLICTS_MENU)) {
  startCustomerConflicts(chatId, settings);
  return;
  }
  
  if (text === getMessage(MESSAGE_KEYS.CUSTOMER_CONFLICT_ADD)) {
  startAddCustomerConflict(chatId, settings);
  return;
  }
  
  if (
  text ===
  getMessage(
  MESSAGE_KEYS.CUSTOMER_CONFLICT_LIST
  )
  ) {
  startListCustomerConflicts(
  chatId,
  settings
  );
  
  return;
  }
  
  if (
  text ===
  getMessage(
  MESSAGE_KEYS.CUSTOMER_CONFLICT_DELETE
  )
  ) {
  startDeleteCustomerConflict(
  chatId,
  settings
  );
  
  return;
  }
}
