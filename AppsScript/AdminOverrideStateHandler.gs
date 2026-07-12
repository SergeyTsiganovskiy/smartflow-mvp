function handleAdminOverrideState(
  chatId,
  text,
  state,
  settings
) {
  // =========================
  // PROVIDER OVERRIDES STATES
  // =========================
  
  if (state === ADMIN_STATES.WAITING_PROVIDER_FOR_OVERRIDE) {
  processProviderForOverride(chatId, text, settings);
  return;
  }
  
  if (state === ADMIN_STATES.WAITING_OVERRIDE_ACTION) {
  processOverrideAction(chatId, text, settings);
  return;
  }
  
  if (state === ADMIN_STATES.WAITING_OVERRIDE_REASON) {
  processOverrideReason(chatId, text, settings);
  return;
  }
  
  if (state === ADMIN_STATES.WAITING_OVERRIDE_DATE) {
  processOverrideDate(chatId, text, settings);
  return;
  }
  
  if (state === ADMIN_STATES.WAITING_OVERRIDE_START_TIME) {
  processOverrideStartTime(chatId, text, settings);
  return;
  }
  
  if (state === ADMIN_STATES.WAITING_OVERRIDE_END_TIME) {
  processOverrideEndTime(chatId, text, settings);
  return;
  }
  
  if (state === ADMIN_STATES.WAITING_OVERRIDE_TO_DELETE) {
  processOverrideToDelete(chatId, text, settings);
  return;
  }
}
