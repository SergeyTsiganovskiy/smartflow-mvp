function startCustomerProfile(chatId, settings) {
  navigateAdmin(chatId, ADMIN_MENUS.CUSTOMERS, ADMIN_STATES.WAITING_CUSTOMER_PROFILE_PHONE);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_CUSTOMER_PHONE),
    buildKeyboardWithMainMenu([])
  );
}

function processCustomerProfilePhone(chatId, text, settings) {
  const profile = findCustomerProfileByPhone(text);

  if (!profile || profile.active === false) {
    setUserState(chatId, ADMIN_STATES.WAITING_CUSTOMER_PROFILE_PHONE);

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.CUSTOMER_NOT_FOUND) + '\n\n' + getMessage(MESSAGE_KEYS.ENTER_CUSTOMER_PHONE),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserState(chatId, '');

  showCustomerProfile(chatId, settings, profile);
}

function showCustomerProfile(chatId, settings, profile) {
  const nextAppointment = getNextCustomerAppointment(profile.phone);

  let text = '<b>' + getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_TITLE) + '</b>\n\n';

  text += '<b>Основная информация</b>\n';

  text += '👤 Имя: ' + (profile.name || '-') + '\n';

  text += '📞 Телефон: ' + formatPhoneForDisplay(profile.phone) + '\n\n';

  text += '<b>Записи и визиты</b>\n';

  text +=
    '📅 Последний визит: ' + (profile.last_visit_at ? formatDateTimeForDisplay(profile.last_visit_at) : '-') + '\n';

  text += '🔢 Всего визитов: ' + (profile.visit_count || 0) + '\n\n';

  text += '<b>Следующая запись</b>\n';

  if (nextAppointment) {
    text += '🕒 ' + formatDateTimeForDisplay(nextAppointment.start_at) + '\n';

    text += '💇 ' + (nextAppointment.service_name || '-') + '\n';

    text += '👩 ' + (nextAppointment.provider_name || '-') + '\n';

    text += '🏢 ' + (nextAppointment.location_name || '-') + '\n\n';
  } else {
    text += 'Записей нет\n\n';
  }

  text += '<b>Информация для мастера</b>\n';

  text += '🛍 Подсказка продажи: ' + (profile.sales_hint || '-') + '\n';

  text += '📝 Заметка: ' + (profile.note || '-') + '\n';

  sendTelegramMessage(settings.AdminBotToken, chatId, text, buildKeyboardWithMainMenu([]));
}

function startEditCustomerProfile(chatId, settings) {
  setUserState(chatId, ADMIN_STATES.WAITING_CUSTOMER_PROFILE_EDIT_PHONE);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.ENTER_CUSTOMER_PHONE),
    buildKeyboardWithMainMenu([])
  );
}

function processEditCustomerProfilePhone(chatId, text, settings) {
  const profile = findCustomerProfileByPhone(text);

  if (!profile || profile.active === false) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.CUSTOMER_NOT_FOUND) + '\n\n' + getMessage(MESSAGE_KEYS.ENTER_CUSTOMER_PHONE),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  setUserSessionValue(chatId, 'customer_profile_id', profile.profile_id);

  setUserState(chatId, ADMIN_STATES.WAITING_CUSTOMER_PROFILE_EDIT_FIELD);

  showCustomerProfileEditFieldMenu(chatId, settings, profile);
}

function showCustomerProfileEditFieldMenu(chatId, settings, profile) {
  let text = '<b>' + getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_TITLE) + '</b>\n\n';

  text += '<b>Основная информация</b>\n';

  text += '👤 Имя: ' + (profile.name || '-') + '\n';

  text += '📞 Телефон: ' + (profile.phone || '-') + '\n\n';

  text += '<b>Визиты</b>\n';

  text +=
    '📅 Последняя запись: ' + (profile.last_visit_at ? formatDateTimeForDisplay(profile.last_visit_at) : '-') + '\n';

  text += '🔢 Всего записей: ' + (profile.visit_count || 0) + '\n\n';

  text += '<b>Информация для мастера</b>\n';

  text += '🛍 Подсказка продажи: ' + (profile.sales_hint || '-') + '\n';

  text += '📝 Заметка: ' + (profile.note || '-') + '\n\n';

  text += '<b>' + getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_EDIT_FIELD) + '</b>';

  sendTelegramMessage(settings.AdminBotToken, chatId, text, buildCustomerProfileEditFieldKeyboard());
}

function buildCustomerProfileEditFieldKeyboard() {
  return buildKeyboardWithMainMenu([
    [
      {
        text: getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_EDIT_NAME)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_EDIT_SALES_HINT)
      }
    ],
    [
      {
        text: getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_EDIT_NOTE)
      }
    ]
  ]);
}

function processEditCustomerProfileField(chatId, text, settings) {
  let field = '';

  if (text === getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_EDIT_NAME)) {
    field = 'name';
  }

  if (text === getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_EDIT_SALES_HINT)) {
    field = 'sales_hint';
  }

  if (text === getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_EDIT_NOTE)) {
    field = 'note';
  }

  if (!field) {
    return;
  }

  setUserSessionValue(chatId, 'customer_profile_field', field);

  setUserState(chatId, ADMIN_STATES.WAITING_CUSTOMER_PROFILE_EDIT_VALUE);

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_ENTER_NEW_VALUE),
    buildKeyboardWithMainMenu([])
  );
}

function processEditCustomerProfileValue(chatId, text, settings) {
  const session = getUserSession(chatId);

  const profileId = session.customer_profile_id;

  const field = session.customer_profile_field;

  if (!profileId || !field) {
    setUserState(chatId, '');

    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.CUSTOMER_NOT_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  const updates = {};

  updates[field] = text;

  const updated = updateCustomerProfile(profileId, updates);

  setUserState(chatId, '');

  if (!updated) {
    sendTelegramMessage(
      settings.AdminBotToken,
      chatId,
      getMessage(MESSAGE_KEYS.CUSTOMER_NOT_FOUND),
      buildKeyboardWithMainMenu([])
    );

    return;
  }

  sendTelegramMessage(
    settings.AdminBotToken,
    chatId,
    getMessage(MESSAGE_KEYS.CUSTOMER_PROFILE_UPDATED),
    buildKeyboardWithMainMenu([])
  );
}
