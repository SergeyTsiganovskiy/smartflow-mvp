function handleAdminAppointmentState(
  chatId,
  text,
  state,
  settings
) {
  if (state === ADMIN_STATES.WAITING_APPOINTMENTS_PROVIDER) {
  processAppointmentsProvider(chatId, text, settings);
  return;
  }
  
  if (state === ADMIN_STATES.WAITING_APPOINTMENTS_DATE) {
  processAppointmentsDate(chatId, text, settings);
  return;
  }
  
  if (state === ADMIN_STATES.WAITING_NEXT_WORKING_DAY_PROVIDER) {
  processNextWorkingDayProvider(chatId, text, settings);
  return;
  }
}
