function showTodayAppointmentsAdmin(chatId, settings) {
  setUserSessionValue(chatId, 'admin_back_menu', ADMIN_MENUS.APPOINTMENTS);

  const today = Utilities.formatDate(new Date(), settings.TimeZone || 'Europe/Kyiv', 'yyyy-MM-dd');

  const appointments = getAppointmentsByDate(today);

  if (appointments.length === 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.NO_APPOINTMENTS_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  let text = '<b>' + getMessage(MESSAGE_KEYS.APPOINTMENTS_TODAY_TITLE) + '</b>\n\n';

  appointments.forEach(function (appointment) {
    const customerText = String(appointment.customer_name || '').trim()
      ? String(appointment.customer_name || '').trim() + ' ' + String(appointment.phone || '').trim()
      : String(appointment.phone || '').trim();

    const serviceText = String(appointment.service_name || '').trim();

    const providerText = String(appointment.provider_name || '').trim();

    const locationText = String(appointment.location_name || '').trim();

    text +=
      '<b>' +
      extractTimeFromDateTime(appointment.start_at) +
      '-' +
      extractTimeFromDateTime(appointment.end_at) +
      '</b>\n';

    text += '👤 ' + (customerText || '-') + '\n';

    text += getCustomerConfirmationText(appointment) + '\n';

    text += '💅 ' + (serviceText || '-') + '\n';

    text += '👩‍💼 ' + (providerText || '-') + '\n';

    text += '📍 ' + (locationText || '-') + '\n';

    if (appointment.source === 'calendar_manual') {
      text += '📌 ' + getMessage(MESSAGE_KEYS.MANUAL_CALENDAR_APPOINTMENT_LABEL) + '\n';
    }

    text += '\n';
  });

  sendTelegramMessage(settings.AdminBotToken, chatId, text, buildKeyboardWithMainMenu([]));
}

function showTomorrowAppointments(chatId, settings) {
  setUserSessionValue(chatId, 'admin_back_menu', ADMIN_MENUS.APPOINTMENTS);

  const tomorrow = new Date();

  tomorrow.setDate(tomorrow.getDate() + 1);

  const dateString = Utilities.formatDate(tomorrow, settings.TimeZone || 'Europe/Kyiv', 'yyyy-MM-dd');

  const appointments = getAppointmentsByDate(dateString);

  if (appointments.length === 0) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.NO_APPOINTMENTS_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  let text = '<b>' + getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_TOMORROW) + '</b>\n\n';

  appointments.forEach(function (appointment) {
    const customerText = String(appointment.customer_name || '').trim()
      ? String(appointment.customer_name || '').trim() + ' ' + String(appointment.phone || '').trim()
      : String(appointment.phone || '').trim();

    const serviceText = String(appointment.service_name || '').trim();

    const providerText = String(appointment.provider_name || '').trim();

    const locationText = String(appointment.location_name || '').trim();

    text +=
      '<b>' +
      extractTimeFromDateTime(appointment.start_at) +
      '-' +
      extractTimeFromDateTime(appointment.end_at) +
      '</b>\n';

    text += '👤 ' + (customerText || '-') + '\n';

    text += getCustomerConfirmationText(appointment) + '\n';

    text += '💅 ' + (serviceText || '-') + '\n';

    text += '👩‍💼 ' + (providerText || '-') + '\n';

    text += '📍 ' + (locationText || '-') + '\n';

    if (appointment.source === 'calendar_manual') {
      text += '📌 ' + getMessage(MESSAGE_KEYS.MANUAL_CALENDAR_APPOINTMENT_LABEL) + '\n';
    }

    text += '\n';
  });

  sendTelegramMessage(settings.AdminBotToken, chatId, text, buildKeyboardWithMainMenu([]));
}

function showAppointmentsByDateAdmin(chatId, settings, dateValue) {
  setUserSessionValue(chatId, 'admin_back_menu', ADMIN_MENUS.APPOINTMENTS);

  const appointments = getAppointmentsByDate(dateValue);

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
    '<b>' + getMessage(MESSAGE_KEYS.APPOINTMENTS_BY_DATE_TITLE) + ': ' + formatDateForDisplay(dateValue) + '</b>\n\n';

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

    text += '👩‍💼 ' + (appointment.provider_name || '-') + '\n';

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
