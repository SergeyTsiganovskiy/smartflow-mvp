function startAppointmentsByProvider(chatId, settings) {
  const providers = getProviders();
  const keyboardRows = [];

  providers.forEach(function (provider) {
    keyboardRows.push([
      {
        text: provider.name
      }
    ]);
  });

  setUserState(chatId, ADMIN_STATES.WAITING_APPOINTMENTS_PROVIDER);

  setPreviousMenu(chatId, 'APPOINTMENTS_MENU');

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_PROVIDER_FOR_APPOINTMENTS),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processAppointmentsProvider(chatId, text, settings) {
  const provider = findProviderByName(text);

  if (!provider) {
    sendTelegramMessage(settings.AdminBotToken, chatId, getMessage(MESSAGE_KEYS.PROVIDER_SELECT_FROM_LIST));

    return;
  }

  setUserState(chatId, '');

  setUserSessionValue(chatId, 'admin_back_menu', ADMIN_MENUS.APPOINTMENTS);

  showAppointmentsByProviderAdmin(chatId, settings, provider);
}

function startAppointmentsByDate(chatId, settings) {
  const keyboardRows = buildAppointmentDateKeyboardRows(settings);

  setUserState(chatId, ADMIN_STATES.WAITING_APPOINTMENTS_DATE);

  setPreviousMenu(chatId, 'APPOINTMENTS_MENU');

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_APPOINTMENT_DATE),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function buildAppointmentDateKeyboardRows(settings) {
  const timezone = settings.TimeZone || 'Europe/Kyiv';

  const rows = [];

  const bookingDays = Number(settings.BookingDaysAhead || 30);

  for (let i = 0; i <= bookingDays; i++) {
    const date = new Date();

    date.setDate(date.getDate() + i);

    rows.push([
      {
        text: Utilities.formatDate(date, timezone, 'dd.MM.yyyy')
      }
    ]);
  }

  return rows;
}

function processAppointmentsDate(chatId, text, settings) {
  setUserSessionValue(chatId, 'admin_back_menu', ADMIN_MENUS.APPOINTMENTS);

  const dateValue = parseDateFromDisplayText(text, settings);

  if (!dateValue) {
    sendTelegramMessage(settings.AdminBotToken, chatId, getMessage(MESSAGE_KEYS.SELECT_APPOINTMENT_DATE));

    return;
  }

  setUserState(chatId, '');

  showAppointmentsByDateAdmin(chatId, settings, dateValue);
}

function showAppointmentsByProviderAdmin(chatId, settings, provider) {
  setUserSessionValue(chatId, 'admin_back_menu', ADMIN_MENUS.APPOINTMENTS);

  const appointments = getAppointmentsByProvider(provider.provider_id || provider.id);

  if (appointments.length === 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.NO_APPOINTMENTS_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  let text = '<b>' + getMessage(MESSAGE_KEYS.APPOINTMENTS_BY_PROVIDER_TITLE) + ': ' + provider.name + '</b>\n\n';

  appointments.forEach(function (appointment) {
    text +=
      '<b>' +
      formatDateTimeForDisplay(appointment.start_at) +
      ' - ' +
      extractTimeFromDateTime(appointment.end_at) +
      '</b>\n';

    text +=
      '👤 ' +
      (appointment.customer_name ? appointment.customer_name + ' ' + appointment.phone : appointment.phone || '-') +
      '\n';

    text += getCustomerConfirmationText(appointment) + '\n';

    text += '💅 ' + (appointment.service_name || '-') + '\n';

    text += '📍 ' + (appointment.location_name || '-') + '\n';

    if (appointment.customer_note) {
      text += '📝 ' + appointment.customer_note + '\n';
    }

    if (appointment.source === 'calendar_manual') {
      text += '📌 ' + getMessage(MESSAGE_KEYS.MANUAL_CALENDAR_APPOINTMENT_LABEL) + '\n';
    }

    text += '\n';
  });

  sendTelegramMessage(settings.AdminBotToken, chatId, text, buildKeyboardWithMainMenu([]));
}
