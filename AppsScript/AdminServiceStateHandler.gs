function handleAdminServiceState(
  chatId,
  text,
  state,
  settings
) {
  if (state === ADMIN_STATES.WAITING_SERVICE_NAME) {
      processServiceName(chatId, text, settings);
      return;
    }
  
  if (state === ADMIN_STATES.WAITING_SERVICE_LOCATION) {
      processServiceLocation(chatId, text, settings);
      return;
    }
  
  if (state === ADMIN_STATES.WAITING_SERVICE_DURATION_MIN) {
      processServiceDurationMin(chatId, text, settings);
      return;
    }
  
  if (state === ADMIN_STATES.WAITING_SERVICE_DURATION_MAX) {
      processServiceDurationMax(chatId, text, settings);
      return;
    }
  
  if (state === ADMIN_STATES.WAITING_SERVICE_TO_EDIT) {
      processServiceToEdit(chatId, text, settings);
      return;
    }
  
  if (state === ADMIN_STATES.WAITING_SERVICE_FIELD_TO_EDIT) {
      processServiceFieldToEdit(chatId, text, settings);
      return;
    }
  
  if (state === ADMIN_STATES.WAITING_SERVICE_NEW_VALUE) {
      processServiceNewValue(chatId, text, settings);
      return;
    }
  
  if (state === ADMIN_STATES.WAITING_SERVICE_TO_DISABLE) {
      processServiceToDisable(chatId, text, settings);
      return;
    }
  
  if (state === ADMIN_STATES.WAITING_SERVICE_TO_ENABLE) {
      processServiceToEnable(chatId, text, settings);
      return;
    }
  
  if (state === ADMIN_STATES.WAITING_CUSTOMER_SERVICE_PHONE) {
      processCustomerServicePhone(chatId, text, settings);
      return;
    }
  
  if (state === ADMIN_STATES.WAITING_CUSTOMER_SERVICE_TO_EDIT) {
      processCustomerServiceToEdit(chatId, text, settings);
      return;
    }
  
  if (state === ADMIN_STATES.WAITING_CUSTOMER_SERVICE_DURATION) {
      processCustomerServiceDuration(chatId, text, settings);
      return;
    }
  
  if (text === getMessage(MESSAGE_KEYS.DELETE_CUSTOMER_SERVICE)) {
      startDeleteCustomerService(chatId, settings);
      return;
    }
  
  if (state === ADMIN_STATES.WAITING_CUSTOMER_SERVICE_TO_DELETE) {
      processCustomerServiceToDelete(chatId, text, settings);
      return;
    }
}
