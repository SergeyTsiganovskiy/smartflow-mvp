
function sendAppointmentsMenu(chatId, settings) {
  navigateAdmin(chatId, ADMIN_MENUS.APPOINTMENTS);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS),
    buildAppointmentsMenuKeyboard()
  );
}

function buildAppointmentsMenuKeyboard() {
  return buildKeyboardWithMainMenu([
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_TODAY) }],
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_TOMORROW) }],
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_NEXT_WORKING_DAY) }],
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_BY_PROVIDER) }],
    [{ text: getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_BY_DATE) }]
  ]);
}

function showTodayAppointmentsAdmin(chatId, settings) {
  setUserSessionValue(
    chatId,
    'admin_back_menu',
    ADMIN_MENUS.APPOINTMENTS
  );

  const today =
    Utilities.formatDate(
      new Date(),
      settings.TimeZone || 'Europe/Kyiv',
      'yyyy-MM-dd'
    );

  const appointments =
    getCachedAppointmentsByDate(today);

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
    getMessage(MESSAGE_KEYS.APPOINTMENTS_TODAY_TITLE) +
    '</b>\n\n';

  appointments.forEach(function(appointment) {
    const customerText =
      String(appointment.customer_name || '').trim()
        ? String(appointment.customer_name || '').trim() +
          ' ' +
          String(appointment.phone || '').trim()
        : String(appointment.phone || '').trim();

    const serviceText =
      String(appointment.service_name || '').trim();

    const providerText =
      String(appointment.provider_name || '').trim();

    const locationText =
      String(appointment.location_name || '').trim();

    text +=
      '<b>' +
      extractTimeFromDateTime(appointment.start_at) +
      '-' +
      extractTimeFromDateTime(appointment.end_at) +
      '</b>\n';

    text +=
      '👤 ' +
      (customerText || '-') +
      '\n';

    text +=
      getCustomerConfirmationText(appointment) +
      '\n';

    text +=
      '💅 ' +
      (serviceText || '-') +
      '\n';

    text +=
      '👩‍💼 ' +
      (providerText || '-') +
      '\n';

    text +=
      '📍 ' +
      (locationText || '-') +
      '\n';

    if (appointment.source === 'calendar_manual') {
      text +=
        '📌 ' +
        getMessage(
          MESSAGE_KEYS.MANUAL_CALENDAR_APPOINTMENT_LABEL
        ) +
        '\n';
    }

    text += '\n';
  });

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    text,
    buildKeyboardWithMainMenu([])
  );
}

function showTomorrowAppointments(
  chatId,
  settings
) {
  setUserSessionValue(
    chatId,
    'admin_back_menu',
    ADMIN_MENUS.APPOINTMENTS
  );

  const tomorrow =
    new Date();

  tomorrow.setDate(
    tomorrow.getDate() + 1
  );

  const dateString =
    Utilities.formatDate(
      tomorrow,
      settings.TimeZone || 'Europe/Kyiv',
      'yyyy-MM-dd'
    );

  const appointments =
    getCachedAppointmentsByDate(dateString);

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
    getMessage(MESSAGE_KEYS.ADMIN_APPOINTMENTS_TOMORROW) +
    '</b>\n\n';

  appointments.forEach(function(appointment) {
    const customerText =
      String(appointment.customer_name || '').trim()
        ? String(appointment.customer_name || '').trim() +
          ' ' +
          String(appointment.phone || '').trim()
        : String(appointment.phone || '').trim();

    const serviceText =
      String(appointment.service_name || '').trim();

    const providerText =
      String(appointment.provider_name || '').trim();

    const locationText =
      String(appointment.location_name || '').trim();

    text +=
      '<b>' +
      extractTimeFromDateTime(appointment.start_at) +
      '-' +
      extractTimeFromDateTime(appointment.end_at) +
      '</b>\n';

    text +=
      '👤 ' +
      (customerText || '-') +
      '\n';

    text +=
      getCustomerConfirmationText(appointment) +
      '\n';

    text +=
      '💅 ' +
      (serviceText || '-') +
      '\n';

    text +=
      '👩‍💼 ' +
      (providerText || '-') +
      '\n';

    text +=
      '📍 ' +
      (locationText || '-') +
      '\n';

    if (appointment.source === 'calendar_manual') {
      text +=
        '📌 ' +
        getMessage(
          MESSAGE_KEYS.MANUAL_CALENDAR_APPOINTMENT_LABEL
        ) +
        '\n';
    }

    text += '\n';
  });

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    text,
    buildKeyboardWithMainMenu([])
  );
}

function startAppointmentsByProvider(chatId, settings) {
  const providers = getProviders();
  const keyboardRows = [];

  providers.forEach(function(provider) {
    keyboardRows.push([
      {
        text: provider.name
      }
    ]);
  });

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_APPOINTMENTS_PROVIDER
  );

  setPreviousMenu(
    chatId,
    'APPOINTMENTS_MENU'
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_PROVIDER_FOR_APPOINTMENTS),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function processAppointmentsProvider(chatId, text, settings) {
  const provider =
    findProviderByName(text);

  if (!provider) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.PROVIDER_SELECT_FROM_LIST)
    );

    return;
  }

  setUserState(chatId, '');

  setUserSessionValue(
    chatId,
    'admin_back_menu',
    ADMIN_MENUS.APPOINTMENTS
  );

  showAppointmentsByProviderAdmin(
    chatId,
    settings,
    provider
  );
}

function startAppointmentsByDate(chatId, settings) {
  const keyboardRows =
    buildAppointmentDateKeyboardRows(settings);

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_APPOINTMENTS_DATE
  );

  setPreviousMenu(
    chatId,
    'APPOINTMENTS_MENU'
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.SELECT_APPOINTMENT_DATE),
    buildKeyboardWithMainMenu(keyboardRows)
  );
}

function buildAppointmentDateKeyboardRows(settings) {
  const timezone =
    settings.TimeZone || 'Europe/Kyiv';

  const rows = [];

  const cacheDays =
    Number(
      settings.CalendarCacheDays || 30
    );

  for (let i = 0; i <= cacheDays; i++) {
    const date = new Date();

    date.setDate(
      date.getDate() + i
    );

    rows.push([
      {
        text: Utilities.formatDate(
          date,
          timezone,
          'dd.MM.yyyy'
        )
      }
    ]);
  }

  return rows;
}

function processAppointmentsDate(chatId, text, settings) {

  setUserSessionValue(
    chatId,
    'admin_back_menu',
    ADMIN_MENUS.APPOINTMENTS
  );

  const dateValue =
    parseDateFromDisplayText(text, settings);

  if (!dateValue) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.SELECT_APPOINTMENT_DATE)
    );

    return;
  }

  setUserState(chatId, '');



  showAppointmentsByDateAdmin(
    chatId,
    settings,
    dateValue
  );
}

function startNextWorkingDayAppointments(
  chatId,
  settings
) {
  const providers =
    getProviders();

  const keyboardRows = [];

  providers.forEach(function(provider) {
    keyboardRows.push([
      {
        text: provider.name
      }
    ]);
  });

  setUserState(
    chatId,
    ADMIN_STATES.WAITING_NEXT_WORKING_DAY_PROVIDER
  );

  setPreviousMenu(
    chatId,
    'APPOINTMENTS_MENU'
  );

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(
      MESSAGE_KEYS.SELECT_PROVIDER_FOR_NEXT_WORKING_DAY
    ),
    buildKeyboardWithMainMenu(
      keyboardRows
    )
  );
}

function processNextWorkingDayProvider(
  chatId,
  text,
  settings
) {

  setUserSessionValue(
    chatId,
    'admin_back_menu',
    ADMIN_MENUS.APPOINTMENTS
  );
  const provider =
    findProviderByName(text);

  if (!provider) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(
        MESSAGE_KEYS.PROVIDER_SELECT_FROM_LIST
      )
    );

    return;
  }

  setUserState(chatId, '');

  showNextWorkingDayAppointmentsAdmin(
    chatId,
    settings,
    provider
  );
}

function showAppointmentsByDateAdmin(
  chatId,
  settings,
  dateValue
) {
  setUserSessionValue(
    chatId,
    'admin_back_menu',
    ADMIN_MENUS.APPOINTMENTS
  );

  const appointments =
    getCachedAppointmentsByDate(dateValue);

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
    getMessage(MESSAGE_KEYS.APPOINTMENTS_BY_DATE_TITLE) +
    ': ' +
    formatDateForDisplay(dateValue) +
    '</b>\n\n';

  appointments.forEach(function(appointment) {
    text +=
      '<b>' +
      extractTimeFromDateTime(appointment.start_at) +
      '-' +
      extractTimeFromDateTime(appointment.end_at) +
      '</b>\n';

    text +=
      '👤 ' +
      (
        appointment.customer_name
          ? appointment.customer_name + ' ' + appointment.phone
          : appointment.phone || '-'
      ) +
      '\n';

    text +=
      getCustomerConfirmationText(appointment) +
      '\n';

    text +=
      '💅 ' +
      (appointment.service_name || '-') +
      '\n';

    text +=
      '👩‍💼 ' +
      (appointment.provider_name || '-') +
      '\n';

    text +=
      '📍 ' +
      (appointment.location_name || '-') +
      '\n';

    if (appointment.customer_note) {
      text +=
        '📝 ' +
        appointment.customer_note +
        '\n';
    }

    if (appointment.source === 'calendar_manual') {
      text +=
        '📌 ' +
        getMessage(MESSAGE_KEYS.MANUAL_CALENDAR_APPOINTMENT_LABEL) +
        '\n';
    }

    text += '\n';
  });

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    text,
    buildKeyboardWithMainMenu([])
  );
}

function showAppointmentsByProviderAdmin(
  chatId,
  settings,
  provider
) {
  setUserSessionValue(
    chatId,
    'admin_back_menu',
    ADMIN_MENUS.APPOINTMENTS
  );

  const appointments =
    getCachedAppointmentsByProvider(
      provider.provider_id
    );

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
    getMessage(MESSAGE_KEYS.APPOINTMENTS_BY_PROVIDER_TITLE) +
    ': ' +
    provider.name +
    '</b>\n\n';

  appointments.forEach(function(appointment) {
    text +=
      '<b>' +
      formatDateTimeForDisplay(appointment.start_at) +
      ' - ' +
      extractTimeFromDateTime(appointment.end_at) +
      '</b>\n';

    text +=
      '👤 ' +
      (
        appointment.customer_name
          ? appointment.customer_name + ' ' + appointment.phone
          : appointment.phone || '-'
      ) +
      '\n';

    text +=
      getCustomerConfirmationText(appointment) +
      '\n';

    text +=
      '💅 ' +
      (appointment.service_name || '-') +
      '\n';

    text +=
      '📍 ' +
      (appointment.location_name || '-') +
      '\n';

    if (appointment.customer_note) {
      text +=
        '📝 ' +
        appointment.customer_note +
        '\n';
    }

    if (appointment.source === 'calendar_manual') {
      text +=
        '📌 ' +
        getMessage(MESSAGE_KEYS.MANUAL_CALENDAR_APPOINTMENT_LABEL) +
        '\n';
    }

    text += '\n';
  });

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    text,
    buildKeyboardWithMainMenu([])
  );
}

function showNextWorkingDayAppointmentsAdmin(
  chatId,
  settings,
  provider
) {
  setUserSessionValue(
    chatId,
    'admin_back_menu',
    ADMIN_MENUS.APPOINTMENTS
  );

  const providerId =
    provider.provider_id ||
    provider.id;

  const nextWorkingDate =
    getNextWorkingDateForProvider(
      providerId
    );

  if (!nextWorkingDate) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.NO_APPOINTMENTS_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  const appointments =
    getCachedAppointmentsByDate(
      nextWorkingDate
    ).filter(function(appointment) {
      return (
        String(appointment.provider_id) ===
        String(providerId)
      );
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

  appointments.forEach(function(appointment) {
    text +=
      '<b>' +
      extractTimeFromDateTime(appointment.start_at) +
      '-' +
      extractTimeFromDateTime(appointment.end_at) +
      '</b>\n';

    text +=
      '👤 ' +
      (
        appointment.customer_name
          ? appointment.customer_name + ' ' + appointment.phone
          : appointment.phone || '-'
      ) +
      '\n';

    text +=
      getCustomerConfirmationText(appointment) +
      '\n';

    text +=
      '💅 ' +
      (appointment.service_name || '-') +
      '\n';

    text +=
      '📍 ' +
      (appointment.location_name || '-') +
      '\n';

    if (appointment.customer_note) {
      text +=
        '📝 ' +
        appointment.customer_note +
        '\n';
    }

    if (appointment.source === 'calendar_manual') {
      text +=
        '📌 ' +
        getMessage(MESSAGE_KEYS.MANUAL_CALENDAR_APPOINTMENT_LABEL) +
        '\n';
    }

    text += '\n';
  });

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    text,
    buildKeyboardWithMainMenu([])
  );
}
