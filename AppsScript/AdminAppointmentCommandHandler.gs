function handleAdminAppointmentCommand(chatId, text, settings) {
  if (text === getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_TODAY)) {
  showTodayAppointmentsAdmin(chatId, settings);
  return;
  }
  
  if (text === getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_TOMORROW)) {
  showTomorrowAppointments(
  chatId,
  settings
  );
  
  return;
  }
  
  if (text === getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_BY_PROVIDER)) {
  startAppointmentsByProvider(chatId, settings);
  return;
  }
  
  if (text === getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_BY_DATE)) {
  startAppointmentsByDate(chatId, settings);
  return;
  }
  
  if (text === getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_NEXT_WORKING_DAY)) {
  startNextWorkingDayAppointments(chatId, settings);
  return;
  }
}
