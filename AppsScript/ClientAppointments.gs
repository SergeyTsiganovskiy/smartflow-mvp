function askPhoneForAppointments(chatId, settings) {
  setUserState(chatId, STATES.WAITING_MY_APPOINTMENTS_PHONE);

  const keyboard = buildKeyboardWithMainMenu([]);

  sendTelegramMessage(settings.ClientBotToken, chatId, getMessage(MESSAGE_KEYS.ENTER_PHONE_FOR_APPOINTMENTS), keyboard);
}

function showMyAppointmentsByPhone(chatId, settings, phone) {
  const appointments = getActiveAppointmentsByPhone(phone);

  const calendarAppointments = getCalendarAppointmentsByPhone(phone).filter(isCurrentOrFutureAppointment);

  const visibleAppointments = [];

  appointments.forEach(function (appointment) {
    const syncedAppointment = syncAppointmentWithCalendar(appointment);

    if (!syncedAppointment) {
      return;
    }

    if (String(syncedAppointment.status || '').toLowerCase() !== 'confirmed') {
      return;
    }

    if (!isCurrentOrFutureAppointment(syncedAppointment)) {
      return;
    }

    visibleAppointments.push(syncedAppointment);
  });

  if (visibleAppointments.length === 0 && calendarAppointments.length === 0) {
    setUserState(chatId, STATES.WAITING_MY_APPOINTMENTS_PHONE);

    sendTelegramMessage(settings.ClientBotToken, chatId, getMessage(MESSAGE_KEYS.NO_ACTIVE_APPOINTMENTS));

    return;
  }

  sendTelegramMessage(
    settings.ClientBotToken,
    chatId,
    '<b>' + getMessage(MESSAGE_KEYS.YOUR_APPOINTMENTS) + '</b>',
    buildKeyboardWithMainMenu([])
  );

  visibleAppointments.forEach(function (appointment) {
    const service = findServiceById(appointment.service_id);

    const provider = findProviderById(appointment.provider_id);

    const location = findLocationById(appointment.location_id);

    sendAppointmentCard(chatId, settings, appointment, service, provider, location);
  });

  calendarAppointments.forEach(function (appointment) {
    sendCalendarAppointmentCard(chatId, settings, appointment);
  });

  setUserState(chatId, '');
}
