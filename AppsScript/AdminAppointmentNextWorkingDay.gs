function startNextWorkingDayAppointments(chatId, settings) {
  const providers = getProviders();

  const keyboardRows = [];

  providers.forEach(function (provider) {
    keyboardRows.push([
      {
        text: provider.name
      }
    ]);
  });

  setUserState(chatId, ADMIN_STATES.WAITING_NEXT_WORKING_DAY_PROVIDER);

  setPreviousMenu(chatId, 'APPOINTMENTS_MENU');

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_PROVIDER_FOR_NEXT_WORKING_DAY),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processNextWorkingDayProvider(chatId, text, settings) {
  setUserSessionValue(chatId, 'admin_back_menu', ADMIN_MENUS.APPOINTMENTS);
  const provider = findProviderByName(text);

  if (!provider) {
    sendTelegramMessage(settings.AdminBotToken, chatId, getMessage(MESSAGE_KEYS.PROVIDER_SELECT_FROM_LIST));

    return;
  }

  setUserState(chatId, '');

  showNextWorkingDayAppointmentsAdmin(chatId, settings, provider);
}

function showNextWorkingDayAppointmentsAdmin(chatId, settings, provider) {
  setUserSessionValue(chatId, 'admin_back_menu', ADMIN_MENUS.APPOINTMENTS);

  const providerId = provider.provider_id || provider.id;

  const nextWorkingDate = getNextWorkingDateForProvider(providerId);

  if (!nextWorkingDate) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.NO_APPOINTMENTS_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  const appointments = getAppointmentsByDate(nextWorkingDate).filter(function (appointment) {
    return String(appointment.provider_id) === String(providerId);
  });

  if (appointments.length === 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.NO_APPOINTMENTS_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  let text =
    '<b>' +
    getMessage(MESSAGE_KEYS.APPOINTMENTS_NEXT_WORKING_DAY_TITLE) +
    ': ' +
    provider.name +
    ' — ' +
    formatDateForDisplay(nextWorkingDate) +
    '</b>\n\n';

  appointments.forEach(function (appointment) {
    text +=
      '<b>' +
      extractTimeFromDateTime(appointment.start_at) +
      '-' +
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
